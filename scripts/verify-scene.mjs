import { verifyScenePackage } from './scenes/scene-package.js';
if (!process.argv[2]) throw new Error('Usage: node scripts/verify-scene.mjs /path/to/extracted-scene');
console.log(JSON.stringify(await verifyScenePackage(process.argv[2]), null, 2));
