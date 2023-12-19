import { Color } from 'three';
import { SubsurfaceMaterialInstace } from '../Shaders/subSurfaceMaterial';
import globalState from '../store/globalState';
import { HDRIUpdateToken, UpdateLightActive } from '../utils/pubsubTokens';
import { shadows } from './shadows';

export default class DayNight {
  constructor() {
    // console.log('dayLight constructor');
    this.dayLight_Desktop = document.getElementById('dayLight_Desktop');
    this.nightLight_Desktop = document.getElementById('nightLight_Desktop');
    this.dayExposure = 0.2;
    this.nightExposure = 0.3;
    this.roofEmissiveMesh = null;
    this.fanMotorEmissiveMesh = null;
    this.lamptop = null;
    this.dayLight_Desktop.addEventListener('click', () => {
      this.enableDaylights();
    });
    this.nightLight_Desktop.addEventListener('click', () => {
      this.enableNightLights();
    });
  }
  enableDaylights() {
    Spinner.style.display = 'block';
    globalState.loading = true;
    globalState.updateSpinner()
    globalState.pauseRender = true;
    globalState.isDay = true;
    this.dayLight_Desktop.style.display = 'none';
    this.nightLight_Desktop.style.display = 'block';

    PubSub.publish(UpdateLightActive, {
      name: 'Sun Light',
      value: true,
    });
    PubSub.publish(UpdateLightActive, {
      name: 'Table Lamp',
      value: false,
    });
    PubSub.publish(UpdateLightActive, {
      name: 'Wall Washer Light',
      value: false,
    });
    PubSub.publish(UpdateLightActive, {
      name: 'Ceiling Light',
      value: false,
    });
    PubSub.publish(UpdateLightActive, {
      name: 'Wall Lamp',
      value: false,
    });
    PubSub.publish(UpdateLightActive, {
      name: 'Floor Lamp',
      value: false,
    });
    PubSub.publish(HDRIUpdateToken, {
      exposure: this.dayExposure,
      background: 'dayBackground',
    });
    // if (this.lamptop) {
    //   this.lamptop.material = this.lampDefaultMaterial;
    // }
    console.log(this.fanMotorEmissiveMesh, this.roofEmissiveMesh);
    globalState.isDay = true;
    if (this.roofEmissiveMesh) {
      this.roofEmissiveMesh.material.emissive = new Color(0x645e57);
      // this.fanMotorEmissiveMesh.material.emissive = new Color(0x7b7770);
    }

    // scene.background = background_1;
    // Spinner.style.display = 'none';
    shadows(
      globalState.scene,
      0,
      this.sunLight,
      this.fanLight,
      this.roomParent
    );
    globalState.pauseRender = false;
    globalState.loading = false;
    globalState.worldInstance.animate();
  }
  enableNightLights() {
    globalState.isDay = false;
    dayLight_Desktop.style.display = 'block';
    nightLight_Desktop.style.display = 'none';
    
    globalState.loading = true;
    globalState.updateSpinner()
    globalState.pauseRender = true;
    PubSub.publish(UpdateLightActive, {
      name: 'Sun Light',
      value: false,
    });
    PubSub.publish(UpdateLightActive, {
      name: 'Table Lamp',
      value: true,
    });
    PubSub.publish(UpdateLightActive, {
      name: 'Wall Washer Light',
      value: true,
    });
    PubSub.publish(UpdateLightActive, {
      name: 'Ceiling Light',
      value: true,
    });
    PubSub.publish(UpdateLightActive, {
      name: 'Wall Lamp',
      value: true,
    });
    PubSub.publish(UpdateLightActive, {
      name: 'Floor Lamp',
      value: true,
    });
    PubSub.publish(HDRIUpdateToken, {
      exposure: this.nightExposure,
      background: 'nightBackground',
    });
    globalState.isDay = false;
    if (this.roofEmissiveMesh) {
      this.roofEmissiveMesh.material.emissive = new Color(0x1d160f);
      // this.fanMotorEmissiveMesh.material.emissive = new Color(0x251d11);
    }
    shadows(
      globalState.scene,
      1,
      this.sunLight,
      this.fanLight,
      this.roomParent
    );
    globalState.pauseRender = false;
    globalState.loading = false;
    globalState.worldInstance.animate();
    // scene.background = background_0;
    // if (this.lamptop) {
    //   this.lamptop.material = SubsurfaceMaterialInstace.subMaterial;
    // }
    // Spinner.style.display = 'none';
  }
  setShadowData(sunLight, fanLight, roomParent) {
    this.sunLight = sunLight;
    this.fanLight = fanLight;
    this.roomParent = roomParent;
  }
  setEmissiveMaterials(roofEmissiveMesh, fanMotorEmissiveMesh) {
    this.fanMotorEmissiveMesh = fanMotorEmissiveMesh;
    this.roofEmissiveMesh = roofEmissiveMesh;
  }
  setLampTop(lamptop, defaultMaterial) {
    this.lampDefaultMaterial = defaultMaterial;
    this.lamptop = lamptop;
    this.lamptop.material = SubsurfaceMaterialInstace.subMaterial;
  }
}
const dayNightInstance = new DayNight();
export { dayNightInstance };
