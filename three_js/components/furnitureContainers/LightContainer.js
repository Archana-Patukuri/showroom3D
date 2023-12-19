import { lightTypesUI } from '../../systems/UI-Generators/lightTypesUI.js';
import { gltfLoad } from '../gltf_loader/gltfLoad.js';
import { AnimationMixer, Group } from 'three';
let flag = 0;
class LightContainer {
  constructor(
    assetsList,
    lightsTypesUI,
    category,
    initialModelID,
    selectableObjects,
    scene,
    renderer,
    Spinner
  ) {
    this.assetsList = assetsList;
    this.parentGroup = new Group();
    this.parentGroup.name = 'selectable';
    this.parentGroup1 = new Group();
    this.parentGroup1.name = 'selectable';
    this.parentGroup2 = new Group();
    this.parentGroup2.name = 'selectable';
    this.models = [];
    this.lightsTypesUI = lightsTypesUI;
    this.model;
    this.category = category;
    this.initialModelID = initialModelID;
    this.selectableObjects = selectableObjects;
    this.scene = scene;
    this.renderer = renderer;
    this.data = [];
    this.Spinner=Spinner
  }

  async loadModel(URL, i) {
    // this.toastbody.replaceChildren();
    //Load a Default Model with "initialModelID"    
    this.Spinner.style.display="block"
    URL ||= this.assetsList[this.initialModelID].URL;

    i ||= this.initialModelID;

    // flag is used to skip the fetching of models on initial load
    // if (flag > 0) {
    if (this.models[i] === undefined) {
      console.time('downloaded the light model');
      const { gltfData } = await gltfLoad(URL);
      console.timeEnd('downloaded the light model');

      this.data = [];
      this.data.push(gltfData);
      let loadedModel = gltfData.scene;
      this.models[i] = loadedModel;
    }

    this.model = this.models[i];

    if (this.models[i].children[0].name.slice(0, 5) == 'Lamp1') {
      console.time('added the light model to the scene');
      this.models[i].children[0].position.set(-1.5, 0.017, -1.111);
      this.models[i].children[0].rotation.set(0, -1.5, 0);
      this.parentGroup.add(this.model);
      console.timeEnd('added the light model to the scene');
    }
    if (
      this.models[i].children[0].name.slice(0, 6) == 'Lamp21' ||
      this.models[i].children[0].name.slice(0, 6) == 'Lamp22'
    ) {
      this.parentGroup2.add(this.model);
      console.log('added the light model to the scene');
    }
    // }
    this.scene.add(this.parentGroup);
    this.selectableObjects.push(this.parentGroup);
    this.scene.add(this.parentGroup2);
    this.selectableObjects.push(this.parentGroup2);
    // flag += 1;
    this.Spinner.style.display = 'none';

    return this.data;
  }

 

  createUI() {
    //Creates FurnitureTypes UI
    lightTypesUI(
      this.assetsList,
      this.lightsTypesUI,
      this.category,
      this.loadModel.bind(this),
      this.initialModelID,
      this.selectableObjects,
      this.scene,
      this.Spinner
    );
  }
}

export { LightContainer };
