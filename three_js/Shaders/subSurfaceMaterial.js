import {
  RepeatWrapping,
  ShaderMaterial,
  TextureLoader,
  UniformsUtils,
  Vector3,
} from 'three';
import { SubsurfaceScatteringShader } from 'three/examples/jsm/shaders/SubsurfaceScatteringShader.js';

export default class SubSurfaceMaterial {
  constructor() {
    this.textureLoader = new TextureLoader();
    this.subTexture = this.textureLoader.load(
      'https://d3t7cnf9sa42u5.cloudfront.net/textures/subSurface.jpg'
    );
    this.subTexture.wrapS = RepeatWrapping;
    this.subTexture.wrapT = RepeatWrapping;
    this.subTexture.repeat.set(4, 4);

    const shader = SubsurfaceScatteringShader;
    const uniforms = UniformsUtils.clone(shader.uniforms);
    uniforms.diffuse.value = new Vector3(0.8, 0.3, 0.2);
    uniforms.shininess.value = 10;

    uniforms.thicknessMap.value = this.subTexture;
    uniforms.thicknessColor.value = new Vector3(0.1, 0, 0);
    uniforms.thicknessDistortion.value = 0.1;
    uniforms.thicknessAmbient.value = 0.4;
    uniforms.thicknessAttenuation.value = 0.7;
    uniforms.thicknessPower.value = 10.0;
    uniforms.thicknessScale.value = 1;

    this.subMaterial = new ShaderMaterial({
      uniforms: uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,
      lights: true,
    });
  }
}

const SubsurfaceMaterialInstace = new SubSurfaceMaterial();
export { SubsurfaceMaterialInstace };
