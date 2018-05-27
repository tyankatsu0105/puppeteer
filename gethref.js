const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const fs = require('fs-extra');
const path = require('path');
const currentRunFileName = path.basename(__filename, path.extname(__filename));

// ===========================================
// 設定
// ===========================================
const targetUrl = 'https://qiita.com';
const mobileSwitch = false;
const pcSetting = {
  'userAgent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
  'viewport': {
    'width': 1200,
    'height': 820
  }
};
const deviceSetting = devices['iPhone 6'];
// basic認証
const isBasic = false;
const basicUsername = 'user';
const basicPassword = 'pass';

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


  const selector = 'div.tr-Item > div.tr-Item_body > a';
  const getItems = await page.$$eval(selector, items => {
    const accumulate = [];
    for (let i = 0; i < items.length; i++) {
      const item = {
        link: items[i].href,
        text: items[i].textContent
      };
      accumulate.push(item);
    }
    return accumulate;
  });


  fs.mkdirsSync(currentRunFileName);
  fs.writeFileSync(`${currentRunFileName}/output.json`, JSON.stringify(getItems, undefined, 2));

  await page.waitFor(3000);

  await browser.close();
}

fn(pcSetting);
if (mobileSwitch) {
  fn(deviceSetting);
}
