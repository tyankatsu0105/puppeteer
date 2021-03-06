const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');

// ===========================================
// 設定
// ===========================================
const targetUrl = 'https://github.com/tyankatsu0105/puppeteer/';
const mobileSwitch = false;
const pcSetting = {
  'userAgent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
  'viewport': {
    'width': 1200,
    'height': 820
  }
};
const deviceSetting = devices['iPhone 6'];

const fn = async (emulate) => {
  const browser = await puppeteer.launch({
    // headless: false,
    // slowMo: 500,
    args: ['--lang=ja,en-US,en']
  });

  const page = await browser.newPage();

  await page.emulate(pcSetting);

  await page.goto(targetUrl, {
    waitUntil: 'networkidle0'
  });

  let targetElement = '#readme';

  const clip = await page.evaluate(element => {
    const item = document.querySelector(element)
    // エレメントの幅高さと位置を取得
    const {
      width,
      height,
      top: y,
      left: x
    } = item.getBoundingClientRect();
    return {
      width,
      height,
      x,
      y
    }
  }, targetElement);

  // スクリーンショットに位置と大きさを指定してclipする
  await page.screenshot({
    clip,
    path: `example.png`
  })

  await browser.close();
}

fn(pcSetting);
if (mobileSwitch) {
  fn(deviceSetting);
}
