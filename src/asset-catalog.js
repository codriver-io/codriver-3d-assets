const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
let assets = [], kind = 'all', selected = params.get('asset');
function el(tag, text, className) {
  const node = document.createElement(tag);
  if (text != null) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function link(label, url, className) { const node = el('a', label, className); node.href = url; return node; }
function show(entry) {
  selected = entry.id;
  const url = new URL(location.href); url.searchParams.set('asset', selected); history.replaceState(null, '', url);
  const card = el('article', null, 'details');
  if (entry.model) {
    const inspect = entry.inspection?.url || `/asset-preview.html?asset=${encodeURIComponent(entry.id)}`;
    const stage = el('div', null, 'stage'), frame = el('iframe');
    const embedded = new URL(inspect, location.origin); embedded.searchParams.set('embed', '1');
    frame.src = embedded.href; frame.title = `Interactive model of ${entry.name}`;
    stage.append(frame, link('Open model study ↗', inspect, 'open')); card.append(stage);
  }
  const info = el('div', null, 'info');
  info.append(el('span', `${entry.kind} / ${entry.status.replaceAll('-', ' ')} · ${entry.location}`, 'eyebrow'), el('h2', entry.name), el('p', entry.description));
  if (entry.model) {
    const views = el('nav', null, 'views'); views.setAttribute('aria-label', 'Inspection views');
    for (const view of entry.inspection?.views || []) views.append(link(view.label, view.url));
    views.append(link('GLB inspector', `/asset-preview.html?asset=${encodeURIComponent(entry.id)}`)); info.append(views);
    const variants = Object.entries(entry.model.assets), primary = variants.find(([key]) => key === 'near') || variants[0];
    const metrics = el('div', null, 'metrics');
    for (const [value, label] of [
      [primary[1].triangles.toLocaleString(), `${primary[0]} · triangles`],
      [String(primary[1].drawCalls), `${primary[0]} · draws`],
      [(primary[1].bytes / 1024 / 1024).toFixed(2) + ' MB', 'GLB · uncompressed'],
      [String(variants.length), 'detail variants'],
    ]) { const metric = el('div', null, 'metric'); metric.append(el('strong', value), el('span', label)); metrics.append(metric); }
    info.append(metrics);
    const files = el('div', null, 'files');
    for (const [variant, file] of variants) { const a = link(`↓ ${variant} GLB · ${Math.round(file.bytes / 1024)} KB`, file.url); a.download = ''; files.append(a); }
    files.append(link('Model manifest ↗', entry.manifest)); info.append(files);
    const source = el('div', null, 'files');
    source.append(link('Editable source ↗', entry.source.url), link('Download source ZIP', 'https://github.com/codriver-io/codriver-3d-assets/archive/refs/heads/main.zip'), link('License & attribution', '/licenses.html'));
    info.append(source);
    info.append(el('p', `Models: CC BY 4.0 · Code: MIT. Credit: ${entry.attribution}.`, 'license'));
  }
  const meta = el('div', null, 'meta'), origin = el('section'), refs = el('section');
  origin.append(el('h3', 'Provenance'), el('p', entry.source.provenance));
  refs.append(el('h3', 'References')); const list = el('ul');
  for (const ref of entry.source.references) { const li = el('li'), a = link(ref.label + ' ↗', ref.url); a.target = '_blank'; a.rel = 'noopener'; li.append(a); list.append(li); }
  refs.append(list); meta.append(origin, refs); info.append(meta);
  if (entry.integration) info.append(el('p', entry.integration));
  info.append(el('p', entry.notes, 'note')); card.append(info); $('detail').replaceChildren(card);
  for (const button of $('list').children) button.setAttribute('aria-pressed', String(button.dataset.id === selected));
}
function render() {
  const query = $('search').value.trim().toLocaleLowerCase();
  const visible = assets.filter((e) => (kind === 'all' || e.kind === kind) && `${e.name} ${e.location} ${e.description}`.toLocaleLowerCase().includes(query));
  $('count').textContent = `${visible.length} ${visible.length === 1 ? 'asset' : 'assets'}`;
  $('list').replaceChildren();
  for (const entry of visible) {
    const button = el('button', null, 'asset'); button.dataset.id = entry.id;
    button.append(el('span', entry.kind, 'type'), el('strong', entry.name), el('small', entry.location));
    button.onclick = () => show(entry); $('list').append(button);
  }
  if (visible.length) show(visible.find((e) => e.id === selected) || visible[0]);
  else $('detail').replaceChildren(el('p', kind === 'building' && !query ? 'No buildings captured yet. New building models will appear here when registered in the collection.' : 'No matching assets. Try another name or asset type.', 'empty'));
}
$('search').oninput = render;
for (const button of document.querySelectorAll('[data-kind]')) button.onclick = () => {
  kind = button.dataset.kind;
  for (const b of document.querySelectorAll('[data-kind]')) b.setAttribute('aria-pressed', String(b === button));
  render();
};
fetch('/asset-catalog.json').then((r) => { if (!r.ok) throw new Error('Catalog unavailable'); return r.json(); }).then((data) => {
  assets = data.assets; render();
}).catch((error) => { $('error').textContent = error.message; $('detail').replaceChildren(); });
