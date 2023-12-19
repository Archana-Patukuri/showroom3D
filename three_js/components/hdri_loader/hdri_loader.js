/* eslint-disable */
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import {
  EquirectangularReflectionMapping,
  LoadingManager,
  sRGBEncoding,
  TextureLoader,
} from 'three';
import { loadingManager } from '../loadingManager';
export default async function hdriLoad() {
  let manager=loadingManager();

  const hdriLoader = new RGBELoader(manager).setPath('https://d3t7cnf9sa42u5.cloudfront.net/hdri/');

  const textureLoader = new TextureLoader(manager).setPath('https://d3t7cnf9sa42u5.cloudfront.net/hdri/');

  const [background0,background1, hdri1] = await Promise.all([
    textureLoader.loadAsync('autumn_forest(Night).jpg'),
    textureLoader.loadAsync('autumn_forest(Day).jpg'),
        
    textureLoader.loadAsync('cyclorama_hard_light_1k.jpg'),
  ]);
  background0.encoding = sRGBEncoding;
  background0.mapping = EquirectangularReflectionMapping;
  background1.encoding = sRGBEncoding;
  background1.mapping = EquirectangularReflectionMapping;  
   hdri1.mapping = EquirectangularReflectionMapping;
  return { background0,background1, hdri1 };
}
