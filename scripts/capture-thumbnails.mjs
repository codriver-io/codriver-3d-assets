import { chromium } from 'playwright';
import { mkdir, readFile } from 'node:fs/promises';
const base = process.argv[2] || 'http://localhost:4173';
const selectedId = process.argv[3];
const catalog = JSON.parse(await readFile('dist/asset-catalog.json'));
await mkdir('site/thumbnails', { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 800, height: 560 }, deviceScaleFactor: 1 });
try {
  for (const entry of catalog.assets) {
    if (selectedId && entry.id !== selectedId) continue;
    const view = entry.id === 'pont-jacques-cartier' ? 'pavilion' : entry.id === 'samuel-de-champlain' ? 'piers' : 'overview';
    await page.goto(`${base}/asset-preview.html?asset=${entry.id}&view=${view}&embed=1`);
    await page.waitForFunction(() => window.__assetPreview?.model && document.querySelector('#metrics').textContent.includes('triangles'));
    const error = await page.locator('#error').textContent(); if (error) throw new Error(entry.id + ': ' + error);
    await page.addStyleTag({ content: '#theme,.viewer-back,#toggle-controls{visibility:hidden!important}' });
    await page.evaluate(() => { const {renderer,scene,camera} = window.__assetPreview; renderer.render(scene,camera); });
    await page.locator('canvas').screenshot({ path: `site/thumbnails/${entry.id}.jpg`, type: 'jpeg', quality: 85 });
    console.log('Captured', entry.id);
  }
} finally { await browser.close(); }
