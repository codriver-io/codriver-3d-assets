import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { createVictoria, createJacquesCartier } from './peregrine/landmarks/montreal-bridges-geometry.js';
import { createFiveRoses } from './peregrine/landmarks/five-roses-geometry.js';
import { fiveRosesPoint } from './peregrine/landmarks/five-roses-config.js';
import { createBiosphere } from './peregrine/landmarks/biosphere-geometry.js';
import { createChamplain } from './peregrine/landmarks/champlain-geometry.js';
import { VICTORIA, JACQUES } from './peregrine/landmarks/montreal-profiles.js';
import * as CHAMPLAIN from './peregrine/landmarks/champlain-profile.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createOrangeJulep } from './peregrine/landmarks/orange-julep-geometry.js';
import { orangeJulepView } from '../prototypes/assets3d/orange-julep-views.js';
import { createPlaceVilleMarie } from './peregrine/landmarks/place-ville-marie-geometry.js';
import { pvmSite, PVM_RING_SITE } from './peregrine/landmarks/place-ville-marie-config.js';
import { createHabitat67 } from './peregrine/landmarks/habitat-67-geometry.js';
import { habitat67View } from '../prototypes/assets3d/habitat-67-views.js';
import { createStadeOlympique } from './peregrine/landmarks/stade-olympique-geometry.js';
import { createGrandeRoue } from './peregrine/landmarks/grande-roue-geometry.js';
import { wheelPoint } from './peregrine/landmarks/grande-roue-config.js';
import { createNotreDame } from './peregrine/landmarks/basilique-notre-dame-geometry.js';
import { fitNotreDame, updateNotreDameClipping } from '../prototypes/assets3d/basilique-notre-dame-inspection.js';
import { createTourDeLHorloge } from './peregrine/landmarks/tour-de-l-horloge-geometry.js';
import { horlogePoint } from './peregrine/landmarks/tour-de-l-horloge-config.js';
import { createOratoire } from './peregrine/landmarks/oratoire-saint-joseph-geometry.js';
import { fitOratoire } from '../prototypes/assets3d/oratoire-saint-joseph-inspection.js';
import { createMercier } from './peregrine/landmarks/pont-honore-mercier-geometry.js';
import { MERCIER_UPSTREAM } from './peregrine/landmarks/pont-honore-mercier-profile.js';
import { createParisIcon, PARIS_ICON_BY_ID } from './peregrine/landmarks/paris-icons-geometry.js';
import { PARIS_PALACES, createLouvre, createPalaisGarnier, createGrandPalais, createPetitPalais, createMuseeOrsay } from './peregrine/landmarks/paris-palaces-geometry.js';
import { createPantheon, createHotelDeVille, createConciergerie, createMadeleine, createInstitutDeFrance } from './peregrine/landmarks/paris-historic-geometry.js';
import { PARIS_HISTORIC_BY_ID } from './peregrine/landmarks/paris-historic-config.js';
import { PARIS_BRIDGES, createParisBridge, metricFrame } from './peregrine/landmarks/paris-bridges-geometry.js';

const $ = (id) => document.getElementById(id), params = new URLSearchParams(location.search);
document.body.classList.toggle('embedded', params.get('embed') === '1');
const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.1, 30000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.2;
$('view').append(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement); controls.enableDamping = true;
const sky = new THREE.HemisphereLight(0xe6f3ff, 0x798776, 2.7), sun = new THREE.DirectionalLight(0xfff1dc, 3.2);
sun.position.set(-400, 900, 600); scene.add(sky, sun);
const creators = {
  'paris-tour-eiffel': opts => createParisIcon('paris-tour-eiffel',opts),
  'paris-arc-de-triomphe': opts => createParisIcon('paris-arc-de-triomphe',opts),
  'paris-notre-dame': opts => createParisIcon('paris-notre-dame',opts),
  'paris-sacre-coeur': opts => createParisIcon('paris-sacre-coeur',opts),
  'paris-invalides': opts => createParisIcon('paris-invalides',opts),
  'farine-five-roses': createFiveRoses,
  'pont-victoria': createVictoria,
  'pont-jacques-cartier': createJacquesCartier,
  'biosphere-montreal': createBiosphere,
  'samuel-de-champlain': createChamplain,
  'orange-julep': createOrangeJulep,
  'place-ville-marie': createPlaceVilleMarie,
  'habitat-67': createHabitat67,
  'stade-olympique': createStadeOlympique,
  'grande-roue-montreal': createGrandeRoue,
  'basilique-notre-dame': createNotreDame,
  'tour-de-l-horloge': createTourDeLHorloge,
  'oratoire-saint-joseph': createOratoire,
  'pont-honore-mercier': createMercier,
  'paris-louvre': createLouvre,
  'paris-palais-garnier': createPalaisGarnier,
  'paris-grand-palais': createGrandPalais,
  'paris-petit-palais': createPetitPalais,
  'paris-musee-orsay': createMuseeOrsay,
  'paris-pantheon': createPantheon,
  'paris-hotel-de-ville': createHotelDeVille,
  'paris-conciergerie': createConciergerie,
  'paris-madeleine': createMadeleine,
  'paris-institut-de-france': createInstitutDeFrance,
};
for (const spec of PARIS_BRIDGES) creators[spec.id] = options => createParisBridge(spec, options);
const profiles = {
  'pont-victoria': VICTORIA,
  'pont-jacques-cartier': JACQUES,
  'samuel-de-champlain': CHAMPLAIN,
  'pont-honore-mercier': MERCIER_UPSTREAM,
};
for (const spec of PARIS_BRIDGES) {
  const f = metricFrame(spec);
  profiles[spec.id] = { BRIDGE_LENGTH: f.length, ROAD_EDGES: spec.roadEdges,
    bridgePoint(s) { const a = f.point(s, 0, f.height(s)), b = f.point(Math.min(f.length, s + .1), 0, f.height(s));
      const len = Math.hypot(b[0] - a[0], b[2] - a[2]) || 1;
      return { x: a[0], y: a[1], z: a[2], tx: (b[0] - a[0]) / len, tz: (b[2] - a[2]) / len }; },
  };
}
let entry, model, generation = 0, dark = ['dark', 'night'].includes(params.get('theme')), front = false;
controls.addEventListener('change', () => { if (entry?.id === 'basilique-notre-dame') updateNotreDameClipping(camera, controls); });
$('angle').value = params.get('view') || 'overview';
function dispose(root) {
  const materials = new Set(), textures = new Set();
  root.traverse((o) => { o.geometry?.dispose(); for (const m of o.material ? [].concat(o.material) : []) materials.add(m); });
  for (const m of materials) { for (const value of Object.values(m)) if (value?.isTexture) textures.add(value); m.dispose(); }
  for (const t of textures) t.dispose();
}
function fit() {
  if (!model) return;
  const box = new THREE.Box3().setFromObject(model), size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3()), radius = Math.max(size.length() / 2, 1);
  const angle = Math.min(camera.fov * Math.PI / 360, Math.atan(Math.tan(camera.fov * Math.PI / 360) * camera.aspect));
  const distance = radius / Math.sin(angle) * 1.05;
  controls.target.copy(center);
  camera.position.copy(center).addScaledVector(new THREE.Vector3(...(front ? [0, 0.05, 1] : [0.65, 0.5, 1])).normalize(), distance);
  camera.near = entry?.id === 'stade-olympique' ? 0.5 : Math.max(0.01, radius / 10000); camera.far = distance + radius * 15; camera.updateProjectionMatrix();
  if (entry?.id?.startsWith('paris-pont-')) { camera.near = 0.5; camera.updateProjectionMatrix(); }
  controls.minDistance = Math.min(0.5, radius / 100); controls.maxDistance = distance * 5;
  const view = $('angle').value, profile = profiles[entry?.id];
  if (profile && view !== 'overview') {
    const station = Number($('station').value) / 100 * profile.BRIDGE_LENGTH;
    const at = profile.bridgePoint(station), vec = (along, across, y) => new THREE.Vector3(at.x + at.tx * along - at.tz * across, y, at.z + at.tz * along + at.tx * across);
    if (view === 'drive') { camera.position.copy(vec(-25, profile.ROAD_EDGES?.[0]?.[0] + 2 || -18, at.y + 3)); controls.target.copy(vec(75, profile.ROAD_EDGES?.[0]?.[0] + 2 || -18, at.y + 5)); }
    else if (view === 'piers' && entry?.id?.startsWith('paris-pont-')) {
      camera.position.copy(vec(0, Math.max(210, profile.BRIDGE_LENGTH * 1.45), 23));
      controls.target.copy(vec(0, 0, Math.max(5, at.y * 0.65)));
    }
    else if (view === 'piers') { camera.position.copy(vec(-80, 120, 7)); controls.target.copy(vec(25, 0, Math.max(7, at.y * 0.65))); }
    else { camera.position.copy(vec(-100, 610, at.y + 130)); controls.target.copy(vec(0, 0, at.y + 15)); }
  } else if (!profile && view !== 'overview') {
    controls.target.set(0, view === 'roof' ? 24 : 25, 0);
    camera.position.set(view === 'roof' ? 48 : 100, view === 'roof' ? 120 : 45, view === 'roof' ? 60 : 135);
  }
  if (entry?.id?.startsWith('paris-pont-') && view === 'overview') {
    const at = profile.bridgePoint(profile.BRIDGE_LENGTH / 2);
    const vec = (along, across, y) => new THREE.Vector3(at.x + at.tx * along - at.tz * across, y, at.z + at.tz * along + at.tx * across);
    camera.position.copy(vec(-profile.BRIDGE_LENGTH * .42, profile.BRIDGE_LENGTH * 1.2, at.y + profile.BRIDGE_LENGTH * .5));
    controls.target.copy(vec(0, 0, at.y));
  }
  if (entry?.id === 'farine-five-roses') {
    camera.near = 0.5; camera.updateProjectionMatrix();
    const viewpoints = { facade: [[-160,60,75],[35,30,-7]], reverse: [[190,65,-50],[48,32,-17]], roof: [[150,210,-20],[20,15,-35]], sign: [[125,62,-17],[52,49,-17]] };
    const [eye, target] = viewpoints[view] || [[-190,130,160],[15,22,-32]];
    camera.position.set(...fiveRosesPoint(...eye)); controls.target.set(...fiveRosesPoint(...target));
  }
  if (entry?.id === 'orange-julep') {
    orangeJulepView(front && view === 'overview' ? 'facade' : view, camera, controls); controls.update(); return;
  }
  if (entry?.id === 'place-ville-marie') {
    const [u,v] = PVM_RING_SITE;
    const views = { overview:[[260,230,310],[-15,88,18]], facade:[[220,65,200],[0,90,0]], roof:[[95,245,95],[0,175,0]], ring:[[u-62,17,v+5],[u,18.5,v]] };
    const [eye,target] = views[front ? 'facade' : view] || views.overview;
    camera.position.set(...pvmSite(...eye));controls.target.set(...pvmSite(...target));
    camera.near=0.5;camera.far=3000;camera.updateProjectionMatrix();
  }
  if (entry?.id === 'habitat-67') habitat67View(camera, controls, front ? 'facade' : view, camera.aspect);
  if (entry?.id === 'stade-olympique' && view !== 'overview') {
    const roof = view === 'roof', tower = view === 'structure';
    controls.target.set(tower ? -25 : 0, tower ? 95 : 32, tower ? -130 : -30);
    camera.position.set(roof ? 120 : 370, roof ? 520 : tower ? 125 : 35, roof ? 110 : 370);
  }
  if (entry?.id === 'grande-roue-montreal') {
    const views = { overview: [[42,49,105],[0,28,0]], facade: [[0,32,110],[0,29,0]], structure: [[55,35,30],[0,29,0]], roof: [[35,92,65],[0,28,0]], piers: [[21,11,45],[0,16,0]] };
    const [eye,target] = views[front ? 'facade' : view] || views.overview;
    camera.position.fromArray(wheelPoint(...eye));controls.target.fromArray(wheelPoint(...target));
  }
  if (entry?.id === 'basilique-notre-dame') fitNotreDame(camera, controls, front ? 'facade' : $('angle').value);
  if (entry?.id === 'tour-de-l-horloge') {
    camera.near = .2; camera.updateProjectionMatrix();
    const views = { overview:[[-8,20,0],[52,39,-78]], facade:[[-8,20,0],[-8,23,-90]], roof:[[0,39,0],[24,51,-30]], structure:[[-11,6,0],[-32,13,-38]], piers:[[-11,6,0],[-32,13,-38]], drive:[[0,31,0],[24,8,-28]] };
    const [target, eye] = views[front && view === 'overview' ? 'facade' : view] || views.overview;
    controls.target.set(...horlogePoint(...target)); camera.position.set(...horlogePoint(...eye));
  }
  if (entry?.id === 'oratoire-saint-joseph') { fitOratoire(front ? 'facade' : view, camera, controls); return; }
  if (PARIS_HISTORIC_BY_ID[entry?.id]) {
    const spec=PARIS_HISTORIC_BY_ID[entry.id], yaw=spec.rotation;
    const width=spec.width,length=spec.length,span=Math.max(width,length);
    const view=front?'facade':$('angle').value;
    const local={
      overview:[width*.95,span*.65,-Math.max(length*1.2,width*1.3)],
      facade:[0,spec.height*.52,-Math.max(length*1.2,width*(entry.id==='paris-hotel-de-ville'?1.6:1.08))],
      roof:[width*.65,span*1.3,-Math.max(length*.38,width*.5)],
      reverse:[-width*.3,spec.height*.65,Math.max(length*1.2,width*1.08)],
    }[view]||[width,span*.6,-Math.max(length*1.2,width*1.3)];
    camera.position.set(local[0]*Math.cos(yaw)+local[2]*Math.sin(yaw),local[1],-local[0]*Math.sin(yaw)+local[2]*Math.cos(yaw));
    controls.target.set(0,spec.height*.4,0);
    camera.near=.2;camera.far=3000;camera.updateProjectionMatrix();
  }
  if (entry?.id==='pont-honore-mercier' && view==='overview' && !front) {
    const q=profile.bridgePoint(profile.BRIDGE_LENGTH/2);
    camera.position.copy(center).addScaledVector(new THREE.Vector3(-q.tz,0.52,q.tx).normalize(),distance*0.78);
  }
  if (PARIS_ICON_BY_ID[entry?.id]) {
    const spec=PARIS_ICON_BY_ID[entry.id],c=Math.cos(spec.rotation),s=Math.sin(spec.rotation);
    const point=(u,y,v)=>new THREE.Vector3(c*u+s*v,y,-s*u+c*v);
    const v=front?'facade':view;
    const d=v==='roof'?Math.max(240,spec.height*2.15):Math.max(185,spec.height*1.7);
    const views={overview:[[d*.76,spec.height*.8,d],[0,spec.height*.42,0]],
      facade:[[0,spec.height*.47,d],[0,spec.height*.43,0]],
      roof:[[d*.45,spec.height*1.4,d*.65],[0,spec.height*.35,0]],
      reverse:[[0,spec.height*.47,-d],[0,spec.height*.43,0]]};
    const [eye,target]=views[v]||views.overview;
    camera.position.copy(point(...eye));controls.target.copy(point(...target));
    camera.near=.1;camera.far=4000;camera.updateProjectionMatrix();
  }
  if (Object.hasOwn(PARIS_PALACES, entry?.id)) {
    const views={
      'paris-louvre':{overview:[[-450,290,490],[180,14,0]],facade:[[76,34,60],[188,17,0]],roof:[[80,550,220],[180,12,0]]},
      'paris-palais-garnier':{overview:[[120,110,215],[0,25,0]],facade:[[0,38,180],[0,23,38]],roof:[[90,180,105],[0,32,0]]},
      'paris-grand-palais':{overview:[[210,125,250],[0,25,0]],facade:[[205,43,70],[0,22,0]],roof:[[90,240,150],[0,28,0]]},
      'paris-petit-palais':{overview:[[130,100,125],[0,17,0]],facade:[[-190,45,0],[-35,18,0]],roof:[[75,160,85],[0,15,0]]},
      'paris-musee-orsay':{overview:[[165,105,-190],[0,20,0]],facade:[[40,48,-260],[0,18,-8]],roof:[[130,175,-75],[0,24,0]]},
    };
    const [eye,target]=(views[entry.id]||{})[front?'facade':view]||views[entry.id].overview;
    camera.position.set(...eye);controls.target.set(...target);
    camera.near=.2;camera.far=3000;camera.updateProjectionMatrix();
  }
  if (['paris-tour-eiffel','paris-louvre','paris-grand-palais','paris-musee-orsay','paris-hotel-de-ville'].includes(entry?.id) && camera.aspect < 1.15) {
    camera.position.sub(controls.target).multiplyScalar(1.15/camera.aspect).add(controls.target);
  }
  controls.update();
}
function theme() {
  scene.background = new THREE.Color(dark ? 0x172b3a : 0xdce7e6);
  sky.intensity = dark ? 1.4 : 2.7; sun.intensity = dark ? 0.8 : 3.2;
  model?.traverse(o => { if(o.isMesh && o.material.name === 'five-roses:red') o.material.emissiveIntensity = dark ? 0.65 : 0.08; });
  $('theme').textContent = dark ? 'Day' : 'Night';
}
async function load() {
  const token = ++generation, variant = $('variant').value, asset = entry.model.assets[variant];
  $('error').textContent = '';
  try {
    const candidate = $('source').value === 'procedural' && creators[entry.id] ? creators[entry.id]({ detail: variant }) : (await new GLTFLoader().loadAsync(asset.url)).scene;
    if (token !== generation) { dispose(candidate); return; }
    if (model) { scene.remove(model); dispose(model); }
    model = candidate; scene.add(model); fit(); theme();
    $('metrics').textContent = `${asset.triangles.toLocaleString()} triangles · ${asset.drawCalls} draws · ${Math.round(asset.bytes / 1024)} KB`;
    $('download').href = asset.url;
  } catch (error) { if (token === generation) $('error').textContent = 'Could not load model: ' + error.message; }
}
$('variant').onchange = load; $('source').onchange = load; $('angle').onchange = fit; $('station').oninput = fit; $('overview').onclick = () => { front = false; $('angle').value = 'overview'; fit(); };
$('front').onclick = () => { front = true; $('angle').value = 'overview'; fit(); }; $('theme').onclick = () => { dark = !dark; theme(); };
addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; fit(); });
fetch('/asset-catalog.json').then((r) => { if (!r.ok) throw new Error('Catalog unavailable'); return r.json(); }).then((catalog) => {
  entry = catalog.assets.find((e) => e.id === params.get('asset'));
  if (!entry?.model) throw new Error('No downloadable model for this asset');
  $('name').textContent = entry.name; document.title = `${entry.name} · GLB inspector`; $('description').textContent = entry.description;
  for (const name of Object.keys(entry.model.assets).filter(n => entry.id !== 'pont-honore-mercier' || ['near','far'].includes(n))) $('variant').add(new Option(name, name));
  if (entry.model.assets[params.get('detail')]) $('variant').value = params.get('detail');
  const profile = profiles[entry.id];
  if (entry.id === 'farine-five-roses') { for(const option of [...$('angle').options]) if(['structure','piers','drive'].includes(option.value)) option.remove(); $('angle').add(new Option('Opposite facade','reverse')); $('angle').add(new Option('Lettering','sign')); $('angle').value = params.get('view') || 'overview'; }
  if (entry.id === 'orange-julep') {
    $('angle').add(new Option('Roadside sign', 'signage'));
    if (params.get('view') === 'signage') $('angle').value = 'signage';
  }
  if (entry.id === 'place-ville-marie') { for (const option of [...$('angle').options]) if (['structure','piers','drive'].includes(option.value)) option.remove(); $('angle').add(new Option('Ring / Cathcart','ring')); $('angle').value = params.get('view') || 'overview'; }
  if (entry.id === 'habitat-67') {
    $('angle').replaceChildren(...Object.entries({overview:'Overview',facade:'Street façade',river:'River façade',roof:'Roof / footprint',terraces:'Terraces',voids:'Cores / voids'}).map(([value,label]) => new Option(label,value)));
    $('angle').value = params.get('view') || 'overview';
    $('source').value = params.get('source') === 'procedural' ? 'procedural' : 'glb';
    dark = ['dark','night'].includes(params.get('theme')); theme();
  }
  if (entry.id === 'stade-olympique') {
    for (const option of [...$('angle').options]) {
      if (['piers', 'drive'].includes(option.value)) option.remove();
      if (option.value === 'structure') option.textContent = 'Tower';
    }
  }
  if (entry.id === 'basilique-notre-dame') {
    $('angle').add(new Option('Rear chapel', 'rear')); $('angle').value = params.get('view') || 'overview';
    if (params.get('source') === 'procedural') $('source').value = 'procedural';
    if (params.get('theme') === 'dark') { dark = true; theme(); }
  }
  if (entry.id === 'oratoire-saint-joseph') {
    $('angle').replaceChildren(...['overview','facade','roof','approach'].map(v => new Option(v, v)));
    $('angle').value = params.get('view') || 'overview';
  }
  if (PARIS_ICON_BY_ID[entry.id] || PARIS_HISTORIC_BY_ID[entry.id]) {
    $('angle').replaceChildren(...Object.entries({overview:'Overview',facade:'Facade',reverse:'Opposite facade',roof:'Roof'}).map(([value,label])=>new Option(label,value)));
    $('angle').value=params.get('view')||'overview';
  }
  if (params.get('source') === 'procedural' && creators[entry.id]) $('source').value = 'procedural';
  $('source').disabled = !creators[entry.id];
  $('station').hidden = $('station-label').hidden = !profile;
  if (profile) $('station').value = ((profile.landmarks?.main ?? profile.BRIDGE_LENGTH * 0.45) / profile.BRIDGE_LENGTH) * 100;
  return load();
}).catch((error) => { $('name').textContent = 'Model unavailable'; $('error').textContent = error.message; });
theme(); renderer.setAnimationLoop(() => { controls.update(); renderer.render(scene, camera); });
window.__assetPreview = { renderer, scene, camera, controls, fit, get model() { return model; } };
