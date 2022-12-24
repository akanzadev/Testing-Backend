const puppeter = require('puppeteer')

const launchTest = async ({ clientUrl }) => {
  const browser = await puppeter.launch({
    headless: false,
    /*   defaultViewport: {
      width: 1920,
      height: 1080
    } */
    args: [
      '--start-maximized' // you can also use '--start-fullscreen'
	 ]
  })
  const page = await browser.newPage()
  await page.goto(clientUrl)

  await page.waitForSelector('#email')
  await page.waitForSelector('#password')
  await page.type('#email', 'admin@gmail.com')
  await page.type('#password', '123456')
  await page.waitForSelector('#btn-submit')
  await page.click('#btn-submit')

  await page.waitForTimeout(2000)

  await page.waitForSelector('.layout-profile')
  await page.waitForSelector('#admin-provider')
  await page.click('#admin-provider')

  await page.waitForTimeout(2000)

  await page.waitForSelector('#btn-add-provider')
  await page.click('#btn-add-provider')

  await page.waitForTimeout(2000)

  const randomProvider = Math.floor(Math.random() * 1000)
  await page.waitForSelector('#name')
  await page.waitForSelector('#email')
  await page.waitForSelector('#phone')
  await page.waitForSelector('#address')
  await page.waitForSelector('#image')
  await page.type('#name', 'Provider' + randomProvider)
  await page.type('#email', `provider${randomProvider}@gmail.com`)
  await page.type('#phone', '123456789')
  await page.type('#address', 'Address 1')
  await page.type('#image', 'https://picsum.photos/200/300')

  await page.waitForSelector('#add-provider')
  await page.click('#add-provider')

  await page.waitForTimeout(5000)
  await page.close()
  await browser.close()
}

module.exports = { launchTest }
