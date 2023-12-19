import { threeSixtySpin } from '../../../threeSixtySpin/threesixty1';
import { threeSixtySpinTable } from '../../../threeSixtySpin/threesixty2';
import globalState from '../../store/globalState';
import {
  AddLightToken,
  UpdateLightActive,
  UpdateLightObject,
} from '../../utils/pubsubTokens';
import PubSub from 'pubsub-js';
let light_val = 0,intial_load=0;
localStorage.lastInput=""
const furnitureTypesUI = function (
  assetsList,
  UIContainer,
  category,
  loadModel,
  initialModelID,
  scene,
  renderer,
  subMaterial,
  Spinner
) {
  for (let i = 0; i < assetsList.length; i++) {
    let input = document.createElement('input');

    if (initialModelID == i) {
      input.checked = true;
    }
    let data;
    input.type = 'radio';
    input.value = assetsList[i].URL;
    input.className = 'btn-check';
    input.name = category;
    input.id = assetsList[i].Name;
    input.autocomplete = 'off';

    let measurements_Label = document.querySelectorAll(
      '.measurements_Label_SideUI'
    );
    let measurements_SideUI_Container = document.getElementById(
      'MeasurementsUIParent'
    );
    let measurements_Label_len = measurements_Label.length;
    let animationsUIContainer = document.getElementById('animationsUIParent');
    let measurements_Types = document.getElementById('measurements_Types');
    let furnitureName,
      spin_description      
    let variant = 1;

    
         
    input.addEventListener('click', function (event) {   
       Spinner.style.display = 'block';      
       globalState.loading = true;
       globalState.updateSpinner();
       globalState.pauseRender = true;
      
      
      if(localStorage.lastInput!=assetsList[i].spin_value ){     
      localStorage.lastInput=assetsList[i].spin_value
      let myPromise = new Promise(async function (resolve) {
        data =await loadModel(event.target.value, i);
        resolve(data);
      });
      myPromise.then(function (value) {        
        localStorage.tableValue="Table1_Selectable"
                
         if(value[0].scene.children[0].name=="Table1_Selectable" && localStorage.tableChildren=="Added"){
          localStorage.tableV=1    
        } 

        //360Spin        
        furnitureName = assetsList[i].spin_value;
        spin_description = assetsList[i].spin_description;
        localStorage.spin_description = spin_description;
        localStorage.furnitureName = furnitureName;
        localStorage.variant = variant;

        if (furnitureName.slice(0, 5) != 'Table') {
          threeSixtySpin(furnitureName, variant, spin_description);
        } else {
          threeSixtySpinTable(furnitureName, variant, spin_description);
          const lightArr = [];
          let tableLamp = scene.getObjectByName('Desktop_Lamp_Light002');
          lightArr.push(tableLamp)
          
          let LampTop
          //SSS
          if(furnitureName.slice(0, 6)== 'Table1'){          
           LampTop = scene.getObjectByName("TableStand001")
        }else{
          LampTop = scene.getObjectByName("TableStand006")
        }
        if(LampTop){
          LampTop.material = subMaterial;
        }
        //SSS
          const modelName = assetsList[i].light_Name;
          let light = lightArr[lightArr.length - 1];

          //Light Controls using pubsub
          if (light_val == 0 && LampTop) {                        
            PubSub.publish(AddLightToken, {
              name: modelName,
              type: light.type,
              object: light,
              intensity: 5,
              minIntensity: 0,
              maxIntensity: 5,
              color: light.color,
              active: true,
            });
            light_val += 1;
          }

          if (light && light.name == 'Desktop_Lamp_Light002') {
            PubSub.publish(UpdateLightObject, {
              name: 'Table Lamp',
              object: light,
            });
            PubSub.publish(UpdateLightActive, {
              name: 'Table Lamp',
              value: true,
            });
          }
        }
        //default inch values
        let measurement_Values
        if(localStorage.measurements){
         measurement_Values = localStorage.measurements.split(',');
        }
        for (let j = 0; j < measurements_Label_len; j++) {
           measurements_Label[j].innerHTML = measurement_Values[j];
        }
        //update measurement on changing type
         measurements_Types.addEventListener('change', function () {
          for (let j = 0; j < measurements_Label_len; j++) {
            let measurements_value = measurement_Values[j];
            if (measurements_Types.value == 'inch') {
              measurements_Label[j].innerHTML = measurements_value;
            } else if (measurements_Types.value == 'cm') {
              measurements_Label[j].innerHTML = (
                measurements_value * 2.54
              ).toFixed(0);
            } else if (measurements_Types.value == 'meter') {
              measurements_Label[j].innerHTML = (
                measurements_value * 0.0254
              ).toFixed(1);
            } else {
              measurements_Label[j].innerHTML = (
                measurements_value * 0.08333333
              ).toFixed(1);
            }
          }
        }); 
        measurements_SideUI_Container.style.display = 'block';
        animationsUIContainer.style.display = 'block';

        globalState.pauseRender = false;
        globalState.worldInstance.animate();
        Spinner.style.display = 'none';
      });
    }else{
      console.log("THIS MODEL ALREADY EXISTS IN THE SCENE")
    }
            
    });
  

    let img, label;
    label = document.createElement('label');
    label.setAttribute('for', assetsList[i].Name);
    img = document.createElement('img');
    img.src = assetsList[i].thumbnail;
    img.style.background = '#ffffff';

    label.className = 'btn px-1 py-0 position-relative mt-0 ';
    img.className = 'Objectthumbnail';

    label.appendChild(img);
    let div = document.createElement('div');
    div.className = 'd-flex flex-column';
    let div1 = document.createElement('div');
    let label1 = document.createElement('label');
    label1.innerText = assetsList[i].Name;
    label1.className = 'objectName';

    div1.appendChild(input);
    div1.appendChild(label);

    div.appendChild(div1);
    div.appendChild(label1);
    UIContainer.appendChild(div);
 
  }
};

export { furnitureTypesUI };
