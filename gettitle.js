const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const fs = require('fs-extra');
const path = require('path');
const currentRunFileName = path.basename(__filename, path.extname(__filename));

// ===========================================
// 設定
// ===========================================
const targetUrl = 'http://example.com/';
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

  // ===========================================
  // ２つ関数でも取得可能
  // ===========================================
  /**
   * ページ内の要素を取得する
   */
  // const getElement = await page.evaluate(() => {
  //   return document.title;
  // });

  const consoleGetElement = await page.$('title');
  const editConsoleGetElement = await (await consoleGetElement.getProperty('textContent')).jsonValue();

  // ===========================================
  // end ２つどちらでも取得可能
  // ===========================================


  
  fs.mkdirsSync(currentRunFileName);
  fs.writeFileSync(`${currentRunFileName}/output.json`, editConsoleGetElement);
  // fs.writeFileSync(`${currentRunFileName}/output.json`, getElement);




  await page.waitFor(3000);

  await browser.close();
}

fn(pcSetting);
if (mobileSwitch) {
  fn(deviceSetting);
}
