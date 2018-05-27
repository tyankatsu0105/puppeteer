const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const fs = require('fs-extra');
const path = require('path');
const currentRunFileName = path.basename(__filename, path.extname(__filename));

// ===========================================
// 設定
// ===========================================
const targetUrl = 'https://www.google.co.jp/';
const searchString = 'javascript'
const resultPageCount = 3;
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
// const isBasic = false;
const basicUsername = 'user';
const basicPassword = 'pass';

const fn = async (emulate) => {
  const browser = await puppeteer.launch({
    headless: false,
    // slowMo: 500,
    args: ['--lang=ja,en-US,en']
  });

  const page = await browser.newPage();

  await page.emulate(pcSetting);

  await page.goto(targetUrl);

  let targetSelector = '#lst-ib';
  await page.waitForSelector(targetSelector)


  await page.type(targetSelector, searchString);
  targetSelector = 'input[name="btnK"]';
  await page.click(targetSelector);

  await page.waitForNavigation({
    waitUntil: 'networkidle2'
  })

  let accumulate = [];
  for (let i = 1; i <= resultPageCount; i++) {
    targetSelector = '.mw h3 > a';

    /**
     * 検索結果の項目リンクとテキスト取得し、一次保存配列に格納
     */
    const getItems = await page.$$eval(targetSelector, items => {
      let temporal = [];
        for (let i = 0; i < items.length; i++) {
          const item = {
            link: items[i].href,
            text: items[i].textContent
          };
          temporal.push(item);
        }
        return temporal;
    });

    await page.click(`#nav > tbody > tr > td:nth-child(${i + 2}) > a`);
    Array.prototype.push.apply(accumulate, getItems); 
    await page.waitForSelector(`#nav > tbody > tr`)
  }


  fs.mkdirsSync(currentRunFileName);
  fs.writeFileSync(`${currentRunFileName}/output.json`, JSON.stringify(accumulate, undefined, 2));

  await browser.close();
}

fn(pcSetting);
if (mobileSwitch) {
  fn(deviceSetting);
}
