import { chromium } from 'playwright';
const browser = await chromium.launch({
  executablePath: '/Users/seanbrady/Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'
});
const page = await browser.newPage();
const logs = [];
page.on('pageerror', err => logs.push('PAGEERROR: ' + err.message + '\n' + err.stack));
page.on('console', msg => {
  logs.push(`CONSOLE.${msg.type().toUpperCase()}: ${msg.text()}`);
});
page.on('requestfailed', request => {
  logs.push(`REQUEST_FAILED: ${request.url()} - ${request.failure()?.errorText}`);
});
try {
  await page.goto('http://localhost:4210/preview', { waitUntil: 'networkidle' });
} catch (e) {
  logs.push('GOTO_ERROR: ' + e.message);
}
await page.waitForTimeout(3000);
console.log('--- ALL LOGS ---');
console.log(logs.join('\n---\n') || 'NO LOGS');
console.log('--- BODY HTML LENGTH ---');
const html = await page.evaluate(() => document.body.innerHTML.length);
console.log('Body HTML chars:', html);
await browser.close();
