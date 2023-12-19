import hdriLoad from '../components/hdri_loader/hdri_loader.js';
import * as THREE from 'three';
import elementFromHtmlString from '../utils/elementFromHtmlString';
import { Color, Scene, SpotLight, PointLight } from 'three';

async function lightControls(
  scene: Scene,
  renderer: any,
  sunLight: object,
  ambientLight: object,
  ceilingLight: object,
  desktopLight: PointLight,
  stateList: object,
  wallWasherLightArray: object
) {
  const { background0, hdri0, hdri1 } = await hdriLoad();
  // desktopLight = scene.getObjectByName("Desktop_Lamp_Light002");

  const LightControlsArray: {
    id: string;
    innerText: string;
    helper: boolean | null;
    distance: number | null;
    decay: number | null;
    color: string | null;
    intensity: number | null;
    light: any;
  }[] = [
    {
      id: 'pitchDark',
      innerText: 'Pitch Dark',
      helper: null,
      distance: null,
      decay: null,
      color: null,
      intensity: null,
      light: null,
    },
    {
      id: 'ceilingLight',
      innerText: 'Cieling Light',
      helper: true,
      distance: 4,
      decay: 2,
      color: '#ffffff',
      intensity: 30,
      light: ceilingLight,
    },
    {
      id: 'desktopLight',
      innerText: 'Desktop Light',
      helper: true,
      distance: 4,
      decay: 2,
      color: '#ffffff',
      intensity: 15,
      light: desktopLight,
    },
    {
      id: 'wallWasherLight',
      innerText: 'Wall Washer Light',
      helper: true,
      distance: 1,
      decay: 2,
      color: '#ffffff',
      intensity: 2,
      light: wallWasherLightArray,
    },
    {
      id: 'sunLight',
      innerText: 'Sun Light',
      helper: true,
      distance: null,
      decay: null,
      color: '#ffffff',
      intensity: 30,
      light: sunLight,
    },
    {
      id: 'ambientLight',
      innerText: 'Ambient Light',
      helper: null,
      distance: null,
      decay: null,
      color: '#ffffff',
      intensity: 1,
      light: ambientLight,
    },
  ];

  const htmlArray1: HTMLElement[] = LightControlsArray.map((item) =>
    elementFromHtmlString(`
<div class="d-flex lightSettingContainer" style="display:flex; align-items:center; width:100%;gap:5px;margin-left:50%">
 <div class="d-flex flex-row" style="display:flex; align-items:center; width:100%;" >
   <label for="${
     item.id
   }" style="display:flex; align-items:center;width:150px" >
     <input type="checkbox" data-type="${item.id}" id="${
      item.id
    }" name="lights" class="lightActiveCheckbox" />
     ${item.innerText}
   </label>
 </div>
 ${
   item.intensity
     ? `
     <div class="slidecontainer">
     <input type="range" data-type="${item.id}" min="0" max="10" value="${item.intensity}" step="0.1"
     class="slider Slider_range intensity_slider" style="width:60px"/>
     </div>
 `
     : ''
 }
 ${
   item.color
     ? `
 <div class="colorPickerContainer" >
   <input type="color" data-type="${item.id}" class="colorPicker" name="colorPicker"
   value="${item.color}" style="border:none;height: 20px;width:20px">
 </div>`
     : ''
 }
 ${
   item.helper
     ? `
 <input type="radio" data-type="${item.id}" value="${item.helper}" name="helper"
 class="helpers_controls">
 `
     : ''
 }
 ${
   item.distance
     ? `
 <input type="number" data-type="${item.id}" class="distance_class" name="distance_class"
 value="${item.distance}" min="0" max="10" step="0.1"  style="width: 25px;height: 20px;">
 `
     : ''
 }
</div>
`)
  );

  const htmlArray: HTMLElement[] = LightControlsArray.map((item) =>
    elementFromHtmlString(`  
  <div calss="lightSettingContainer" style="width:100%;gap:5px;">    
    <div class="d-flex flex-row" >
      <label for="${
        item.id
      }" style="display:flex; align-items:center;width:150px;" class="form-check-label" >
        <input type="checkbox" data-type="${item.id}" id="${
      item.id
    }" name="lights" class="lightActiveCheckbox" style="width:13px;height:13px;margin-right:5px;"/>
        ${item.innerText}
      </label>
    </div>
    <div class="d-flex flex-row justify-content-between">
    ${
      item.intensity
        ? `
        <div class="slidecontainer">
        <input type="range" data-type="${item.id}" min="0" max="10" value="${item.intensity}" step="0.1"
        class="slider Slider_range intensity_slider" style="width:80px;margin-left:10px;margin-right:5px;"/>
        </div>
    `
        : ''
    }
    ${
      item.color
        ? `
    <div class="colorPickerContainer" >
      <input type="color" data-type="${item.id}" class="colorPicker" name="colorPicker"
      value="${item.color}" style="border:none;height: 20px;width:20px">
    </div>`
        : ''
    }    
    </div>  
  </div>
`)
  );

  const controlsContianer = document.querySelector(
    '.initialControlsContainer'
  ) as HTMLInputElement;
  let l = htmlArray.length - 1;
  for (let i = 0; i < l; i++) {
    controlsContianer.appendChild(htmlArray[i]);
  }
  const controlsContianer1 = document.querySelector(
    '.initialControlsContainer1'
  ) as HTMLInputElement;
  htmlArray1.forEach((item) => {
    controlsContianer1.appendChild(item);
  });

  const checkboxArray = document.querySelectorAll('.lightActiveCheckbox');
  const intensitySliderArray = document.querySelectorAll('.intensity_slider');
  let colorPickerArray = document.querySelectorAll('.colorPicker');
  let distanceArray = document.querySelectorAll('.distance_class');
  let decayArray = document.querySelectorAll('.decay_class');
  let helpersArray = document.querySelectorAll('.helpers_controls');

  let emissive_Obj = scene.getObjectByName('Mesh_Walls001');
  let Motor_emissive = scene.getObjectByName('Motor_emissive');

  checkboxArray.forEach((checkbox) => {
    checkbox.addEventListener('change', (e: Event) => {
      if ((e.target as HTMLElement).dataset.type === 'pitchDark') {
        if ((e.target as HTMLInputElement).checked) {
          renderer.toneMappingExposure = 0.3;
          emissive_Obj.material.emissive = new Color(0x251d11);
          Motor_emissive.material.emissive = new Color(0x251d11);

          LightControlsArray.forEach((item) => {
            if (item.light) {
              if (item.light.length) {
                item.light.forEach((light: SpotLight) => {
                  light.intensity = 0;
                });
              } else {
                item.light.intensity = 0;
              }
            }
          });
          let floor_lamp_Ele = scene.getObjectByName('Point');
          if (floor_lamp_Ele) {
            floor_lamp_Ele.intensity = 0;
          }
          let Point_Light = scene.getObjectByName('Point_Light'),
            Point_Light1 = scene.getObjectByName('Point_Light1');
          if (Point_Light) {
            Point_Light.intensity = 0;
            Point_Light1.intensity = 0;
          }
        } else {
          renderer.toneMappingExposure = 1;
        }
      }

      let lightToChangeData = LightControlsArray.find(
        (i) => i.id === (e.target as HTMLElement).dataset.type
      );
      let lightToChange = lightToChangeData?.light;
      if (lightToChangeData?.intensity && lightToChange) {
        if (lightToChange.length) {
          lightToChange.forEach((item: SpotLight) => {
            item.intensity = (e.target as HTMLInputElement).checked
              ? lightToChangeData?.intensity
              : 0;
          });
        } else {
          if (lightToChangeData.id == 'desktopLight') {
            desktopLight = scene.getObjectByName('Desktop_Lamp_Light002');
            desktopLight.castShadow = true;
            lightToChange = desktopLight;
            localStorage.desktopLight_val = true;
          }
          lightToChange.intensity = (e.target as HTMLInputElement).checked
            ? lightToChangeData?.intensity
            : 0;
        }
        console.log('intensity value type', typeof lightToChange.intensity);
        emissive_Obj.material.emissive = new Color(1, 1, 1);
        Motor_emissive.material.emissive = new Color(1, 1, 1);
        renderer.toneMappingExposure = 1;
      }
    });
  });
  intensitySliderArray.forEach((slider) => {
    slider.addEventListener('input', (e: Event) => {
      const lightToChangeData = LightControlsArray.find(
        (i) => i.id === (e.target as HTMLElement).dataset.type
      );
      let lightToChange = lightToChangeData?.light;
      if (lightToChangeData?.intensity && lightToChange) {
        if (Array.isArray(lightToChange)) {
          lightToChange.forEach((item: SpotLight) => {
            item.intensity = parseInt((e.target as HTMLInputElement).value);
            console.log(
              'slider value type: ',
              typeof parseInt((e.target as HTMLInputElement).value)
            );
          });
        } else {
          if (lightToChangeData.id == 'desktopLight') {
            desktopLight = scene.getObjectByName('Desktop_Lamp_Light002');
            lightToChange = desktopLight;
          }
          lightToChange.intensity = parseInt(
            (e.target as HTMLInputElement).value
          );
          console.log(
            'slider value type: ',
            typeof parseInt((e.target as HTMLInputElement).value)
          );
        }
      }
    });
  });
  colorPickerArray.forEach((colorPicker) => {
    colorPicker.addEventListener('input', (e: Event) => {
      const lightToChangeData = LightControlsArray.find(
        (i) => i.id === (e.target as HTMLElement).dataset.type
      );
      let lightToChange = lightToChangeData?.light;
      if (lightToChangeData?.color && lightToChange) {
        if (Array.isArray(lightToChange)) {
          lightToChange.forEach((item: SpotLight) => {
            item.color = new Color((e.target as HTMLInputElement).value);
          });
        } else {
          if (lightToChangeData.id == 'desktopLight') {
            desktopLight = scene.getObjectByName('Desktop_Lamp_Light002');
            lightToChange = desktopLight;
          }
          lightToChange.color = new Color((e.target as HTMLInputElement).value);
        }
        console.log(
          'Color value type: ',
          typeof parseInt((e.target as HTMLInputElement).value)
        );
      }
    });
  });
  helpersArray.forEach((helpers_controls) => {
    helpers_controls.addEventListener('input', (e: Event) => {
      const lightToChangeData = LightControlsArray.find(
        (i) => i.id === (e.target as HTMLElement).dataset.type
      );
      const lightToChange = lightToChangeData?.light;
      if (lightToChangeData?.helper && lightToChange) {
        scene.traverse(function (child: any) {
          if (child.name == 'helper') {
            scene.remove(child);
          }
        });
        if (lightToChange.length) {
          lightToChange.forEach((item: SpotLight) => {
            const helper = new THREE.SpotLightHelper(item);
            helper.name = 'helper';
            scene.add(helper);
          });
        } else {
          let helper;
          if (lightToChange?.type == 'SpotLight') {
            helper = new THREE.SpotLightHelper(lightToChange);
            helper.name = 'helper';
          } else if (lightToChange?.type == 'PointLight') {
            helper = new THREE.PointLightHelper(lightToChange, 1);
            helper.name = 'helper';
          } else {
            helper = new THREE.DirectionalLightHelper(
              lightToChange,
              1,
              0xff0000
            );
            helper.name = 'helper';
          }
          scene.add(helper);
        }
      }
    });
  });
  distanceArray.forEach((distance_class) => {
    distance_class.addEventListener('input', (e: Event) => {
      const lightToChangeData = LightControlsArray.find(
        (i) => i.id === (e.target as HTMLElement).dataset.type
      );
      let lightToChange = lightToChangeData?.light;
      if (lightToChangeData?.distance && lightToChange) {
        if (lightToChange.length) {
          lightToChange.forEach((item: SpotLight) => {
            item.distance = parseInt((e.target as HTMLInputElement).value);
          });
        } else {
          if (lightToChangeData.id == 'desktopLight') {
            desktopLight = scene.getObjectByName('Desktop_Lamp_Light002');
            lightToChange = desktopLight;
          }
          lightToChange.distance = parseInt(
            (e.target as HTMLInputElement).value
          );
        }
      }
      console.log(
        'distance value type: ',
        typeof parseInt((e.target as HTMLInputElement).value)
      );
    });
  });
  decayArray.forEach((decay_class) => {
    decay_class.addEventListener('input', (e: Event) => {
      const lightToChangeData = LightControlsArray.find(
        (i) => i.id === (e.target as HTMLElement).dataset.type
      );
      let lightToChange = lightToChangeData?.light;
      if (lightToChangeData?.decay && lightToChange) {
        if (Array.isArray(lightToChange)) {
          lightToChange.forEach((item: SpotLight) => {
            item.decay = parseInt((e.target as HTMLInputElement).value);
          });
        } else {
          if (lightToChangeData.id == 'desktopLight') {
            desktopLight = scene.getObjectByName('Desktop_Lamp_Light002');
            lightToChange = desktopLight;
          }
          lightToChange.decay = parseInt((e.target as HTMLInputElement).value);
        }
      }
    });
  });

  let Emissive = document.getElementById('Emissive') as HTMLInputElement;

  Emissive.addEventListener('change', (e: Event) => {
    if ((e.target as HTMLInputElement).checked) {
      emissive_Obj.material.emissive = new Color(1, 1, 1);
      Motor_emissive.material.emissive = new Color(1, 1, 1);
    } else {
      emissive_Obj.material.emissive = new Color(0x251d11);
      Motor_emissive.material.emissive = new Color(0x251d11);
    }
  });

  let floor_lamp = document.getElementById('floor_lamp') as HTMLInputElement;
  let wall_lamp = document.getElementById('wall_lamp') as HTMLInputElement;
  let slidecontainer = document.querySelectorAll('.slider_class');
  let colorPickerContainer = document.querySelectorAll('.colorPicker1');
  let distance = document.querySelectorAll('.distance');
  let decay = document.querySelectorAll('.decay');
  let helper_FW = document.querySelectorAll('.helper_FW');

  let FloorLamp_sideUI = document.getElementById(
    'floor_lamp_sideUI'
  ) as HTMLInputElement;
  let WallLamp_sideUI = document.getElementById(
    'wall_lamp_sideUI'
  ) as HTMLInputElement;

  let slider_HL = slidecontainer[2] as HTMLInputElement;
  let slider_FL = slidecontainer[0] as HTMLInputElement,
    colorPicker_FL = colorPickerContainer[0] as HTMLInputElement,
    distance_FL = distance[0] as HTMLInputElement,
    decay_FL = decay[0] as HTMLInputElement,
    helpers_FL = helper_FW[0] as HTMLInputElement;
  let slider_WL = <HTMLInputElement>slidecontainer[1],
    colorPicker_WL = colorPickerContainer[1] as HTMLInputElement,
    distance_WL = distance[1] as HTMLInputElement,
    decay_WL = decay[1] as HTMLInputElement,
    helpers_WL = helper_FW[1] as HTMLInputElement;
  let colorPicker_FL_sideUI = <HTMLInputElement>colorPickerContainer[2],
    colorPicker_WL_sideUI = colorPickerContainer[3] as HTMLInputElement,
    slider_FL_sideUI = slidecontainer[3] as HTMLInputElement,
    slider_WL_sideUI = slidecontainer[4] as HTMLInputElement;

  let HDRI = document.getElementById('HDRI') as HTMLInputElement;
  HDRI.addEventListener('change', (e: Event) => {
    if ((e.target as HTMLInputElement).checked) {
      scene.environment = hdri1;
    } else {
      scene.environment = hdri0;
    }
    slider_HL.oninput = function () {
      console.log(
        'slider value type',
        typeof parseFloat((this as HTMLInputElement).value)
      );
      renderer.toneMappingExposure = parseFloat(
        (this as HTMLInputElement).value
      );
    };
  });

  floor_lamp.addEventListener('change', (e: Event) => {
    let floor_lamp_Ele = scene.getObjectByName('Point');
    if ((e.target as HTMLInputElement).checked) {
      floor_lamp_Ele.intensity = 5;
      floor_lamp_Ele.castShadow = true;
      slider_FL.oninput = function () {
        floor_lamp_Ele.intensity = parseInt((this as HTMLInputElement).value);
      };
      colorPicker_FL.oninput = function () {
        floor_lamp_Ele.color.setHex(
          '0x' + (this as HTMLInputElement).value.slice(1, 7),
          1
        );
      };
      const pointLightHelper_FL = new THREE.PointLightHelper(
        floor_lamp_Ele,
        1,
        0x000000
      );
      helpers_FL.addEventListener('change', (e: Event) => {
        if ((e.target as HTMLInputElement).checked) {
          scene.add(pointLightHelper_FL);
        } else {
          scene.remove(pointLightHelper_FL);
        }
      });
      distance_FL.oninput = function () {
        floor_lamp_Ele.distance = parseInt((this as HTMLInputElement).value);
      };
      decay_FL.oninput = function () {
        floor_lamp_Ele.decay = parseInt((this as HTMLInputElement).value);
      };
    } else {
      floor_lamp_Ele.intensity = 0;
    }
  });

  FloorLamp_sideUI.addEventListener('change', (e: Event) => {
    let floor_lamp_Ele = scene.getObjectByName('Point');
    if ((e.target as HTMLInputElement).checked) {
      floor_lamp_Ele.intensity = 5;
      floor_lamp_Ele.castShadow = true;
      slider_FL_sideUI.oninput = function () {
        floor_lamp_Ele.intensity = parseInt((this as HTMLInputElement).value);
      };
      colorPicker_FL_sideUI.oninput = function () {
        floor_lamp_Ele.color.setHex(
          '0x' + (this as HTMLInputElement).value.slice(1, 7),
          1
        );
      };
    } else {
      floor_lamp_Ele.intensity = 0;
    }
  });

  let Point_Light: PointLight, Point_Light1: PointLight;
  wall_lamp.addEventListener('change', (e) => {
    Point_Light = scene.getObjectByName('Point_Light');
    Point_Light1 = scene.getObjectByName('Point_Light1');
    if ((e.target as HTMLInputElement).checked) {
      Point_Light.intensity = 2;
      Point_Light1.intensity = 2;
      Point_Light.castShadow = true;
      slider_WL.oninput = function () {
        Point_Light.intensity = parseInt((this as HTMLInputElement).value);
        Point_Light1.intensity = parseInt((this as HTMLInputElement).value);
      };
      colorPicker_WL.oninput = function () {
        Point_Light.color.setHex(
          '0x' + (this as HTMLInputElement).value.slice(1, 7),
          1
        );
        Point_Light1.color.setHex(
          '0x' + (this as HTMLInputElement).value.slice(1, 7),
          1
        );
      };
      distance_WL.oninput = function () {
        Point_Light.distance = parseInt((this as HTMLInputElement).value);
        Point_Light1.distance = parseInt((this as HTMLInputElement).value);
      };
      decay_WL.oninput = function () {
        Point_Light.decay = parseInt((this as HTMLInputElement).value);
        Point_Light1.decay = parseInt((this as HTMLInputElement).value);
      };
      const pointLightHelper_WL = new THREE.PointLightHelper(Point_Light, 1);
      const pointLightHelper_WL1 = new THREE.PointLightHelper(Point_Light1, 1);
      helpers_WL.addEventListener('change', (e: Event) => {
        if ((e.target as HTMLInputElement).checked) {
          scene.add(pointLightHelper_WL);
          scene.add(pointLightHelper_WL1);
        } else {
          scene.remove(pointLightHelper_WL);
          scene.remove(pointLightHelper_WL1);
        }
      });
    } else {
      Point_Light.intensity = 0;
      Point_Light1.intensity = 0;
    }
  });
  WallLamp_sideUI.addEventListener('change', (e: Event) => {
    Point_Light = scene.getObjectByName('Point_Light');
    Point_Light1 = scene.getObjectByName('Point_Light1');
    if ((e.target as HTMLInputElement).checked) {
      Point_Light.intensity = 2;
      Point_Light1.intensity = 2;
      Point_Light.castShadow = true;
      slider_WL_sideUI.oninput = function () {
        Point_Light.intensity = parseInt((this as HTMLInputElement).value);
        Point_Light1.intensity = parseInt((this as HTMLInputElement).value);
      };
      colorPicker_WL_sideUI.oninput = function () {
        Point_Light.color.setHex(
          '0x' + (this as HTMLInputElement).value.slice(1, 7),
          1
        );
        Point_Light1.color.setHex(
          '0x' + (this as HTMLInputElement).value.slice(1, 7),
          1
        );
      };
    } else {
      Point_Light.intensity = 0;
      Point_Light1.intensity = 0;
    }
  });
}
export default lightControls;
