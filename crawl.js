const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const devices = require('puppeteer/DeviceDescriptors');

// ===========================================
// 設定
// ===========================================
const targetUrl = 'http://example.com/';
const mobileSwitch = true;
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

const fn = async (url, emulate, category) => {
	const browser = await puppeteer.launch({
		// headless: false,
		// slowMo: 500,
		args: ['--lang=ja,en-US,en']
	});

	// ページ作成
	const page = await browser.newPage();

	if (isBasic) {
		await page.setExtraHTTPHeaders({
			Authorization: `Basic ${new Buffer(`${basicUsername}:${basicPassword}`).toString('base64')}`
		});
	}

	// ブラウザサイズ指定
	await page.emulate(emulate);

	await page.goto(url, {
		waitUntil: 'networkidle0'
	});

	// url蓄積
	let accumulateUrl = [];
	await accumulateUrl.push(targetUrl);

	// 閲覧したurl蓄積
	let checkedUrl = [];

	while (accumulateUrl[0]) {
		await page.goto(accumulateUrl[0], {
			waitUntil: 'networkidle0'
		});

		// ローカルにディレクトリがなければ作る
		const dir = await page.evaluate(() => {
			const hostname = location.hostname;
			const pathname = location.pathname;
			if (pathname === '/') {
				return hostname;
			} else {
				let directory = `${location.hostname}${location.pathname}`
				directory = directory.replace(/\/$/g, '')
				return directory;
			}
		})
		if (!fs.existsSync(dir)) {
			fs.mkdirsSync(dir);
		}

		// ===========================================
		// page処理
		// ===========================================
		// DOMを取得
		const html = await page.content();
		// スクショをjpg化DOMをhtmlファイルに貼り付け
		fs.writeFileSync(`${dir}/index-${category}.html`, html);
		await page.screenshot({
			path: `${dir}/${category}.jpg`,
			fullPage: true
		});

		await (() => {
			let temporal = accumulateUrl.slice();
			checkedUrl.push(temporal[0])
		})()

		// ページ内のhref取得
		const getLinks = await page.evaluate(() => {
			const origin = location.origin;
			let elements = document.querySelectorAll('a');
			elements = Array.prototype.map.call(elements, function (element) {
				return element.href
			});
			/* 
			/* 除外 
			/* 
			/* 重複した内容 
			/* originを含まない
			/* tel:
			/* mailto:
			/* #
			*/
			return elements.filter((value, index, self) => value && self.indexOf(value) === index && value.startsWith(origin) && !value.includes('tel:') && !value.includes('mailto:') && !value.includes('#'))
		});


		for (let element of getLinks) {
			let searchUrlInCheckedUrl = checkedUrl.indexOf(element) === -1;
			let searchUrlInAccumulateUrl = accumulateUrl.indexOf(element) === -1;
			if (searchUrlInCheckedUrl && searchUrlInAccumulateUrl) {
				accumulateUrl.push(element)
			}
		}

		accumulateUrl.splice(0, 1)

	}

	await browser.close();

}

fn(targetUrl, pcSetting, 'pc');
if (mobileSwitch) {
	fn(targetUrl, deviceSetting, 'sp');
}
