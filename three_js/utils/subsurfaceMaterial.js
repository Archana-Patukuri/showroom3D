import {
  RepeatWrapping,
  ShaderMaterial,
  TextureLoader,
  UniformsUtils,
  Vector3,
} from 'three';
import { SubsurfaceScatteringShader } from 'three/examples/jsm/shaders/SubsurfaceScatteringShader.js';

export default function createSubsurfacematerial() {
  let texLoader = new TextureLoader();
  let subTexture = texLoader.load(
    'https://d3t7cnf9sa42u5.cloudfront.net/textures/subSurface.jpg'
  );
  subTexture.wrapS = subTexture.wrapT = RepeatWrapping;
  subTexture.repeat.set(4, 4);

  const shader = SubsurfaceScatteringShader;
  const uniforms = UniformsUtils.clone(shader.uniforms);
  uniforms.diffuse.value = new Vector3(0.8, 0.3, 0.2);
  uniforms.shininess.value = 10;

  uniforms.thicknessMap.value = subTexture;
  uniforms.thicknessColor.value = new Vector3(0.1, 0, 0);
  uniforms.thicknessDistortion.value = 0.1;
  uniforms.thicknessAmbient.value = 0.4;
  uniforms.thicknessAttenuation.value = 0.7;
  uniforms.thicknessPower.value = 10.0;
  uniforms.thicknessScale.value = 1;

  const subMaterial = new ShaderMaterial({
    uniforms,
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader,
    lights: true,
  });
  return subMaterial;
}
