import { furnitureTypesUI } from "../../systems/UI-Generators/furnitureTypesUI";
import { gltfLoad } from "../gltf_loader/gltfLoad.js";
import { animationUI } from "../../systems/UI-Generators/animationUI";
import { AnimationMixer, Group } from "three";
import { shadowEnabler } from "../../systems/shadowEnabler";
import globalState from "../../store/globalState.js";
class FurnitureContainer {
  constructor(assetsList, furnitureTypesUI, category, initialModelID,scene,renderer,selectableObjects,subMaterial,Spinner) {
    this.assetsList = assetsList;
    this.parentGroup = new Group();
    this.parentGroup.name = "selectable";
    this.models = [];
    this.furnitureTypesUI = furnitureTypesUI;
    this.model;
    this.category = category;
    this.initialModelID = initialModelID;  
    this.scene=scene;  
    this.renderer=renderer;     
    this.selectableObjects=selectableObjects   
    this.subMaterial=subMaterial
    //AnimationsUIs to store the Animation UI created after loading a GLTF Model
    this.AnimationUIs = [];
    //AnimationMixers to store animationMixer for each GLTF model loaded
    this.animationMixers = [];    
   
     /*  this.toastbody = document
      .getElementById(`${this.furnitureTypesUI.id}_AnimationsUI`)
      .getElementsByClassName("animationsUI")[0]; */
      this.toastbody = document.getElementById("animationsUI")
     this.data=[]
     this.Spinner=Spinner
    
    this.currentAnimationMixer;

  }  
  async loadModel(URL, i) {        

    this.Spinner.style.display="block"  
    this.toastbody.replaceChildren();
    
    //Load a Default Model with "initialModelID"
    URL ||= this.assetsList[this.initialModelID].URL;

    i ||= this.initialModelID;
    
    if (this.models[i] === undefined) {                     
      // let modelURL = await fetch(URL); 
      const { gltfData } = await gltfLoad(URL);       
      this.data=[]
      this.data.push(gltfData)            
      let loadedModel = gltfData.scene; 
      if(gltfData.userData.gltfExtensions){
      localStorage.measurements= gltfData.userData.gltfExtensions.KHR_xmp_json_ld.packets[0].measurements      
      }                 
      shadowEnabler(loadedModel)        
      this.models[i] = loadedModel;

      let mixer = new AnimationMixer(this.models[i]);
      this.AnimationUIs[i] = animationUI(
        gltfData,
        mixer,
        this.category,
        URL,
        this.scene,
        this.renderer        
        );
      this.animationMixers[i] = mixer;                      
    }    
    if (this.model) {
      this.parentGroup.remove(this.model);
    }

    this.currentAnimationMixer = this.animationMixers[i];
    
    this.toastbody.appendChild(this.AnimationUIs[i]);
   
    this.model = this.models[i];
    this.parentGroup.add(this.model);    
    this.scene.add(this.parentGroup)       
    if(this.model.children[0].name.slice(0,11)!="WindowBlind"){
    this.selectableObjects.push(this.parentGroup)   
    }
    this.Spinner.style.display="none"    
        return this.data   
  } 

  createUI() {
    //Creates FurnitureTypes UI
    furnitureTypesUI(
      this.assetsList,
      this.furnitureTypesUI,
      this.category,
      this.loadModel.bind(this),
      this.initialModelID,  
      this.scene, 
      this.renderer,
      this.subMaterial,
      this.Spinner                 
    );    
  }
}

export { FurnitureContainer };
