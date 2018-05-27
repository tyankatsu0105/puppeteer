const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');

// ===========================================
// 設定
// ===========================================
const targetUrl = 'https://www.google.co.jp/';
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
		headless: false,
		// slowMo: 500,
		args: ['--lang=ja,en-US,en']
	});

	const page = await browser.newPage();

	await page.emulate(pcSetting);

  await page.goto(targetUrl);
  
  let targetSelector = '#lst-ib';
  await page.waitForSelector(targetSelector)
  

  await page.type(targetSelector, 'hogehoge');
  targetSelector = '#tsf > div.tsf-p > div.jsb > center > input[type="submit"]:nth-child(1)';
  await page.click(targetSelector);

  await page.waitForNavigation({
    waitUntil: 'networkidle2'
  })
  targetSelector = '#rso > div > div > div:nth-child(1) > div > div > h3 > a';
  await page.click(targetSelector);
  await page.waitForNavigation({
    waitUntil: 'networkidle2'
  })

	await browser.close();
}

fn(pcSetting);
if(mobileSwitch){
	fn(deviceSetting);
}
