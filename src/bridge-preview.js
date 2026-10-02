import * as THREE from 'three';
import { track } from './analytics.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { createChamplain, disposeChamplain, BRIDGE_PALETTES } from './peregrine/landmarks/champlain-geometry.js';
import { bridgePoint, BRIDGE_LENGTH, TOWER_STATION } from './peregrine/landmarks/champlain-profile.js';

document.body.classList.toggle('embedded', new URLSearchParams(location.search).get('embed') === '1');
const $ = (id) => document.getElementById(id);
$('download').addEventListener('click', () => track('Download', { asset: 'samuel-de-champlain', detail: /-(near|far)\.glb$/.exec($('download').getAttribute('href'))?.[1] || 'near', kind: 'bridge', from: 'bridge-viewer' }));
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
$('view').appendChild(renderer.domElement);
const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.5, 18000);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = 0.08;
controls.maxPolarAngle = Math.PI / 2 - 0.015; controls.minDistance = 15; controls.maxDistance = 6500;
const ambient = new THREE.HemisphereLight(0xe6f3ff, 0x798776, 2.7); scene.add(ambient);
const sun = new THREE.DirectionalLight(0xfff1dc, 3.2); sun.position.set(-400, 900, 600); scene.add(sun);
const water = new THREE.Mesh(new THREE.PlaneGeometry(22000, 16000), new THREE.MeshStandardMaterial({ color: 0x91b7b2, roughness: 0.75, metalness: 0.12 }));
water.rotation.x = -Math.PI / 2; water.position.y = -0.35; scene.add(water);
// Quiet surface contours give orbit and motion a scale without texture files.
const waterLines = [];
for (let z = -3500; z <= 3500; z += 65) for (let x = -6000; x <= 4000; x += 150) {
  const start = x + Math.sin(x * 0.02 + z * 0.05) * 35;
  waterLines.push(start, -0.3, z, start + 40, -0.3, z + 1);
}
const waterDetail = new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(waterLines, 3)), new THREE.LineBasicMaterial({ color: 0xc3d6d0, transparent: true, opacity: 0.23 }));
scene.add(waterDetail);

const car = new THREE.Group();
const body = new THREE.Mesh(new THREE.BoxGeometry(4.6, 1.0, 1.9), new THREE.MeshStandardMaterial({ color: 0xf1f2ee, roughness: 0.35 }));
body.position.y = 0.75; car.add(body);
const glass = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.6, 1.7), new THREE.MeshStandardMaterial({ color: 0x273a43, roughness: 0.2 }));
glass.position.set(-0.1, 1.5, 0); car.add(glass);
for (const x of [-1.5, 1.5]) for (const z of [-0.92, 0.92]) {
  const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.23, 12), new THREE.MeshStandardMaterial({ color: 0x1b2629 }));
  wheel.rotation.x = Math.PI / 2; wheel.position.set(x, 0.4, z); car.add(wheel);
}
scene.add(car);

const views = ['tower', 'piers', 'overview', 'drive'];
let model, manifest, theme = 'light', mode = 'tower', playing = false;
let station = TOWER_STATION - 420, request = 0;
const loader = new GLTFLoader();
async function rebuild() {
  const generation = ++request;
  const detail = $('detail').value, source = $('source').value;
  $('error').textContent = '';
  try {
    const candidate = source === 'glb'
      ? (await loader.loadAsync(`/models/landmarks/samuel-de-champlain-${detail}.glb`)).scene
      : createChamplain({ detail, theme });
    if (generation !== request) { disposeChamplain(candidate); return; }
    if (model) { scene.remove(model); disposeChamplain(model); }
    model = candidate; scene.add(model); applyTheme();
    let triangles = 0;
    model.traverse((o) => { if (o.isMesh) triangles += (o.geometry.index?.count || o.geometry.attributes.position.count) / 3; });
    $('triangles').textContent = (triangles / 1000).toFixed(1) + 'k';
    const asset = manifest?.assets[detail];
    $('asset-size').textContent = asset ? Math.round(asset.bytes / 1024) + ' KB' : '—';
    $('download').href = `/models/landmarks/samuel-de-champlain-${detail}.glb`;
  } catch (e) { $('error').textContent = 'The model could not be loaded. ' + e.message; }
}
function applyTheme() {
  const night = theme === 'dark';
  document.body.classList.toggle('dark', night);
  scene.background = new THREE.Color(night ? 0x172b3a : 0xdce7e6);
  scene.fog = new THREE.Fog(scene.background, 3800, 11000);
  water.material.color.set(night ? 0x243e4a : 0x91b7b2);
  waterDetail.material.opacity = night ? 0.08 : 0.23;
  ambient.intensity = night ? 1.8 : 2.7; sun.intensity = night ? 0.8 : 3.2;
  model?.traverse((o) => { if (o.isMesh) {
    const color = BRIDGE_PALETTES[theme][o.material.name];
    if (color) o.material.color.set(color);
  } });
  $('theme').textContent = night ? 'Day' : 'Night';
  $('theme').setAttribute('aria-label', night ? 'Switch to day' : 'Switch to night');
}
function view(next) {
  mode = next; playing = next === 'drive';
  for (const name of views) $(name).setAttribute('aria-pressed', String(name === next));
  controls.enabled = next !== 'drive';
  if (next === 'tower') {
    controls.target.set(-110, 48, 0); camera.position.set(490, 305, 575);
  } else if (next === 'piers') {
    const at = TOWER_STATION - 430;
    const target = bridgePoint(at, 0, 19), eye = bridgePoint(at - 115, 55, 16);
    controls.target.set(target.x, target.y, target.z); camera.position.set(eye.x, eye.y, eye.z);
  } else if (next === 'overview') {
    const c = bridgePoint(BRIDGE_LENGTH / 2);
    controls.target.set(c.x, 20, c.z); camera.position.set(c.x + 600, 1550, c.z + 2450);
  } else if (station >= BRIDGE_LENGTH - 1) station = 0;
  controls.update();
}
for (const name of views) $(name).onclick = () => view(name);
$('theme').onclick = () => { theme = theme === 'light' ? 'dark' : 'light'; applyTheme(); };
$('source').onchange = rebuild; $('detail').onchange = rebuild;
$('progress').oninput = () => { station = BRIDGE_LENGTH * Number($('progress').value) / 100; if (mode !== 'drive') view('drive'); playing = false; };
window.addEventListener('resize', () => {
  renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
});
let previous = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - previous) / 1000); previous = now;
  if (playing) station = Math.min(BRIDGE_LENGTH, station + dt * 25);
  const p = bridgePoint(station, 17.8);
  car.position.set(p.x, p.y + 0.05, p.z); car.rotation.y = -Math.atan2(p.tz, p.tx);
  if (mode === 'drive') {
    camera.position.set(p.x - p.tx * 32, p.y + 15, p.z - p.tz * 32);
    camera.lookAt(p.x + p.tx * 60, p.y + 4, p.z + p.tz * 60);
  } else controls.update();
  $('progress').value = String(station / BRIDGE_LENGTH * 100);
  renderer.render(scene, camera); requestAnimationFrame(frame);
}
fetch('/models/landmarks/samuel-de-champlain.json').then((r) => { if (!r.ok) throw new Error('asset manifest unavailable'); return r.json(); }).then((m) => { manifest = m; return rebuild(); }).catch((e) => { $('error').textContent = e.message; });
const initialView = new URLSearchParams(location.search).get('view');
view(views.includes(initialView) ? initialView : 'tower'); applyTheme(); requestAnimationFrame(frame);
// Read-only QA handle, used to compare generated and loaded geometry.
window.__bridgePreview = { renderer, scene, camera, get model() { return model; }, get station() { return station; }, get mode() { return mode; } };
