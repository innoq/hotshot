const Raven = require('raven')
const puppeteer = require('puppeteer')
const url = require('url')
const express = require('express')
const app = express()
const gm = require('gm')

if (process.env.NODE_ENV === 'production' && process.env.RAVEN_ENDPOINT) {
  Raven.config(process.env.RAVEN_ENDPOINT).install()
}

const TARGET_HOST = process.env.TARGET_HOST
const TIMEOUT = process.env.TIMEOUT || 5000
const PORT = process.env.PORT || 5000

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

  const target = url.resolve(TARGET_HOST, path)

  try {
    const screenshot = await takeScreenshot(target, selector, padding)
    if (screenshot) {
      res.type('image/png')
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

function postprocess (screenshot) {
  return new Promise(function (resolve, reject) {
    gm(screenshot, 'screenshot.png')
      .stroke('#6d6de7')
      .drawLine(0, 1, 0, 4)
      .transparent('#6d6de7')
      .toBuffer('PNG', function (err, data) {
        if (!err) resolve(data)
        else reject(err)
      })
  })
}

async function takeScreenshot (url, selector, padding = 0) {
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
  page.setViewport({ width: 1000, height: 600, deviceScaleFactor: 2 })

  await page.goto(url, { waitUntil: 'networkidle2' })

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
      clip: {
        x: rect.left - padding,
        y: rect.top - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2
      }
    }).then(postprocess)
    console.log(`📸 ${url} => ${selector}`)
  } else {
    console.error(`💥 Can't find selector ${selector}`)
  }

  browser.close()
  return screenshot
}
