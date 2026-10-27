import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { prepareModelFrames } from './model-frame.js';

/** Shared by the map, standalone layers and Node GLB tests; float caches work too. */
export function createLandmarkGLTFLoader() {
  return new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).register(() => ({
    name: 'CODRIVER_model_frame',
    afterRoot(gltf) {
      const error = gltf.asset?.extras?.quantization?.maxPositionErrorM;
      for (const scene of gltf.scenes) {
        // Float GLBs have no grid. Tests and tooling read this; the renderer does not.
        if (typeof error === 'number' && error > 0) scene.userData.landmarkQuantizationErrorM = error;
        prepareModelFrames(scene);
      }
    },
  }));
}
