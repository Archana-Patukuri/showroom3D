import { createCamera } from './components/camera.js';
import { createScene } from './components/scene.js';
import { createCameraControls } from './systems/cameraControls.js';
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { reflection } from './systems/reflection.js';
import { viewPoints } from './systems/viewpoints.js';
import { basicControls } from './systems/basicControls.js';
import { resetAndHelp } from './systems/resetAndHelp.js';
import { shadows } from './systems/shadows.js';

import { enableLights } from './systems/lightControls1.js';
// import { loadTableVaseGLTF } from './systems/loadVase.js';
// import { loadMonitor } from './systems/loadMonitor.js';
import {
  AddLightToken,
  HDRIUpdateToken,
  UpdateLightActive,
} from './utils/pubsubTokens';

import globalState from './store/globalState';

import hdriLoad from './components/hdri_loader/hdri_loader.js';
import { Debug } from './systems/Debug.js';

import LightStore from './store/lightStore';

import {
  Box3,
  Clock,
  Group,
  Mesh,
  MeshStandardMaterial,
  Raycaster,
  SphereGeometry,
  Vector2,
  Vector3,
  AmbientLight,
  Color,
  RectAreaLight,
  AnimationMixer,
  LoopOnce,
  RepeatWrapping,
  ShaderMaterial,
  TextureLoader,
  UniformsUtils,
} from 'three';
import * as THREE from 'three';
import { createEffectComposer } from './systems/effectComposer.js';
import { SubsurfaceScatteringShader } from 'three/examples/jsm/shaders/SubsurfaceScatteringShader.js';

import { GammaCorrectionShader } from '../node_modules/three/examples/jsm/shaders/GammaCorrectionShader.js';
import { RenderPass } from '../node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from '../node_modules/three/examples/jsm/postprocessing/ShaderPass.js';
import { TAARenderPass } from '../node_modules/three/examples/jsm/postprocessing/TAARenderPass.js';
import { FXAAShader } from '../node_modules/three/examples/jsm/shaders/FXAAShader.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';

import { OutlinePass } from '../node_modules/three/examples/jsm/postprocessing/OutlinePass.js';
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';
import { SAOPass } from 'three/addons/postprocessing/SAOPass.js';
import { SSAARenderPass } from 'three/addons/postprocessing/SSAARenderPass.js';
import { SSRPass } from 'three/addons/postprocessing/SSRPass.js';
import { ReflectorForSSRPass } from 'three/addons/objects/ReflectorForSSRPass.js';

import { TransformControls } from '../node_modules/three/examples/jsm/controls/TransformControls.js';
import { FurnitureContainer } from './components/furnitureContainers/FurnitureContainer.js';
import { LightContainer } from './components/furnitureContainers/LightContainer.js';
import { exportScene } from './systems/export.js';

import { gltfLoad } from './components/gltf_loader/gltfLoad.js';
import assets from './dataBase/assets.json' assert { type: 'json' };

import { threeSixtySpin } from '../threeSixtySpin/threesixty1.js';

import { Line2 } from '../node_modules/three/examples/jsm/lines/Line2.js';
import { LineMaterial } from '../node_modules/three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from '../node_modules/three/examples/jsm/lines/LineGeometry.js';

import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

import {
  CSS2DObject,
  CSS2DRenderer,
} from 'three/examples/jsm/renderers/CSS2DRenderer.js';
let mobile = false;
if (/Android|iPhone/i.test(navigator.userAgent)) {
  mobile = true;
}
let lineId = 0;
let measurementDiv, mixer;
const measurementLabels = [];

let prompt = document.getElementById('ar-prompt');

const container = document.querySelector('#scene-container');
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(container.clientWidth, container.clientHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
container.appendChild(labelRenderer.domElement);

let tranform_Desktop = document.querySelectorAll('.tranform_Desktop');
let showCurrentMode = document.getElementById('showCurrentMode');

let ambientLightSun;
let shadowLight;
let camera;
let renderer;
let scene;
let cameraControls;
let debug;
let clock;
let plantsParent,
  lampsParent,
  mirrorParent,
  vaseParent,
  laptopParent,
  fanParent,
  vaseFloorParent,
  framesParent,
  wallLightParent,
  loungChairParent,
  tableVaseParent,
  monitorParent;
let composer;
let chairModels, tableModels, blindsModels, lightsModels;
let gui;

let mouse = new Vector2();

let raycaster = new Raycaster();
let selectedObjects = [];
let selectableObjects = [];

let transformControl;
let box, outlinePass, effectFXAA;
let chairsUIContainer, tablesUIContainer, blindsUIContainer, lightsUIContainer;

chairsUIContainer = document.getElementById('Chair_Desktop');
tablesUIContainer = document.getElementById('Table_Desktop');
blindsUIContainer = document.getElementById('windowBlinds_Desktop');
lightsUIContainer = document.getElementById('lightsUIContainer_Desktop');

let UIContainer;
let roomParent;
let sunLight;

plantsParent = new Group();
plantsParent.name = 'selectable';

mirrorParent = new Group();
mirrorParent.name = 'selectable';

vaseParent = new Group();
vaseParent.name = 'selectable';

lampsParent = new Group();
lampsParent.name = 'selectable';

laptopParent = new Group();
laptopParent.name = 'selectable';

vaseFloorParent = new Group();
vaseFloorParent.name = 'selectable';

tableVaseParent = new Group();
tableVaseParent.name = 'selectable';

monitorParent = new Group();
monitorParent.name = 'selectable';

framesParent = new Group();
framesParent.name = 'selectable';

loungChairParent = new Group();
loungChairParent.name = 'selectable';

wallLightParent = new Group();
wallLightParent.name = 'selectable';

let rectAreaLights = [];

let HDRI = document.getElementById('HDRI');
let Emissive = document.getElementById('Emissive');

let gui_ui = document.getElementById('gui_ui');
let start, millis;
start = Date.now();
console.log('timer started');
let fanLight;
let flag = 0;
let emissive_Obj, Motor_emissive;
let pauseRender;
import useSpinner from '../use-spinner';
import '../use-spinner/assets/use-spinner.css';
let container_3d = document.getElementById('3dcontainer');
let loungeChairUIContainer, loungeChairModels;
let background_1, hdri_0, hdri_1, background_0;
let Spinner = document.getElementById('Spinner');

// const sleep = (m) => new Promise((r) => setTimeout(r, m));
let CL_gltfData, DL_gltfData, sceneData;
let lampDefaultMat, LampTop, subMaterial;
import { dayNightInstance } from './systems/dayNight.js';
import { SubsurfaceMaterialInstace } from './Shaders/subSurfaceMaterial.js';
import { DragControls } from 'three/addons/controls/DragControls.js';
let controls;
let preloadedModels;
let mode_type;
class World {
  constructor() {
   /*  let texLoader = new TextureLoader();
    let subTexture = texLoader.load(
      'https://d3t7cnf9sa42u5.cloudfront.net/textures/subSurface.jpg'
    );
    subTexture.wrapS = RepeatWrapping;
    subTexture.wrapT = RepeatWrapping;
    subTexture.repeat.set(4, 4);

    const shader = SubsurfaceScatteringShader;
    const uniforms = UniformsUtils.clone(shader.uniforms);
    uniforms['diffuse'].value = new Vector3(0.8, 0.3, 0.2);
    uniforms['shininess'].value = 10;

    uniforms['thicknessMap'].value = subTexture;
    uniforms['thicknessColor'].value = new Vector3(0.1, 0, 0);
    uniforms['thicknessDistortion'].value = 0.1;
    uniforms['thicknessAmbient'].value = 0.4;
    uniforms['thicknessAttenuation'].value = 0.7;
    uniforms['thicknessPower'].value = 10.0;
    uniforms['thicknessScale'].value = 1;

    subMaterial = new ShaderMaterial({
      uniforms: uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,
      lights: true,
    });
 */
    subMaterial = SubsurfaceMaterialInstace.subMaterial;

    this.container = container;
    UIContainer = container;

    this.cylindricalLightArray = [];

    labelRenderer.setSize(container.clientWidth, container.clientHeight);

    scene = createScene();
    renderer = createRenderer();

    composer = createEffectComposer(renderer);

    camera = createCamera();
    scene.add(camera);
    camera.layers.enable(0);
    camera.layers.enable(2);

    renderer.domElement.addEventListener('pointermove', (e) => {
      prompt.style.display = 'none';
    });
    let desktopUI = document.getElementById('desktopUI');
    desktopUI.onclick = function (event) {
      prompt.style.display = 'none';
    };
    const grid = new THREE.GridHelper(10, 20, 0xffffff, 0xffffff);
    grid.material.opacity = 0.5;
    grid.position.y = -0.02;
    grid.material.transparent = true;
    scene.add(grid);

    box = new Box3();

    fanParent = new Group();
    fanParent.name = 'selectable';

    roomParent = new Group();
    roomParent.name = 'selectable';
    clock = new Clock();

    loungeChairModels = new FurnitureContainer(
      assets.LoungChair,
      loungeChairUIContainer,
      'chairs',
      '0',
      scene,
      renderer,
      selectableObjects,
      subMaterial,
      Spinner
    );

    chairModels = new FurnitureContainer(
      assets.Chairs,
      chairsUIContainer,
      'chairs',
      '0',
      scene,
      renderer,
      selectableObjects,
      subMaterial,
      Spinner
    );
    tableModels = new FurnitureContainer(
      assets.Tables,
      tablesUIContainer,
      'tables',
      '0',
      scene,
      renderer,
      selectableObjects,
      subMaterial,
      Spinner
    );

    blindsModels = new FurnitureContainer(
      assets.Blinds,
      blindsUIContainer,
      'windowBlinds',
      '0',
      scene,
      renderer,
      selectableObjects,
      subMaterial,
      Spinner
    );

    lightsModels = new LightContainer(
      assets.Lights,
      lightsUIContainer,
      'lights',
      '0',
      selectableObjects,
      scene,
      renderer,
      Spinner
    );
    //for adding Helpers and FPS
    debug = new Debug();

    RectAreaLightUniformsLib.init();

    for (let i = 0; i < 4; i++) {
      const rectLight = new RectAreaLight(0xffffff, 0.1, 3, 0.15);
      rectAreaLights.push(rectLight);
      scene.add(rectLight);
    }

    rectAreaLights[0].position.set(0.085, 2.97, 1.9525);
    rectAreaLights[1].position.set(0.085, 2.97, -1.0855);
    rectAreaLights[1].rotateY(Math.PI);

    rectAreaLights[2].position.set(1.58, 2.97, 0.45);
    rectAreaLights[2].rotateY(Math.PI / 2);

    rectAreaLights[3].position.set(-1.41, 2.97, 0.45);
    rectAreaLights[3].rotateY(-Math.PI / 2);

    //WINDOW RESIZER
    const resizer = new Resizer(
      container,
      camera,
      renderer,
      composer,
      labelRenderer
    );
    container.append(renderer.domElement);
    //Orbit Controlls for Camera
    cameraControls = createCameraControls(camera, renderer.domElement);
    camera.position.set(0.01, 2.165, 4.7);
    camera.name = 'PerspectiveCamera';

    globalState.scene = scene;
    globalState.renderer = renderer;
    globalState.camera = camera;

    enableLights(renderer);

    basicControls(scene, camera, cameraControls, renderer);
    resetAndHelp(camera, cameraControls);

    viewPoints(camera, scene, framesParent);
    let spin_description =
        'Light Filtering Blinds for Windows, Horizontal Window Blinds, Shades for Indoor Windows with different material variants i.e Wooden,Grey and Translucent, 58”D x 6” W x 71” H',
      variant = 1;
    let furnitureName = 'Horizontal_Blind';
    localStorage.clear();
    localStorage.furnitureName = furnitureName;
    localStorage.variant = 1;
    threeSixtySpin(furnitureName, variant, spin_description);
    localStorage.framesValue = 'true';
    localStorage.tableV = 0;

    PubSub.subscribe(HDRIUpdateToken, (token, msg) => {
      renderer.toneMappingExposure = msg.exposure;
      scene.background = this.backgrounds[msg.background];
    });

  fetch('https://d3t7cnf9sa42u5.cloudfront.net/sceneData.json')
  .then(response => response.json())
  .then(data => {
    // Process the existing JSON data
    console.log("JSON data",data);
    globalState.sceneData=data    
  })
  .catch(error => {
    // Handle errors
    console.error(error);
  });  
  }
  async loadHDRI() {
    console.time('Initial_HDRI_Loading');

    let slider_HL = document.querySelector('.slider_class');
    let { background0, background1, hdri1 } = await hdriLoad();

    this.backgrounds = {
      nightBackground: background0,
      dayBackground: background1,
    };

    this.hdriMap = {
      lighthdri: hdri1,
    };
    scene.environment = hdri1;    
    background_0 = background0;
    background_1 = background1;
    HDRI.addEventListener('change', (e) => {
      if (e.target.checked) {
        renderer.toneMappingExposure = slider_HL.value;
        slider_HL.oninput = function () {
          renderer.toneMappingExposure = parseFloat(this.value);
        };
      } else {
        renderer.toneMappingExposure = 0.1;
      }
    });
    HDRI.checked = true;
    HDRI.dispatchEvent(new Event('change'));
    scene.background = this.backgrounds.dayBackground;

    emissive_Obj = roomParent.getObjectByName('Mesh_Walls001');
    Motor_emissive = roomParent.getObjectByName('Motor_emissive');
    
    let Emissive = document.getElementById('Emissive');
    Emissive.addEventListener('change', (e) => {
      if (e.target.checked) {
        emissive_Obj.material.emissive = new Color(1, 1, 1);
        Motor_emissive.material.emissive = new Color(1, 1, 1);
      } else {
        emissive_Obj.material.emissive = new Color(0x251d11);
        Motor_emissive.material.emissive = new Color(0x251d11);
      }
    });
    console.timeEnd('Initial_HDRI_Loading');
  }

  createUI() {
    //created FurnitureTypesUI from JSON data
    tableModels.createUI();
    chairModels.createUI();
    blindsModels.createUI();
    lightsModels.createUI();
  }
  //LoadRoom
  async loadRoomGLTF() {
    // let modelURL = await fetch(assets.Room[0].URL);
    let modelURL = assets.Room[0].URL;
    let { gltfData } = await gltfLoad(modelURL);
    let loadedmodel = gltfData.scene;
    this.room = loadedmodel;
    roomParent.add(loadedmodel);
    let Themes_Desktop = document.getElementById('Themes_Desktop');

    for (let i = 0; i < gltfData.userData.variants.length; i++) {
      let div2 = document.createElement('div');
      div2.className = 'd-flex flex-row';
      div2.style.marginTop = '2px';

      let input = document.createElement('input');
      input.type = 'radio';
      input.className = 'largerCheckbox';
      input.value = gltfData.userData.variants[i];
      input.name = gltfData.userData.variants[i].name;
      input.id = gltfData.userData.variants[i];

      let label = document.createElement('label');

      label.setAttribute('for', gltfData.userData.variants[i]);
      label.innerHTML = gltfData.userData.variants[i];

      div2.appendChild(input);
      div2.appendChild(label);

      Themes_Desktop.appendChild(div2);

      async function input_var_Fun() {
        let myPromise = new Promise(function (resolve) {
          gltfData.functions.selectVariant(
            gltfData.scene,
            gltfData.userData.variants[i]
          );
          reflection(scene, clock, gui);
        });
        await myPromise;
      }
      input.addEventListener('click', function (e) {
        if (e.target.checked) {
          input_var_Fun();
        }
      });
      if (input.id == 'Theme_3') {
        input.checked = true;
      }
    }   
    for (let i = 0; i < loadedmodel.children.length; i++) {
      if (loadedmodel.children[i].name == 'BlindsPosition') {
        let blindsPos = loadedmodel.children[i].position;
        blindsModels.parentGroup.position.copy(blindsPos);
      }
    }  
    scene.add(roomParent);    
    selectableObjects.push(roomParent);
    
    sunLight = roomParent.getObjectByName('Sun');
    /*  sunLight.castShadow = true;*/
    sunLight.intensity = 30;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.1;
    sunLight.shadow.camera.far = 10;
    sunLight.shadow.autoUpdate = true;
    sunLight.shadow.camera.updateProjectionMatrix();

    dayNightInstance.setShadowData(sunLight, fanLight, roomParent);    
    dayNightInstance.setEmissiveMaterials(
      roomParent.getObjectByName('Mesh_Walls001'),
      roomParent.getObjectByName('Motor_emissive')
    );

    PubSub.publish(AddLightToken, {
      name: 'Sun Light',
      type: sunLight.type,
      object: sunLight,
      intensity: sunLight.intensity,
      minIntensity: 0,
      maxIntensity: 40,
      color: sunLight.color,
      active: false,
    });
    
      let roomJ={
      name:"Room_101",
      position:{
        x:loadedmodel.position.x,
        y:loadedmodel.position.y,
        z:loadedmodel.position.z
      },
      rotation:{
        x:loadedmodel.rotation.x,
        y:loadedmodel.rotation.y,
        z:loadedmodel.rotation.z
      } ,
      scale:{
        x:loadedmodel.scale.x,
        y:loadedmodel.scale.y,
        z:loadedmodel.scale.z
      } 
    }           
      
       globalState.sceneData.models.push(roomJ)           
         let file,variantVal,animationVal,modelData
        let writeToFileBtn=document.getElementById("writeToFile")
            writeToFileBtn.addEventListener("click",function(e){              
              scene.traverse(function (node) {                
                if (node.name == 'selectable') {                  
                  if(node.children[0]){
                  if(node.children[0].children[0].name!="Back_Wall"){
                    let ModelName=node.children[0].children[0].name                    
                    if(globalState.VariantData[ModelName]){                                                             
                      variantVal=globalState.VariantData[ModelName]
                    } 
                    if(globalState.AnimationData[ModelName]){                                                             
                      animationVal=globalState.AnimationData[ModelName]
                    }                            
                  if(variantVal){
                    modelData={
                      name:variantVal,                   
                    }   
                    variantVal=undefined                
                  }else{                  
                    modelData={
                      name:ModelName,                    
                    } 
                  }
                    modelData["position"]={
                      x:node.children[0].children[0].position.x,
                      y:node.children[0].children[0].position.y,
                      z:node.children[0].children[0].position.z
                    }
                    modelData["rotation"]={  
                      x:node.children[0].children[0].rotation.x,
                      y:node.children[0].children[0].rotation.y,
                      z:node.children[0].children[0].rotation.z
                    } 
                    modelData["scale"]={   
                      x:node.children[0].children[0].scale.x,
                      y:node.children[0].children[0].scale.y,
                      z:node.children[0].children[0].scale.z
                    }                    
                    if(animationVal!=""){                    
                      modelData["animation"]=animationVal
                      animationVal=""
                    }                    
                        if(node.children[0].children[0].name.includes("Lamp")){
                          node.children[0].children[0].traverse(function (node){
                            if(node.isLight){
                              modelData["intensity"]=node.intensity
                              modelData["color"]={"r":node.color.r,"g":node.color.g,"b":node.color.b}                                
                            }
                          })                         
                        }
                  globalState.sceneData.models.push(modelData) 
                }                
                }
              }
              }); 
              console.log(globalState.sceneData)
              const blobData = JSON.stringify(globalState.sceneData);
              
              const blob = new Blob([blobData], { type: 'application/json' });
              const fileName = 'sceneData.json'; // Assuming the original JSON file is named 'data.json'
               file = new File([blob], fileName, { type: 'application/json' }); 
              writeToFile()
            })
        function writeToFile() {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(file);
          a.download = 'modified_sceneData_file.json';
          a.click();
        }     
  }

  async loadTableGLTF() {
    globalState.loading = true;
    this.updateSpinner();
    globalState.pauseRender = true;
    await tableModels.loadModel();
    let Lounge_Chair = scene.getObjectByName('Lounge_Chair');
    if (Lounge_Chair) {
      tableModels.parentGroup.position.set(-0.7, 0, 0.5);
    } else {
      tableModels.parentGroup.position.set(0, 0, 0);
    }
    reflection(scene, clock, gui);
    globalState.pauseRender = false;
    this.animate();
    
  }
  //LoadLights
  async loadLightsGLTF() {
    globalState.loading = true;
    globalState.pauseRender = true;
    await lightsModels.loadModel();
    globalState.pauseRender = false;
    this.animate();
  }
  //LoadBlinds
  async loadBlindsGLTF() {
    globalState.loading = true;
    this.updateSpinner();
    globalState.pauseRender = true;

    await blindsModels.loadModel();
     globalState.pauseRender = false;
     this.animate();
    // console.log('blinds drawcalls', renderer.info.render.calls);
  }
  //LoadChair
  async loadChairGLTF() {
    globalState.loading = true;
    this.updateSpinner();
    globalState.pauseRender = true;
    await chairModels.loadModel();
    let Lounge_Chair = scene.getObjectByName('Lounge_Chair');
    if (Lounge_Chair) {
      chairModels.parentGroup.position.set(-0.7, 0, -0.5);
    } else {
      chairModels.parentGroup.position.set(0, 0, -0.5);
    }
     globalState.pauseRender = false;
      this.animate();
  }
  async loadCylindricalLight() {
    globalState.loading = true;
    globalState.pauseRender = true;

    const { gltfData } = await gltfLoad(assets.Lights_2[0].URL);
    //  CL_gltfData=gltfData
    const loadedmodel = gltfData.scene;
    console.log(loadedmodel);
    const cylindricalLight1 = loadedmodel;
    wallLightParent.add(cylindricalLight1);
    scene.add(wallLightParent);

    selectableObjects.push(wallLightParent);

    this.cylindricalLightArray.push(
      wallLightParent.children[0].children[0].children[0].children[2]
    );
    this.cylindricalLightArray.push(
      wallLightParent.children[0].children[0].children[0].children[3]
    );
    this.cylindricalLightArray.push(
      wallLightParent.children[0].children[0].children[1].children[2]
    );
    this.cylindricalLightArray.push(
      wallLightParent.children[0].children[0].children[1].children[3]
    );

    this.cylindricalLightArray[0].distance = 1;
    this.cylindricalLightArray[1].distance = 1;
    this.cylindricalLightArray[2].distance = 1;
    this.cylindricalLightArray[3].distance = 1;

    PubSub.publish(AddLightToken, {
      name: 'Wall Washer Light',
      type: this.cylindricalLightArray[0].type,
      object: this.cylindricalLightArray,
      intensity: 2,
      minIntensity: 0,
      maxIntensity: 5,
      color: this.cylindricalLightArray[0].color,
      active: false,
    });
    PubSub.publish(UpdateLightActive, {
      name: 'Wall Washer Light',
      value: true,
    });
    globalState.pauseRender = false;
    this.animate();
    this.nextFrame=async ()=>{
      await this.loadDesktopLight();
      dayNightInstance.enableNightLights();
    }
  }
  async loadDesktopLight() {
    globalState.loading = true;
    globalState.pauseRender = true;

    const { gltfData } = await gltfLoad(assets.Lights[0].URL);
    // DL_gltfData=gltfData
    const loadedmodel = gltfData.scene;    
    lightsModels.parentGroup1.add(loadedmodel);
    
    lightsModels.parentGroup1.position.set(-0.25, -0.9, -0.15);
    let table_top = scene.getObjectByName('Table_Top_Mesh');
    table_top.add(lightsModels.parentGroup1);
    this.tableLamp = loadedmodel.getObjectByName('Desktop_Lamp_Light002');
    // this.tableLamp.castShadow=true
    this.tableLamp.intensity=5
   
    PubSub.publish(AddLightToken, {
      name: 'Table Lamp',
      type: this.tableLamp.type,
      object: this.tableLamp,
      intensity: 5,
      minIntensity: 0,
      maxIntensity: 5,
      color: this.tableLamp.color,
      active: true,
    });
    LampTop = loadedmodel.getObjectByName('TableStand001');
    lampDefaultMat = LampTop.material;
    dayNightInstance.setLampTop(
      LampTop,
      lampDefaultMat
    );
    //  Spinner.style.display = 'none';
    globalState.pauseRender = false;
    this.animate();

    // this.loadFloorLamp();
  }
  async loadFloorLamp() {
    const { gltfData } = await gltfLoad(
      'https://d3t7cnf9sa42u5.cloudfront.net/compressed_models/lights/Floor_Lamp_small/Floor_Lamp_small_draco.glb'
    );
    // console.log(gltfData)
    gltfData.scene.position.set(
      -0.4,
      gltfData.scene.position.y,
      gltfData.scene.position.z + 0.5
    );
    gltfData.scene.rotation.set(0, Math.PI / 2, 0);

    const group = new Group();
    group.name = 'selectable';
    scene.add(group);
    group.add(gltfData.scene);
    selectableObjects.push(group);
    renderer.compile(gltfData.scene, camera, scene);
    composer.render();
    gltfData.scene.visible = false;
    globalState.FloorLampObject = gltfData;
    // configureLights(gltfData, assets.Lights[1]);
    this.loadWallLamp();
  }

  async loadWallLamp() {
    const { gltfData } = await gltfLoad(
      'https://d3t7cnf9sa42u5.cloudfront.net/compressed_models/lights/Left_Wall_Lamp/Left_Wall_Lamp1.glb'
    );
    const group = new Group();
    group.name = 'selectable';
    scene.add(group);
    group.add(gltfData.scene);
    renderer.compile(gltfData.scene, camera, scene);
    selectableObjects.push(group);

    composer.render();
    gltfData.scene.visible = false;
    globalState.WallLampObject = gltfData;
  }
  async loadKeyboardGLTF(table_top, monitorParent) {
    
    globalState.loading = true;
    this.updateSpinner();
    globalState.pauseRender = true;
    if (
      table_top.parent.parent &&
      table_top.parent.parent.name == 'Table1_Selectable'
    ) {
      let modelURL = assets.Laptop[3].URL;
      const { gltfData } = await gltfLoad(modelURL);
      const loadedmodel = gltfData.scene;
      // shadowEnabler(loadedmodel);
      monitorParent.add(loadedmodel);
      loadedmodel.position.set(-0.3, -0.9, -0.15);
      table_top.add(monitorParent);
    }
    globalState.pauseRender = false;
    this.animate();
  }
  async loadMonitor(table_top, selectableObjects, monitorParent) {
    let mixer;
    globalState.loading = true;
    this.updateSpinner();
    globalState.pauseRender = true;
    if (
      table_top.parent.parent &&
      table_top.parent.parent.name == 'Table1_Selectable'
    ) {
      let modelURL = assets.Laptop[1].URL;
      const { gltfData } = await gltfLoad(modelURL);
      const loadedmodel = gltfData.scene;
      // shadowEnabler(loadedmodel);

      monitorParent.add(loadedmodel);
      selectableObjects.push(monitorParent);
      loadedmodel.position.set(-0.3, -0.9, -0.15);

      mixer = new AnimationMixer(monitorParent);
      let animationClips = [];
      animationClips[0] = mixer.clipAction(gltfData.animations[0]);
      animationClips[0].setLoop(LoopOnce);
      animationClips[0].play();
      setTimeout(() => {
        animationClips[0].paused = true;
      }, 2);
    }
    localStorage.tableChildren = 'Added';
    globalState.pauseRender = false;
    this.animate;
    return mixer;
  }
  async loadMouseGLTF(table_top, monitorParent) {
    globalState.loading = true;
    this.updateSpinner();
    globalState.pauseRender = true;
    if (
      table_top.parent.parent &&
      table_top.parent.parent.name == 'Table1_Selectable'
    ) {
      let modelURL = assets.Laptop[2].URL;
      const { gltfData } = await gltfLoad(modelURL);
      const loadedmodel = gltfData.scene;
      // shadowEnabler(loadedmodel);

      monitorParent.add(loadedmodel);
      loadedmodel.position.set(-0.3, -0.9, -0.15);
      table_top.add(monitorParent);
    }
    globalState.pauseRender = false;
    this.animate();
  }
  async loadTableVaseGLTF(table_top, selectableObjects, tableVaseParent) {
    globalState.loading = true;
    this.updateSpinner();
    globalState.pauseRender = true;
    localStorage.tableChildren = 'Added';
    if (
      table_top.parent.parent &&
      table_top.parent.parent.name == 'Table1_Selectable'
    ) {
      let modelURL = assets.Vase[0].URL;
      const { gltfData } = await gltfLoad(modelURL);
      const loadedmodel = gltfData.scene;
      // shadowEnabler(loadedmodel);

      tableVaseParent.add(loadedmodel);
      selectableObjects.push(tableVaseParent);
      loadedmodel.position.set(-0.3, -0.9, 0);
      table_top.add(tableVaseParent);
    }
    globalState.pauseRender = false;
    this.animate();
  }
  //LoadMirror
  async loadMirrorGLTF() {    
    globalState.loading = true;
    this.updateSpinner();
    globalState.pauseRender = true;
    let modelURL = assets.Mirror[0].URL;

    const { gltfData } = await gltfLoad(modelURL);
    const loadedmodel = gltfData.scene;
    const mirror = loadedmodel;
    mirrorParent.add(mirror);
    scene.add(mirrorParent);
    selectableObjects.push(mirrorParent);

    globalState.pauseRender = false;
    this.animate();    
  }
 /*  async loadFanGLTF() {    
    globalState.loading = true;
    this.updateSpinner();
    globalState.pauseRender = true;
    let modelURL = assets.Accessories[3].URL;

    const { gltfData } = await gltfLoad(modelURL);
    const loadedmodel = gltfData.scene;    
    fanParent.add(loadedmodel);
    scene.add(fanParent);
    selectableObjects.push(fanParent);
    fanLight = loadedmodel.getObjectByName('fanLight');
    this.fanLight=fanLight
    // this.fanLight.castShadow=true
      PubSub.publish(AddLightToken, {
       name: 'Ceiling Light',
       type: this.fanLight.type,
       object: this.fanLight,
       intensity: this.fanLight.intensity,
       minIntensity: 0,
       maxIntensity: 15,
       color: this.fanLight.color,
       active: false,
     }); 

    globalState.pauseRender = false;
    this.animate();    
  } */
  async loadAccessoriesGLTF() {
    globalState.loading = true;
    this.updateSpinner();
    globalState.pauseRender = true;
    
    let modelURL = assets.Accessories[0].URL;
    const { gltfData } = await gltfLoad(modelURL);
    const loadedmodel = gltfData.scene;
    framesParent.add(loadedmodel);
    scene.add(framesParent);
    selectableObjects.push(framesParent);
    
    globalState.pauseRender = false;
    this.animate();
    viewPoints(camera, scene, framesParent);
  }
  async loadVaseGLTF() {
    globalState.loading = true;
    this.updateSpinner();
    globalState.pauseRender = true;
    // let modelURL = await fetch(assets.Accessories[2].URL);
    let modelURL = assets.Accessories[2].URL;

    const { gltfData } = await gltfLoad(modelURL);
    const loadedmodel = gltfData.scene;
    vaseFloorParent.add(loadedmodel);
    scene.add(vaseFloorParent);
    selectableObjects.push(vaseFloorParent);

    let table_top = scene.getObjectByName('Table_Top_Mesh');
    await this.loadTableVaseGLTF(table_top, selectableObjects, tableVaseParent);
    mixer = await this.loadMonitor(table_top, selectableObjects, monitorParent);
    await this.loadKeyboardGLTF(table_top, monitorParent);
    await this.loadMouseGLTF(table_top, monitorParent);
    globalState.pauseRender = false;
    this.animate();
    // console.log('vase drawcalls', renderer.info.render.calls);
  }
  async loadLoungChairGLTF() {
    globalState.loading = true;
    globalState.pauseRender = true;
    tableModels.parentGroup.position.set(-0.7, 0, 0.5);
    chairModels.parentGroup.position.set(-0.7, 0, -0.5);
    await loungeChairModels.loadModel();
    selectableObjects.push(loungChairParent);
    globalState.pauseRender = false;
    this.animate();
  }
  //CreatePostProcess Effects
  createPostProcess() {
    const renderPass = new RenderPass(scene, camera);  
    composer.addPass(renderPass);
    let taaRenderPass;
    function TAA_Fun() {
      taaRenderPass = new TAARenderPass(scene, camera);
      taaRenderPass.sampleLevel = 1;
      composer.addPass(taaRenderPass);
    }
    function TAA_else_Fun() {
      taaRenderPass.sampleLevel = 0;
      composer.removePass(taaRenderPass);
    }
    let TAA_C = document.getElementById('TAA_C');
    TAA_C.addEventListener('click', function (e) {
      if (e.target.checked) {
        TAA_Fun();
      } else {
        TAA_else_Fun();
      }
    });
    let intial_Loading_Val = 0;
    let FXAA_C = document.getElementById('FXAA_C');
    function FXAA_Fun() {
      effectFXAA = new ShaderPass(FXAAShader);
      effectFXAA.uniforms['resolution'].value.set(
        1 / window.innerWidth,
        1 / window.innerHeight
      );
      composer.addPass(effectFXAA);
      if (intial_Loading_Val == 0) {
        prompt.style.display = 'block';
        intial_Loading_Val += 1;
      }
    }
    function FXAA_else_Fun() {
      composer.removePass(effectFXAA);
    }
    // FXAA_Fun();
    FXAA_C.addEventListener('click', function (e) {
      if (e.target.checked) {
        FXAA_Fun();
      } else {
        FXAA_else_Fun();
      }
    });
    let ssaaRenderPass;
    let SSAA_C = document.getElementById('SSAA_C');

    function SSAA_Fun() {
      ssaaRenderPass = new SSAARenderPass(scene, camera);
      composer.addPass(ssaaRenderPass);
    }
    function SSAA_Else_Fun() {
      composer.removePass(ssaaRenderPass);
    }
    SSAA_C.addEventListener('click', function (e) {
      if (e.target.checked) {
        SSAA_Fun();
      } else {
        SSAA_Else_Fun();
      }
    });
    let SMAApass;
    let SMAA_C = document.getElementById('SMAA_C');
    function SMAA_Fun() {
      SMAApass = new SMAAPass(
        window.innerWidth * 0.1 * renderer.getPixelRatio(),
        window.innerHeight * 0.1 * renderer.getPixelRatio()
      );
      composer.addPass(SMAApass);
    }
    function SMAA_Else_Fun() {
      composer.removePass(SMAApass);
    }
    SMAA_C.addEventListener('click', function (e) {
      if (e.target.checked) {
        SMAA_Fun();
      } else {
        SMAA_Else_Fun();
      }
    });
    let ssaoPass;
    let SSAO_C = document.getElementById('SSAO_C');
    function Ambient_Occlusion_Fun() {
      const width = container.clientWidth;
      const height = container.clientHeight;
      ssaoPass = new SSAOPass(scene, camera, width, height);
      composer.addPass(ssaoPass);
    }
    function Ambient_Occlusion_Else_Fun() {
      composer.removePass(ssaoPass);
    }
    SSAO_C.addEventListener('click', function (e) {
      if (e.target.checked) {
        Ambient_Occlusion_Fun();
      } else {
        Ambient_Occlusion_Else_Fun();
      }
    });

    let saoPass;
    let SAO_C = document.getElementById('SAO_C');
    function Ambient_Occlusion_sao_Fun() {
      saoPass = new SAOPass(scene, camera, false, true);
      composer.addPass(saoPass);
    }
    function Ambient_Occlusion_sao_Else_Fun() {
      composer.removePass(saoPass);
    }

    SAO_C.addEventListener('click', function (e) {
      if (e.target.checked) {
        Ambient_Occlusion_sao_Fun();
      } else {
        Ambient_Occlusion_sao_Else_Fun();
      }
    });

    let groundReflector, ssrPass, geometry, selects;
    let ssr_ui = document.getElementById('ssr_ui');
    function SSR_fun() {
      start = Date.now();
      millis = Date.now() - start;
      console.log('SSR loading Start time = ', millis, 'ms');
      const params = {
        enableSSR: true,
        groundReflector: true,
      };

      geometry = new THREE.PlaneGeometry(3.88, 3.88);

      groundReflector = new ReflectorForSSRPass(geometry, {
        clipBias: 0.0003,
        textureWidth: window.innerWidth * 0.1,
        textureHeight: window.innerHeight * 0.1,
        color: 0x888888,
        // useDepthTexture: true,
      });
      // groundReflector.material.depthWrite = false;
      groundReflector.rotation.x = -Math.PI / 2;
      groundReflector.position.y = -0.01;
      groundReflector.position.z = 0.43;
      groundReflector.position.x = 0.08;

      // groundReflector.visible = true;
      let Floor = scene.getObjectByName('Floor');
      Floor.material.opacity = 0.5;
      Floor.material.transparent = true;

      ssrPass = new SSRPass({
        renderer,
        scene,
        camera,
        width: innerWidth * 0.1,
        height: innerHeight * 0.1,
        groundReflector: params.groundReflector ? groundReflector : null,
        selects: params.groundReflector ? selects : null,
      });

      if (gui) gui.destroy();
      gui = new GUI();
      gui.add(params, 'enableSSR').name('Enable SSR');
      gui.add(params, 'groundReflector').onChange(() => {
        if (params.groundReflector) {
          (ssrPass.groundReflector = groundReflector),
            (ssrPass.selects = selects);
        } else {
          (ssrPass.groundReflector = null), (ssrPass.selects = null);
        }
      });
      // ssrPass.thickness = 0.018;
      gui.add(ssrPass, 'thickness').min(0).max(0.1).step(0.0001);
      // ssrPass.infiniteThick = false;
      gui.add(ssrPass, 'infiniteThick');

      const folder = gui.addFolder('more settings');
      folder.add(ssrPass, 'fresnel').onChange(() => {
        groundReflector.fresnel = ssrPass.fresnel;
      });
      folder.add(ssrPass, 'distanceAttenuation').onChange(() => {
        groundReflector.distanceAttenuation = ssrPass.distanceAttenuation;
      });
      // ssrPass.maxDistance = .1;
      // groundReflector.maxDistance = ssrPass.maxDistance;
      folder
        .add(ssrPass, 'maxDistance')
        .min(0)
        .max(0.5)
        .step(0.001)
        .onChange(() => {
          groundReflector.maxDistance = ssrPass.maxDistance;
        });
      folder.add(ssrPass, 'bouncing');
      folder
        .add(ssrPass, 'output', {
          Default: SSRPass.OUTPUT.Default,
          'SSR Only': SSRPass.OUTPUT.SSR,
          Beauty: SSRPass.OUTPUT.Beauty,
          Depth: SSRPass.OUTPUT.Depth,
          Normal: SSRPass.OUTPUT.Normal,
          Metalness: SSRPass.OUTPUT.Metalness,
        })
        .onChange(function (value) {
          ssrPass.output = parseInt(value);
        });
      // ssrPass.opacity = 0.5;
      // groundReflector.opacity = ssrPass.opacity;
      folder
        .add(ssrPass, 'opacity')
        .min(0)
        .max(1)
        .onChange(() => {
          groundReflector.opacity = ssrPass.opacity;
        });
      folder.add(ssrPass, 'blur');
      // folder.open()
      // gui.close()
      composer.addPass(ssrPass);
      scene.add(groundReflector);

      millis = Date.now() - start;
      console.log('SSR loading End time = ', millis, 'ms');
    }
    // SSR_fun()
    ssr_ui.addEventListener('click', function (e) {
      if (e.target.checked) {
        SSR_fun();
      } else {
        composer.removePass(ssrPass);
        if (gui) gui.hide();
      }
    });
    gui_ui.addEventListener('click', function (e) {
      if (e.target.checked) {
        if (gui) gui.show();
      } else {
        if (gui) gui.hide();
      }
    });

    //GammaCorrectionShader for the Colour fixing
    const copyPass2 = new ShaderPass(GammaCorrectionShader);
    composer.addPass(copyPass2);

    outlinePass = new OutlinePass(
      new Vector3(UIContainer.innerWidth, UIContainer.innerHeight),
      scene,
      camera
    );

    composer.addPass(outlinePass);    
    exportScene(scene);
  }
  SwitchModes() {
    let sideUI_BG_Active = document.querySelectorAll('.sideUI_BG_Active');
    let measurementsUI_Desktop = document.getElementById('measurements_Desktop');
    let measurements = document.querySelector('.Measurements');
    let drag_M,      
      drag_select,
      menu = document.getElementById('contextMenu');
    var rect = renderer.domElement.getBoundingClientRect();
    let helper;
    let intersectObjs
    /* function render(event) {                 
      // event.object.position.y = 0;
      setTimeout(() => {                                     
            helper = new THREE.BoxHelper(selectedObjects[0], 0xff0000);
            scene.add(helper);                     
             composer.render();
      }, 1000 / 60);   
      scene.traverse(function (node) {
        if (node.type == 'BoxHelper') {
          node.visible = false;                    
        }
      });      
    }   
    controls = new DragControls([...selectableObjects],camera,renderer.domElement);           
    controls.addEventListener( 'dragend', function ( event ) {                
      scene.traverse(function (node) {
        if (node.type == 'BoxHelper') {
          node.visible = false;          
          // scene.remove(node)
        }
      });          
    } );
    controls.transformGroup = true;
    controls.addEventListener('drag', render);
    const draggableObjects = controls.getObjects();
    draggableObjects.length=0 */
    function enableCamera() {
      cameraControls.enabled = true;
    }
    function disableCamera() {
      cameraControls.enabled = false;
    }
    async function disableMeasurements() {
      measurementsUI_Desktop.checked = false;

      if (cameraControls.enabled == false) {
        showCurrentMode.innerHTML = 'Arrangement Mode';        
      } else {
        showCurrentMode.innerHTML = 'Camera Mode';
      }
      renderer.domElement.removeEventListener(
        'pointerdown',
        Measurements_select
      );
      camera.layers.disable(1);
      measurements.style.backgroundColor = '#e5e5e5';
      measurements.style.color = '#000000';
      container.removeChild(labelRenderer.domElement);
      scene.remove(measurementLabels[lineId]);      
    }
    async function disableArrangement() { 
      raycaster.layers.set(1); 
      renderer.domElement.classList.remove("cursorMove")
      selectedObjects = [];               
      outlinePass.selectedObjects = [];            
      transformControl.detach();
      // draggableObjects.length = 0;    
      if (measurementsUI_Desktop.checked == false) {
        enableCamera()
        showCurrentMode.innerHTML = 'Camera Mode';
      } 
      sideUI_BG_Active[0].style.backgroundColor = '#F5F5F5';
      sideUI_BG_Active[0].classList.remove('changeColor');            

      renderer.domElement.removeEventListener('click', enableArrangement);
      renderer.domElement.removeEventListener('pointerdown', selectEvent);
      tranform_Desktop[0].checked = false;            
    }
    //Measurement related functions
    measurementsUI_Desktop.addEventListener('change', ToggleMeasurements);
    async function ToggleMeasurements(event) {
      if (event.target.checked) {
        mode_type = 'measurements';
        disableCamera();
        await disableArrangement();
        enableMeasurements();        
      } else {
        await disableMeasurements();
        enableArrangement();
      }
    }
    function enableMeasurements() {
      measurements.style.backgroundColor = '#ff5a50';
      measurements.style.color = '#ffffff';
      showCurrentMode.innerHTML = 'Measurements Mode';
      renderer.domElement.addEventListener('pointerdown', Measurements_select);
      camera.layers.enable(1);
      container.appendChild(labelRenderer.domElement);
      if (measurementLabels.length != 0) {
        scene.add(measurementLabels[lineId]);
      }
    }
    function Measurements_select(event) {
      drag_M = false;      
      renderer.domElement.addEventListener(
        'pointermove',
        () => (drag_M = true)
      );
      renderer.domElement.addEventListener('pointerup', startSelectingM);
    }
    function startSelectingM(event) {
      if (!drag_M) {
        PointerMoveMeasurements(event);
        drag_M = false;
      }
    }
    function PointerMoveMeasurements(event) {
      mouse.x = (event.clientX / UIContainer.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / UIContainer.clientHeight) * 2 + 1;
      checkIntersectionMeasurements();
    }
    let matLine = new LineMaterial({
      color: 0x000000,
      linewidth: 0.005, // in world units with size attenuation, pixels otherwise
      //resolution:  // to be set by renderer, eventually
      dashed: false,
      // alphaToCoverage: false,
    });
    let points = [],
      geo2,
      lin2,
      pointsArray = [];
    let sphereGeo = new SphereGeometry(0.05, 16, 16);
    let sphereMat = new MeshStandardMaterial({
      color: 0x000000,
      emissive: 0x000000,
    });
    let sphereMesh = new Mesh(sphereGeo, sphereMat);
    let sphereMeshClone;
    function checkIntersectionMeasurements() {
      raycaster.setFromCamera(mouse, camera);
      raycaster.params.Line.threshold = 0;
      raycaster.layers.set(0);
      const intersects = raycaster.intersectObject(scene, true);
      if (intersects.length > 0) {
        points.push(intersects[0].point);    
        
        console.log("measurements mode")        

        sphereMeshClone = sphereMesh.clone();
        sphereMeshClone.layers.set(1);

        sphereMeshClone.position.copy(intersects[0].point);
        scene.add(sphereMeshClone);

        if (points.length == 2) {
          pointsArray.push(points[0].x);
          pointsArray.push(points[0].y);
          pointsArray.push(points[0].z);
          pointsArray.push(points[1].x);
          pointsArray.push(points[1].y);
          pointsArray.push(points[1].z);

          geo2 = new LineGeometry().setPositions(pointsArray);
          lin2 = new Line2(geo2, matLine);
          lin2.layers.set(1);
          scene.add(lin2);

          measurementDiv = document.createElement('div');
          measurementDiv.style.fontSize = '24px';
          measurementDiv.style.fontWeight = 'bold';
          const measurementLabel = new CSS2DObject(measurementDiv);
          measurementLabels[lineId] = measurementLabel;
          scene.add(measurementLabels[lineId]);

          const v0 = new Vector3(
            pointsArray[0],
            pointsArray[1],
            pointsArray[2]
          );
          const v1 = new Vector3(
            pointsArray[3],
            pointsArray[4],
            pointsArray[5]
          );

          const distance = v0.distanceTo(v1);
          measurementLabels[lineId].element.innerText =
            distance.toFixed(2) + 'm';
          measurementLabels[lineId].position.lerpVectors(v0, v1, 0.5);

          points = [];
          pointsArray = [];
          
        }
      }
    }  
    //Arrangement related functions   
    function selectToolToggle(event) {
      showCurrentMode.innerHTML = 'Arrangement Mode';      
      if (event.target.checked) {
        mode_type = 'arrangement';
        disableCamera();
        if (measurementsUI_Desktop.checked == true) {
           disableMeasurements();
        }
        enableArrangement();       
      } else {
        renderer.domElement.removeEventListener(
          'pointerdown',
          selectEvent,
          false
        );
        renderer.domElement.removeEventListener('click', enableArrangement);
        renderer.domElement.removeEventListener('pointerdown', selectEvent);
        outlinePass.selectedObjects = [];
        selectedObjects = [];
        transformControl.detach();
      }
    }
    function selectEvent(event) {
      var rightclick;

      if (!event) var event = window.event;
      if (event.which) rightclick = event.which == 3;
      else if (event.button) rightclick = event.button == 2;
      if (!rightclick) {        
        raycaster.layers.set(0);
        drag_select = false;
        renderer.domElement.addEventListener('pointermove', () => {
          drag_select = true;
        });
        renderer.domElement.addEventListener('pointerup', startSelecting);
        function startSelecting() {
          if (!drag_select) {
            onPointerMove(event);
          }
          drag_select = false;
        }
        menu.style.display = 'none'; 
      } else {                
        document.addEventListener(
          'contextmenu',
          function (e) {
            e.preventDefault();
          },
          false
        ); 
        if (selectedObjects[0] != undefined) {
          menu.style.left = event.clientX - rect.left + 'px';
          menu.style.top = event.clientY - rect.top + 'px';
          menu.style.display = 'block'; 
        }
      }
    }
    function onPointerMove(event) {
      mouse.x = (event.clientX / UIContainer.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / UIContainer.clientHeight) * 2 + 1;
      checkIntersection();
    }
    async function addSelectedObject(object) {
      selectedObjects = [];
      selectedObjects.push(object);
    }
    
    async function checkIntersection() {      
      renderer.setRenderTarget(null);
      raycaster.setFromCamera(mouse, camera);
      intersectObjs = raycaster.intersectObjects(selectableObjects, true);
      
      if (intersectObjs.length > 0) {
        let i = intersectObjs[0].object;        
        while (i.name !== 'selectable') {
          i = i.parent;
          if (i.name === 'selectable') {
            if (i.children[0].children[0].name == 'Back_Wall') {                  
              renderer.domElement.classList.remove("cursorMove")  
              enableCamera()                      
              outlinePass.selectedObjects = [];
              selectedObjects = [];
              transformControl.detach();
              // draggableObjects.length = 0;   
              scene.traverse(function (node) {
                if (node.type == 'BoxHelper') {
                  node.visible = false;
                }
              });                           
              showCurrentMode.innerHTML = 'Camera Mode';
            } else {
              if(measurementsUI_Desktop.checked==false){                           
                renderer.domElement.classList.add("cursorMove")      
                addSelectedObject(i);                
                cameraControls.enabled = false;
                showCurrentMode.innerHTML = 'Arrangement Mode';                            
                /* draggableObjects.length = 0;
                draggableObjects.push(selectedObjects[0]); */
                outlinePass.selectedObjects = selectedObjects;
                outlinePass.edgeStrength = Number(10);
                outlinePass.edgeThickness = Number(0.1);
                outlinePass.visibleEdgeColor.set('#EF120A');
                outlinePass.hiddenEdgeColor.set('#EF120A');
              }
            }
          }
        }
      }else{
        renderer.domElement.classList.remove("cursorPointer")
      }      
    }    
    let draggableModel
     renderer.domElement.addEventListener('mousemove', (event) => {
      dragModel(); 
       mouse.x = (event.clientX / UIContainer.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / UIContainer.clientHeight) * 2 + 1; 
    });
     function dragModel() {      
      if (draggableModel) {
        raycaster.setFromCamera(mouse, camera);
        const found = raycaster.intersectObjects(selectableObjects);
        if (found.length > 0) {
          for (let obj3d of found) {
            if (!obj3d.object.isDraggablee) {
              draggableModel.children[0].children[0].position.x = obj3d.point.x;
              draggableModel.children[0].children[0].position.z = obj3d.point.z;              
              break;
            }
          }
        }
      }
    }   
    tranform_Desktop[0].addEventListener('change', selectToolToggle);
    transformControl = new TransformControls(camera, renderer.domElement);    
    setTransformControlLayer(2);
    function setTransformControlLayer(layer) {
      transformControl.traverse((object) => object.layers.set(layer));
      transformControl.getRaycaster().layers.set(layer);
    }
    renderer.domElement.addEventListener('click', enableArrangement);
    renderer.domElement.addEventListener('pointerdown', selectEvent);
    function enableArrangement() {
      
      if (draggableModel) {
        draggableModel = undefined;        
      }else{
        draggableModel=selectedObjects[0]
      }


      renderer.domElement.addEventListener('pointerdown', selectEvent);
      for (let i = 0; i < 6; i++) {
        if (i == 0) {
          sideUI_BG_Active[i].style.backgroundColor = '#FFF';
          sideUI_BG_Active[i].classList.add('changeColor');
        } else {
          sideUI_BG_Active[i].style.backgroundColor = '#F5F5F5';
          sideUI_BG_Active[i].classList.remove('changeColor');
        }
      }      
      tranform_Desktop[2].addEventListener('click', MoveFun);
      tranform_Desktop[3].addEventListener('click', allowUncheck);
      tranform_Desktop[4].addEventListener('click', allowUncheck);
      tranform_Desktop[6].addEventListener('click', allowUncheck);

      function MoveFun() {
        for (let i = 0; i < 6; i++) {
          if (i == 2) {
            sideUI_BG_Active[i].style.backgroundColor = '#FFF';
            sideUI_BG_Active[i].classList.add('changeColor');
          } else {
            sideUI_BG_Active[i].style.backgroundColor = '#F5F5F5';
            sideUI_BG_Active[i].classList.remove('changeColor');
          }
        }
      /*   if (controls.enabled == false) {
          controls.enabled = true;
          controls.activate();
        } */
      }

      function allowUncheck(e) {
        transformControl.setMode(e.target.value);
        raycaster.layers.set(0);
        transformControl.enabled = true;
        scene.add(transformControl);
        if (selectedObjects.length != 0) {                                                         
              if( selectedObjects[0].children[0].children[0].name.slice(0,5) =='Frame'){              
              box.setFromObject(selectedObjects[0]); 
              let boxCenter = new Vector3();
              box.getCenter(boxCenter);
              transformControl.position.copy(boxCenter); 
            }                                                      
            transformControl.attach(selectedObjects[0].children[0].children[0]);                          
        }
        // draggableObjects.length=0  
        renderer.domElement.classList.remove("curosorMove")         
        document
          .querySelectorAll(`input[type=radio][name=${this.name}]`)
          .forEach((elem) => {
            elem.previous = elem.checked;
          });
           
        if (e.target.value == 'rotate') {   
                                                        
          globalState.pauseRender=true   
if (draggableModel) {
        draggableModel = undefined;        
      }     
          transformControl.showX = false;
          transformControl.showY = true;
          transformControl.showZ = false;
          if (menu.style.display != 'none') {
            menu.style.display = 'none';
          } else {
            for (let i = 0; i < 6; i++) {
              if (i == 3) {
                sideUI_BG_Active[i].style.backgroundColor = '#FFF';
                sideUI_BG_Active[i].classList.add('changeColor');
              } else {
                sideUI_BG_Active[i].style.backgroundColor = '#F5F5F5';
                sideUI_BG_Active[i].classList.remove('changeColor');
              }
            }
          }
          globalState.pauseRender=false   
        }
        if (e.target.value == 'scale') {
          globalState.pauseRender=true  
          if (draggableModel) {
        draggableModel = undefined;        
      }        
          for (let i = 0; i < 6; i++) {
            if (i == 4) {
              sideUI_BG_Active[i].style.backgroundColor = '#FFF';
              sideUI_BG_Active[i].classList.add('changeColor');
            } else {
              sideUI_BG_Active[i].style.backgroundColor = '#F5F5F5';
              sideUI_BG_Active[i].classList.remove('changeColor');
            }
          }
          transformControl.showX = true;
          transformControl.showZ = true;
          transformControl.showY = true;
          globalState.pauseRender=false
        }
      }      
      tranform_Desktop[1].addEventListener('click', (e) => {
        if (e.target.value == 'Unselect') {          
          disableArrangement()
          for (let i = 0; i < 6; i++) {
            if (i == 1) {
              sideUI_BG_Active[i].style.backgroundColor = '#FFF';
              sideUI_BG_Active[i].classList.add('changeColor');
            } else {
              sideUI_BG_Active[i].style.backgroundColor = '#F5F5F5';
              sideUI_BG_Active[i].classList.remove('changeColor');
            }
          }
        }
      });
     
      function del_Fun() {
        if (selectedObjects[0] != undefined) {          
          if (selectedObjects[0].children[0].children[0].name == 'Frames') {
            localStorage.framesValue = false;
          }          
          // selectedObjects[0].visible = false;          
          scene.remove(selectedObjects[0]); 
          // selectableObjects.pop(selectedObjects[0])            
          // intersectObjs = raycaster.intersectObjects(selectableObjects, true);                              
        } else {
          console.log('select an object to delete');
        }
        transformControl.detach();
        if (menu.style.display != 'none') {
          menu.style.display = 'none';
        }        
      }

      tranform_Desktop[5].addEventListener('click', (e) => {
        if (e.target.checked) {
          del_Fun();
          for (let i = 0; i < 6; i++) {
            if (i == 5) {
              sideUI_BG_Active[i].classList.add('changeColor');
              sideUI_BG_Active[i].style.backgroundColor = '#FFF';
            } else {
              sideUI_BG_Active[i].style.backgroundColor = '#F5F5F5';
              sideUI_BG_Active[i].classList.remove('changeColor');
            }
          }
        }
      });
      tranform_Desktop[7].addEventListener('click', (e) => {
        if (e.target.value == 'Unselect') {
          if (menu.style.display != 'none') {
            menu.style.display = 'none';
          }
          selectedObjects = [];
          outlinePass.selectedObjects = [];                  
          transformControl.detach();  
    }
  });
      tranform_Desktop[8].addEventListener('click', del_Fun);
    }
  }

  updateSpinner() {
    if (globalState.loading) Spinner.style.display = 'block';
    else Spinner.style.display = 'none';
    this.loadingState = globalState.loading;
  }
  animate() {
    cameraControls.update();
    composer.render();
    // renderer.info.reset();

    const delta = clock.getDelta();

    if (
      chairModels.currentAnimationMixer &&
      globalState.activeAnimation === 'chairs'
    ) {
      // console.log('chairAnimaiont');
      chairModels.currentAnimationMixer.update(delta);
    }

    if (
      blindsModels.currentAnimationMixer &&
      globalState.activeAnimation === 'windowBlinds'
    ) {
      // console.log('blinds animation');
      blindsModels.currentAnimationMixer.update(delta);
    }
    if (
      (globalState.activeAnimation === 'table') |
      (globalState.activeAnimation === 'viewPoints')
    ) {
      // console.log('here');
      TWEEN.update();
    }
    TWEEN.update();    
    labelRenderer.render(scene, camera);
    // this.stats.update(renderer);
    if (mixer) {
      mixer.update(delta);
    }
    // debug.update(renderer);
    if (
      localStorage.tableV == 1 &&
      localStorage.tableValue == 'Table1_Selectable' &&
      localStorage.tableChildren == 'Added'
    ) {
      let table_top = scene.getObjectByName('Table_Top_Mesh');
      localStorage.tableV = 2;
      this.loadTableVaseGLTF(table_top, selectableObjects, tableVaseParent);
      mixer = this.loadMonitor(table_top, selectableObjects, monitorParent);
      this.loadKeyboardGLTF(table_top, monitorParent);
      this.loadMouseGLTF(table_top, monitorParent);
    }
    setTimeout(() => {
      if (globalState.pauseRender) {
        return;
      }
      // console.log(composer);
      globalState.loading = false;
      this.updateSpinner();
      if(this.nextFrame){
        this.nextFrame();
        this.nextFrame=null;
      }
      requestAnimationFrame(() => {
        this.animate();

        // console.log('inside animation loop', globalState.pauseRender);
      });
    }, 1000 / 60);
  }

  start() {
    globalState.updateSpinner=this.updateSpinner
    this.animate();
  }
}

export { World };