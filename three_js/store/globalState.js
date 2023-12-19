const globalState = {
  isDay: true,
  scene: null,
  renderer: null,
  camera: null,
  // activeAnimation: "table"| "chair" | "blinds" |'viewPoints"
  activeAnimation: 'none',
  isMeasurementActive: false,
  pauseRender: false,
  renderFunction: null,
  worldInstance: null,
  composer: null,
  FloorLampObject: null,
  WallLampObject: null,
  loading: false,
  sceneData:null,
  VariantData:{ },
  AnimationData:{ },
};
export default globalState;