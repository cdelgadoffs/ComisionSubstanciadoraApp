const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  const logs = [];
  page.on('console', msg => logs.push(msg.type() + ': ' + msg.text()));
  page.on('pageerror', err => logs.push('pageerror: ' + err.message));

  await page.goto('http://localhost:5211', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'pw-inicio.png' });

  await page.goto('http://localhost:5211/?pwvista=login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'pw-login.png' });

  await page.goto('http://localhost:5211/?pwvista=bloqueado', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'pw-bloqueado.png' });

  console.log('CONSOLE_LOGS:', JSON.stringify(logs));
  await browser.close();
})();
