import { Group } from 'three';
import { threeSixtySpin } from '../../../threeSixtySpin/threesixty1';
import { gltfLoad } from '../../components/gltf_loader/gltfLoad';
import globalState from '../../store/globalState';
import { AddLightToken } from '../../utils/pubsubTokens';
import PubSub from 'pubsub-js';

export function configureLights(data, asset) {
  const lightArray = [];
  data.scene.traverse((child) => {
    // console.log('LightAddHandler');
    if (child.isLight) {
      // child.intensity = 0;
      lightArray.push(child);
    }
  });
  // console.log(lightArray);
  PubSub.publish(AddLightToken, {
    name: asset.light_Name,
    type: lightArray[0].type,
    object: lightArray,
    intensity: 0,
    minIntensity: 0,
    maxIntensity: 3,
    color: lightArray[0].color,
    active: false,
  });

  // 360spins
  const furnitureName = asset.spin_value;
  const spin_description = asset.spin_description;
  localStorage.spin_description = spin_description;
  localStorage.furnitureName = furnitureName;
  threeSixtySpin(furnitureName, 1, spin_description);
  // console.timeEnd('configuringLights');
}

const lightTypesUI = function (
  assetsList,
  UIContainer,
  category,
  loadModel,
  initialModelID,
  selectableObjects,
  scene,
  Spinner
) {
  for (let i = 0; i < assetsList.length; i++) {
    let input = document.createElement('input');

    if (initialModelID == i) {
      input.checked = true;
    }

    input.type = 'radio';
    input.value = assetsList[i].URL;
    input.className = 'btn-check';
    input.name = category;
    input.id = assetsList[i].Name;
    input.autocomplete = 'off';
    input.dataset.url = assetsList[i].URL;

    input.addEventListener('click', async function (event) {
      // console.time('LightAddHandler');
      Spinner.style.display = 'block';
      globalState.pauseRender = true;
      globalState.loading = true;

      const modelUrl = event.target.dataset.url;
      const { gltfData } = await gltfLoad(modelUrl);
      selectableObjects.push(gltfData.scene);
      // globalState.scene.add(gltfData.scene);
      const group = new Group();
      group.name = 'selectable';
      group.add(gltfData.scene);
      globalState.scene.add(group);
      if (modelUrl.includes('Floor')) {
        gltfData.scene.position.set(
          -0.4,
          gltfData.scene.position.y,
          gltfData.scene.position.z + 0.5
        );
        gltfData.scene.rotation.set(0, Math.PI / 2, 0);
      }
      // console.log(modelUrl, gltfData, globalState);
      // const data = await loadModel(event.target.value, i, spinnerContainer);
      configureLights(gltfData, assetsList[i]);
      Spinner.style.display = 'none'; 

      // console.timeEnd('LightAddHandler');
      globalState.pauseRender = false;      
      globalState.worldInstance.animate();
    });

    let label = document.createElement('label');

    label.setAttribute('for', assetsList[i].Name);

    let img = document.createElement('img');
    img.src = assetsList[i].thumbnail;

    img.alt = 'light';
    img.style.background = '#ffffff';

    label.className = 'btn px-1 py-0 position-relative mt-0';
    img.className = 'Objectthumbnail';

    label.appendChild(img);

    let div = document.createElement('div');
    div.className = 'd-flex flex-column';
    let div1 = document.createElement('div');
    let label1 = document.createElement('label');
    if (assetsList[i].Name == 'Floor1') {
      label1.innerText = 'Floor';
    } else {
      label1.innerText = assetsList[i].Name;
    }
    label1.className = 'objectName';
    div1.appendChild(input);
    div1.appendChild(label);

    div.appendChild(div1);
    div.appendChild(label1);
    UIContainer.appendChild(div);

    let animationsUIParent = document.getElementById('animationsUIParent');
    input.addEventListener('click', function () {
      animationsUIParent.style.display = 'none';
    });
  }
};

export { lightTypesUI };
