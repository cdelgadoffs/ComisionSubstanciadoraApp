const { chromium } = require('playwright-core');

function fmt(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: false,
  });
  const page = await browser.newPage({ viewport: { width: 1400, height: 700 } });
  await page.goto('http://localhost:5194');
  await page.waitForTimeout(500);

  const hoy = new Date();
  const proxima = new Date(hoy); proxima.setDate(hoy.getDate() + 3);
  const sesiones = [{ id: fmt(proxima), numeroSesion: 1, label: `${proxima.getDate()} de prueba`, celebrada: false, estado: 'proxima' }];
  const puntos = Array.from({ length: 6 }).map((_, i) => ({
    id: 'p' + i, seccion: 'acuerdos', remitente: 'Pleno',
    contenido: `Contenido del acuerdo ${i + 1}`, acuerdo: `Se aprueba ${i + 1}`,
    confidencial: false, archivos: [],
  }));

  await page.evaluate(({ sesiones, puntos }) => new Promise((resolve, reject) => {
    const req = indexedDB.open('comisionSubstanciadora', 2);
    req.onsuccess = () => {
      const db = req.result;
      const tx = db.transaction(['sesiones', 'puntos'], 'readwrite');
      tx.objectStore('sesiones').clear();
      sesiones.forEach((s) => tx.objectStore('sesiones').put(s));
      tx.objectStore('puntos').clear();
      puntos.forEach((p) => tx.objectStore('puntos').put(p));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    };
    req.onerror = () => reject(req.error);
  }), { sesiones, puntos });

  await page.reload();
  await page.waitForTimeout(800);
  await page.locator('.base-boton-seleccionable-menu', { hasText: 'Proyecto del orden del día' }).click();
  await page.waitForTimeout(300);
  await page.locator('.widget-submenu-dd-item', { hasText: 'Acuerdos' }).click({ position: { x: 5, y: 5 } });
  await page.waitForTimeout(400);

  const data = await page.evaluate(() => {
    const panel = document.querySelector('.base-panel-principal');
    const html = document.documentElement;
    const body = document.body;
    return {
      panelOffsetWidth: panel.offsetWidth,
      panelClientWidth: panel.clientWidth,
      panelScrollbarWidth: panel.offsetWidth - panel.clientWidth,
      htmlOffsetWidth: html.offsetWidth,
      htmlClientWidth: html.clientWidth,
      htmlScrollbarWidth: html.offsetWidth - html.clientWidth,
      windowInnerWidth: window.innerWidth,
      panelRect: panel.getBoundingClientRect(),
    };
  });
  console.log(JSON.stringify(data, null, 2));

  await page.screenshot({ path: 'measure-full.png' });
  await page.screenshot({ path: 'measure-crop.png', clip: { x: 1360, y: 150, width: 40, height: 300 } });

  await browser.close();
})();
