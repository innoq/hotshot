const Raven = require('raven')
const puppeteer = require('puppeteer')
const express = require('express')
const URL = require('url').URL
const app = express()
require('express-negotiate')

app.set('etag', 'strong')

if (process.env.NODE_ENV === 'production' && process.env.RAVEN_ENDPOINT) {
  Raven.config(process.env.RAVEN_ENDPOINT).install()
}

const TARGET_HOST = process.env.TARGET_HOST
const TIMEOUT = process.env.TIMEOUT || 5000
const PORT = process.env.PORT || 5000
const MAX_AGE = process.env.MAX_AGE || 600

if (!TARGET_HOST) {
  console.error('💥 Missing target host name, exiting.')
  process.exit(1)
}

app.get('/', (req, res) => {
  res.send('GET /shoot?path=…&selector=… to take a screenshot')
})

app.get('/shoot', async (req, res) => {
  const path = req.query.path
  const selector = req.query.selector
  const padding = parseInt(req.query.padding) || 0

  if (!path || !selector) {
    res.status(422)
    return res.end()
  }

  const target = new URL(path, TARGET_HOST)

  try {
    let format
    req.negotiate({
      'image/jpeg;q=1.1': () => {
        format = 'jpeg'
      },
      'image/webp;q=0.9': () => {
        format = 'webp'
      },
      default: () => {
        format = 'jpeg'
      }
    })
    console.log(`accept: ${req.headers.accept}, sending ${format}...`)

    const screenshot = await takeScreenshot(target, selector, padding, format)
    if (screenshot) {
      res.type('image/' + format)
      res.header('Cache-Control', `max-age=${MAX_AGE}, s-max-age=${MAX_AGE}, public`)
      res.send(screenshot)
    } else {
      res.status(422)
      return res.end()
    }
  } catch (e) {
    console.error(e)
    res.status(500)
    res.end()
  }
})

app.listen(PORT, () => console.log(`Hotshot listening on port ${PORT}.`))

async function takeScreenshot (url, selector, padding = 0, format = 'jpeg') {
  let screenshot
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  })
  const page = await browser.newPage()

  page.setDefaultNavigationTimeout(TIMEOUT)
  page.setViewport({ width: 1600, height: 900, deviceScaleFactor: 2 })

  await page.goto(url, { waitUntil: 'networkidle2' })
    .catch((err) => {
      browser.close()
      throw err
    })

  const rect = await page.evaluate(selector => {
    const element = document.querySelector(selector)
    if (!element) {
      return null
    }
    const { x, y, width, height } = element.getBoundingClientRect()
    return { left: x, top: y, width, height, id: element.id }
  }, selector)

  if (rect) {
    screenshot = await page.screenshot({
      type: format,
      quality: 80,
      clip: {
        x: rect.left - padding,
        y: rect.top - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2
      }
    })
    console.log(`📸 ${url} => ${selector}`)
  } else {
    console.error(`💥 Can't find selector ${selector}`)
  }

  browser.close()
  return screenshot
}
