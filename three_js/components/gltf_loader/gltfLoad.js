import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import GLTFMeshGpuInstancingExtension from 'three-gltf-extensions/loaders/EXT_mesh_gpu_instancing/EXT_mesh_gpu_instancing.js';
import GLTFMaterialsVariantsExtension from 'three-gltf-extensions/loaders/KHR_materials_variants/KHR_materials_variants.js';
import { loadingManager } from '../loadingManager';
import globalState from '../../store/globalState';
async function gltfLoad(modelURL) {
  let manager = loadingManager();
  const loader = new GLTFLoader(manager);

  //Draco Loader
  const dracoLoader = new DRACOLoader(manager);
  dracoLoader.setDecoderPath('decoder/draco/');
  loader.setDRACOLoader(dracoLoader);

  //MeshGPU Instancing
  loader.register((parser) => new GLTFMeshGpuInstancingExtension(parser));
  //Material Variants
  loader.register((parser) => new GLTFMaterialsVariantsExtension(parser));

  // globalState.loading=true
  const gltfData = await loader.loadAsync(`${modelURL}`);
  return { gltfData };
}

export { gltfLoad };
