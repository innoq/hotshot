const puppeteer = require('puppeteer')
const url = require('url')
const express = require('express')
const app = express()

const TARGET_HOST = process.env.TARGET_HOST
const TIMEOUT = 5000
const PORT = process.env.PORT || 5000;

if (!TARGET_HOST) {
  console.error("💥 Missing target host name, exiting.")
  process.exit(1)
}

app.get('/', (req, res) => {
  res.send("GET /shoot?path=…&selector=… to take a screenshot")
})

app.get('/shoot', async (req, res) => {
  const path = req.query.path
  const selector = req.query.selector

  if (!path || !selector) {
    res.status(422)
    return res.end()
  }

  const target = url.resolve(TARGET_HOST, path)

  console.log(`📸 ${target} => ${selector}`)

  try {
    const screenshot = await takeScreenshot(target, selector)
    res.type('image/png')
    res.send(screenshot)
  } catch(e) {
    console.error(e)
    res.status(500)
    res.end()
  }
})

app.listen(PORT, () => console.log(`Hotshot listening on port ${PORT}.`))

async function takeScreenshot (url, selector, padding = 0) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage()

  page.setDefaultNavigationTimeout(TIMEOUT)
  page.setViewport({ width: 1000, height: 600, deviceScaleFactor: 2 })

  await page.goto(url, { waitUntil: 'networkidle2' })

  const rect = await page.evaluate(selector => {
    const element = document.querySelector(selector)
    const { x, y, width, height } = element.getBoundingClientRect()
    return { left: x, top: y, width, height, id: element.id }
  }, selector)

  const screenshot = await page.screenshot({
    // path: 'element.png',
    clip: {
      x: rect.left - padding,
      y: rect.top - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2
    }
  })

  await browser.close()

  return screenshot
}
