const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');

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
		headless: false,
		// slowMo: 500,
		args: ['--lang=ja,en-US,en']
	});

	const page = await browser.newPage();

	await page.emulate(pcSetting);

	await page.goto(targetUrl, {
		waitUntil: 'networkidle0'
	});

	await page.waitFor(3000);

	await browser.close();
}

fn(pcSetting);
if(mobileSwitch){
	fn(deviceSetting);
}
