import hdriLoad from '../components/hdri_loader/hdri_loader';

const initialValue = {
  enabled: false,
  intensity: 0.5,
  color: '#ffffff',
  distance: 2,
};

const lightState = (settings, object) => {
  // console.log(settings);

  const { enabled, intensity, color, distance } = settings;
  // console.log(enabled, intensity, color, distance);
  // console.log(settings);
  return {
    enabled,
    intensity,
    color,
    distance,
    object,
  };
};

export default class LightStore {
  constructor(scene, objects) {
    this.scene = scene;
    this.isDay = true;
    this.isPitchDark = false;
    this.ceilingLight = lightState(initialValue);
    this.desktopLight = lightState(initialValue);
    this.wallWasherLight = lightState(initialValue);
    this.sunLight = lightState(initialValue);
    this.ambientLight = lightState(initialValue);
    this.floorLamo = lightState(initialValue);
    this.wallLights = lightState(initialValue);
    this.activeHdri = '';
    this.sunlightShadow = false;
    this.nightLightShadow = true;
    this.mirrorReflection = false;
    this.floorReflection = false;

    this.sceneBackground = '#ffffff';
    this.toneMappingValue = 0.3;

    this.scene.background = this.sceneBackground;
  }

  togglePresets() {
    this.sunLight = lightState(this.isDay, 0.2);
    this.desktopLight = lightState(true, this.isDay ? 0.2 : 0.8);

    this.isDay = !this.isDay;
  }

  updateSunlight(settings) {
    console.log(settings);
    this.sunLight = lightState({ ...this.sunLight, ...settings });
  }

  updateDesktopLight(settings) {
    console.log(settings);
    this.desktopLight = lightState({ ...this.sunLight, ...settings });
  }

  updateCielingLight(settings) {
    console.log(settings);
    this.ceilingLight = lightState({ ...this.sunLight, ...settings });
  }

  updateWallWasherLight(settings) {
    console.log(settings);
    this.wallWasherLight = lightState({ ...this.sunLight, ...settings });
  }

  updateToneMappingExposure(val) {
    this.toneMappingValue = val;
  }

  updateSceneBackground(val) {
    this.sceneBackground = val;
    this.scene.background = this.sceneBackground;
  }

  updateShadows(val) {
    this.shadows = val;
  }

  updatePitchDark(val) {
    this.pitchDark = val;
  }
}
