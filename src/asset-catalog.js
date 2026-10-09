import { track } from './analytics.js';
const $ = id => document.getElementById(id);
const params = new URLSearchParams(location.search), mobile = matchMedia('(max-width: 760px)');
let assets = [], places = {}, kind = params.get('kind') || 'all';
const levels = ['continent', 'country', 'region', 'city'];
let geography = Object.fromEntries(levels.map(key => [key, params.get(key) || 'all']));
const collapsed = new Set();
let selected = params.get('asset') || 'pont-jacques-cartier', shown, viewUrl;
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const cityOf = entry => entry.city;
const placeOf = entry => ({ ...places[cityOf(entry)], city: cityOf(entry) });
function el(tag, text, className) { const node = document.createElement(tag); if (text != null) node.textContent = text; if (className) node.className = className; return node; }
function link(label, url, className) { const a = el('a', label, className); a.href = url; return a; }
function updateUrl() {
  const url = new URL(location.href);
  for (const [key, value, fallback] of [['asset', selected, null], ['kind', kind, 'all'], ['q', $('search').value.trim(), '']]) { if (value && value !== fallback) url.searchParams.set(key, value); else url.searchParams.delete(key); }
  for (const key of levels) { if (geography[key] !== 'all') url.searchParams.set(key, geography[key]); else url.searchParams.delete(key); }
  history.replaceState(null, '', url);
}
function updateSelection() { for (const button of $('list').querySelectorAll('.asset')) button.setAttribute('aria-pressed', String(button.dataset.id === selected)); }
function appLink(entry) {
  const [lng, lat] = entry.model.origin;
  const url = new URL('https://app.codriver.io/');
  url.search = new URLSearchParams({ at: `${lat},${lng}`, zoom: entry.kind === 'bridge' ? '16' : '17', bearing: entry.kind === 'bridge' ? '25' : '-25', pitch: '60', view: 'cityscape' });
  const a = link('Open in Codriver ↗', url.href, 'app-link');
  a.target = '_blank'; a.rel = 'noopener';
  a.title = 'Explore this landmark in Cityscape. Codriver Premium required.';
  a.append(el('small', 'Cityscape · Premium required'));
  a.addEventListener('click', () => track('Open In App', { asset: entry.id, city: cityOf(entry), kind: entry.kind }));
  return a;
}
function inspectionUrl(entry, view) { const url = new URL(view || entry.inspection?.url || `/asset-preview.html?asset=${entry.id}`, location.origin); url.searchParams.set('embed', '1'); return url.href; }
function show(entry, open = false) {
  selected = entry.id; updateUrl(); updateSelection();
  if (shown !== entry.id) {
    shown = entry.id;
    const card = el('article', null, 'details'), stage = el('div', null, 'stage'), frame = el('iframe');
    const inspect = entry.inspection?.url || `/asset-preview.html?asset=${encodeURIComponent(entry.id)}`;
    viewUrl = inspect; frame.src = inspectionUrl(entry); frame.title = `Interactive model of ${entry.name}`;
    stage.append(frame, el('span', 'Drag to orbit · Scroll to zoom', 'stage-hint'), link('Full screen ↗', inspect, 'open')); card.append(stage);
    const info = el('div', null, 'info'); info.append(el('span', `${entry.kind}${entry.parent ? ' component' : ''} / ${cityOf(entry)}`, 'eyebrow'), el('h2', entry.name), el('p', entry.description));
    info.append(appLink(entry));
    const views = el('nav', null, 'views'); views.setAttribute('aria-label', 'Model views');
    for (const view of entry.inspection?.views || []) { const b = el('button', view.label); b.setAttribute('aria-pressed', String(view.url === inspect)); b.onclick = () => { if (viewUrl === view.url) return; viewUrl = view.url; frame.src = inspectionUrl(entry, view.url); stage.querySelector('.open').href = view.url; for (const button of views.children) button.setAttribute('aria-pressed', String(button === b)); }; views.append(b); } info.append(views);
    const variants = Object.entries(entry.model.assets), primary = variants.find(([key]) => key === 'near') || variants[0];
    const heading = el('div', null, 'download-heading'); heading.append(el('span', 'Download this model'), link('CC BY 4.0 ↗', '/licenses.html')); info.append(heading);
    const files = el('div', null, 'files');
    for (const [variant, file] of variants) { const a = link(null, `${file.url}?v=${file.bytes}-${file.triangles}`); a.download = ''; a.addEventListener('click', () => track('Download', { asset: entry.id, detail: variant, city: cityOf(entry), kind: entry.kind, from: 'library' })); const label = el('span', `${variant === 'near' ? 'High detail' : variant === 'far' ? 'Low detail' : variant} GLB`); label.append(el('small', `${(file.bytes / 1024 / 1024).toFixed(2)} MB · ${file.triangles.toLocaleString()} triangles`)); a.append(label, el('span', '↓')); files.append(a); } info.append(files);
    const sources = el('div', null, 'source-links'); sources.append(link('Editable source ↗', entry.source.url), link('Manifest / coordinates ↗', entry.manifest)); info.append(sources);
    if (entry.components?.length || entry.parent) { info.append(el('p', entry.parent ? 'Part of the Jacques-Cartier bridge kit. Components share one geographic origin.' : 'Complete the bridge kit with four separately downloadable island-access ramps.')); const components = el('div', null, 'components'); for (const id of entry.components || [entry.parent]) { const item = assets.find(a => a.id === id); if (!item) continue; const b = el('button', item.parent ? id.replace('pont-jacques-cartier-', '').replace('-', ' ') + ' ramp ↗' : 'Main bridge ↗'); b.onclick = () => show(item, mobile.matches); components.append(b); } info.append(components); }
    const metrics = el('div', null, 'metrics'); for (const [value, label] of [[primary[1].triangles.toLocaleString(), `${primary[0]} triangles`], [String(primary[1].drawCalls), 'draw calls'], [String(variants.length), 'detail variants']]) { const metric = el('div', null, 'metric'); metric.append(el('strong', value), el('span', label)); metrics.append(metric); } info.append(metrics);
    const provenance = el('details'); provenance.append(el('summary', 'Provenance & references'), el('p', entry.source.provenance)); const refs = el('ul'); for (const ref of entry.source.references) { const li = el('li'), a = link(ref.label + ' ↗', ref.url); a.target = '_blank'; a.rel = 'noopener'; li.append(a); refs.append(li); } provenance.append(refs); info.append(provenance);
    const notes = el('details'); notes.append(el('summary', 'Placement & model notes'), el('p', entry.notes), link('Read model documentation ↗', `https://github.com/codriver-io/codriver-3d-assets/blob/main/${entry.documentation}`)); info.append(notes);
    info.append(el('p', `CC BY 4.0 models · MIT code. Credit: ${entry.attribution}.`, 'license')); card.append(info);
    const destination = open && mobile.matches ? $('mobile-detail') : $('detail');
    destination.replaceChildren(card);
    (destination === $('detail') ? $('mobile-detail') : $('detail')).replaceChildren();
  }
  const card = $('detail').querySelector('.details') || $('mobile-detail').querySelector('.details');
  if (open && mobile.matches) { if (card.parentElement !== $('mobile-detail')) $('mobile-detail').replaceChildren(card); if (!$('inspector-dialog').open) $('inspector-dialog').showModal(); $('inspector-dialog').scrollTop = 0; }
  else if (!mobile.matches && card.parentElement !== $('detail')) $('detail').replaceChildren(card);
}
function render() {
  const query = normalize($('search').value.trim());
  const visible = assets.filter(e => (kind === 'all' || e.kind === kind) && levels.every(key => geography[key] === 'all' || placeOf(e)[key] === geography[key]) && normalize(`${e.name} ${cityOf(e)} ${e.location} ${e.description}`).includes(query));
  $('count').textContent = `${visible.length} of ${assets.length} models`; $('reset').hidden = kind === 'all' && levels.every(key => geography[key] === 'all') && !query; $('empty').hidden = !!visible.length; $('list').replaceChildren();
  const cards = new Map();
  for (const entry of visible) { const b = el('button', null, 'asset'); b.dataset.id = entry.id; b.setAttribute('aria-label', `Explore ${entry.name}`); const thumbnail = el('span', null, 'thumbnail'), img = el('img'); img.src = `/thumbnails/${entry.id}.jpg`; img.alt = ''; img.loading = 'lazy'; img.width = 600; img.height = 375; thumbnail.append(img, el('span', entry.parent ? 'Bridge part' : entry.kind, 'type')); const copy = el('span', null, 'asset-copy'); copy.append(el('strong', entry.name), el('small', cityOf(entry)), el('span', 'GLB · Editable source · CC BY 4.0', 'card-format')); b.append(thumbnail, copy); b.onclick = () => { track('Model Open', { asset: entry.id, city: cityOf(entry), kind: entry.kind }); show(entry, true); }; cards.set(entry.id, b); }
  renderGroups(visible, cards, $('list'));
  if (visible.length && !mobile.matches) show(visible.find(e => e.id === selected) || visible[0]); else updateSelection(); updateUrl();
}
function updateFilters() { for (const b of document.querySelectorAll('[data-kind]')) b.setAttribute('aria-pressed', String(b.dataset.kind === kind)); }
// The list stops at the country (or the province/state in North America): one grid per country keeps
// single-model cities from leaving half-empty rows. Each card names its city, and the place filter still
// reaches every city.
function renderGroups(entries, cards, container, depth = 0, path = '') {
  const key = depth === 0 ? 'continent' : depth === 1 ? 'country' : 'region';
  const names = [...new Set(entries.map(entry => placeOf(entry)[key]))].sort((a, b) => a.localeCompare(b));
  for (const name of names) {
    const members = entries.filter(entry => placeOf(entry)[key] === name), id = `${path}/${name}`;
    const group = el('details', null, `place-group place-${key}`);
    group.open = !collapsed.has(id);
    const summary = el('summary'); summary.append(el('span', name), el('small', `${members.length} ${members.length === 1 ? 'model' : 'models'}`)); group.append(summary);
    group.addEventListener('toggle', () => { if (group.open) collapsed.delete(id); else collapsed.add(id); });
    const isLeaf = key === 'region' || (key === 'country' && placeOf(members[0]).continent !== 'North America');
    const content = el('div', null, isLeaf ? 'model-grid' : 'place-children'); group.append(content);
    if (isLeaf) for (const entry of [...members].sort((a, b) => cityOf(a).localeCompare(cityOf(b)) || a.name.localeCompare(b.name))) content.append(cards.get(entry.id));
    else renderGroups(members, cards, content, depth + 1, id);
    container.append(group);
  }
}
function populatePlaces() {
  $('city').replaceChildren(new Option('Every place', 'all'));
  function options(entries, depth = 0, path = {}) {
    const key = depth === 0 ? 'continent' : depth === 1 ? 'country' : depth === 2 && placeOf(entries[0]).continent === 'North America' ? 'region' : 'city';
    for (const name of [...new Set(entries.map(e => placeOf(e)[key]))].sort((a,b) => a.localeCompare(b))) {
      const scope = { ...path, [key]: name }, members = entries.filter(e => placeOf(e)[key] === name);
      // A city that is the only place in a same-named province (San José, Costa Rica) is already that option.
      if (key === 'city' && name === path.region && entries.every(e => placeOf(e).city === name)) continue;
      $('city').add(new Option(`${'— '.repeat(depth)}${name}`, JSON.stringify(scope)));
      if (key !== 'city') options(members, depth + 1, scope);
    }
  }
  options(assets);
  const scope = Object.fromEntries(levels.filter(key => geography[key] !== 'all').map(key => [key, geography[key]]));
  // Keep old city-only links working, even when the selector uses a full path.
  const option = [...$('city').options].find(o => o.value !== 'all' && Object.entries(scope).length && Object.entries(scope).every(([k,v]) => JSON.parse(o.value)[k] === v));
  if (option) $('city').value = option.value;
  else { geography = Object.fromEntries(levels.map(key => [key, 'all'])); $('city').value = 'all'; }
}
function reset() { kind = 'all'; geography = Object.fromEntries(levels.map(key => [key, 'all'])); $('city').value = 'all'; $('search').value = ''; updateFilters(); render(); $('search').focus(); }
$('search').value = params.get('q') || ''; $('search').oninput = render;
$('city').onchange = () => { geography = { ...Object.fromEntries(levels.map(key => [key, 'all'])), ...($('city').value === 'all' ? {} : JSON.parse($('city').value)) }; render(); };
$('reset').onclick = $('empty-reset').onclick = reset;
for (const b of document.querySelectorAll('[data-kind]')) b.onclick = () => { kind = b.dataset.kind; updateFilters(); render(); };
$('close-detail').onclick = () => $('inspector-dialog').close();
$('inspector-dialog').addEventListener('click', event => { if (event.target === $('inspector-dialog')) { const r = event.target.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) event.target.close(); } });
$('inspector-dialog').addEventListener('close', () => {
  if ($('inspector-dialog').open) return;
  const card = $('mobile-detail').querySelector('.details');
  if (!mobile.matches) { if (card) $('detail').replaceChildren(card); }
  else { $('mobile-detail').replaceChildren(); $('detail').replaceChildren(); shown = null; }
});
mobile.addEventListener('change', () => {
  if (!mobile.matches) { $('inspector-dialog').close(); const entry = assets.find(e => e.id === selected); if (entry) show(entry); }
  else if (!$('inspector-dialog').open) { $('detail').replaceChildren(); shown = null; }
});
Promise.all(['/asset-catalog.json', '/places.json'].map(url => fetch(url).then(r => { if (!r.ok) throw new Error('The library could not load. Please refresh to try again.'); return r.json(); }))).then(([data, geographyTable]) => {
  places = geographyTable;
  const featured = ['pont-jacques-cartier','paris-tour-eiffel','cn-tower','biosphere-montreal','paris-louvre','samuel-de-champlain'];
  const rank = entry => featured.includes(entry.id) ? featured.indexOf(entry.id) : featured.length;
  assets = data.assets.sort((a,b) => rank(a)-rank(b)); const cities = [...new Set(assets.map(cityOf))]; populatePlaces(); if (!['all','bridge','building'].includes(kind)) kind = 'all'; updateFilters();
  $('total-models').textContent = assets.length; $('total-variants').textContent = assets.reduce((n, e) => n + Object.keys(e.model.assets).length, 0); $('total-cities').textContent = cities.length; render();
  if (mobile.matches && params.has('asset')) { const entry = assets.find(e => e.id === selected); if (entry) show(entry, true); }
}).catch(error => { $('error').textContent = error.message; $('detail').replaceChildren(); $('count').textContent = 'Library unavailable'; });
