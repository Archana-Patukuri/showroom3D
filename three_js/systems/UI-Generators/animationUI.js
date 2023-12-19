import { LoopOnce } from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import tablesHeights from '../../dataBase/tablesHeights.json' assert { type: 'json' };
import { threeSixtySpin } from '../../../threeSixtySpin/threesixty1';
import { threeSixtySpinTable } from '../../../threeSixtySpin/threesixty2';
import globalState from '../../store/globalState';    
function animationUI(gltfData, mixer, category, URL, scene, renderer) {
  let animationClips = [];

  let modelName = URL.slice(0, -4);
  let model_name;
  modelName = modelName.substring(modelName.lastIndexOf('/') + 1);
  let indx = modelName.lastIndexOf('1') + 1;
  if (
    (modelName == 'Loung_Chair_New') |
    (modelName == 'Table_Automatic_01_v01')
  ) {
    model_name = modelName;
  } else {
    model_name = modelName.slice(0, indx);
  }

  let form, input, label, img;
  let mainDiv = document.createElement('div');

  let div1_Container = document.createElement('div');
  div1_Container.className = 'accordion-item';
  // div1_Container.id="animationsUIParent"

  let div1_h2 = document.createElement('h2');
  div1_h2.className = 'accordion-header';
  div1_h2.id = 'flush-headingSix';

  let div1_btn = document.createElement('button');
  div1_btn.className = 'accordion-button collapsed';
  div1_btn.id = 'animation_show';
  div1_btn.setAttribute('type', 'button');
  div1_btn.setAttribute('data-bs-toggle', 'collapse');
  div1_btn.setAttribute('data-bs-target', '#flush-collapseSix');
  div1_btn.setAttribute('aria-expanded', 'false');
  div1_btn.setAttribute('aria-controls', 'flush-collapseSix');
  div1_btn.innerText = 'Dynamics';
  div1_h2.appendChild(div1_btn);

  div1_Container.appendChild(div1_h2);

  let div1_body_Container = document.createElement('div');
  div1_body_Container.className = 'accordion-collapse collapse';
  div1_body_Container.id = 'flush-collapseSix';
  div1_body_Container.setAttribute('aria-labelledby', 'flush-headingSix');

  let div1_body = document.createElement('div');
  div1_body.className = 'accordion-body animationAcc';

  div1_body_Container.appendChild(div1_body);
  div1_Container.appendChild(div1_body_Container);

  //Animations UI
  if (category == 'tables') {
    let tweens = [];

    let tableTopPos = gltfData.scene.getObjectByName('Table_Top').position;
    console.log(model_name);
    for (let i = 0; i < tablesHeights[model_name].length; i++) {
      //TweenSetup
      let level = { y: tablesHeights[model_name][i] };
      let tween = new TWEEN.Tween(tableTopPos).to(level, 1200);
      tween.easing(TWEEN.Easing.Sinusoidal.InOut);
      tweens.push(tween);
      //UI
      form = document.createElement('div');
      form.style.display = 'flex';
      form.style.marginTop = '2px';
      input = document.createElement('input');

      input.type = 'radio';
      input.className = 'largerCheckbox';
      input.name = model_name;
      input.id = tablesHeights[model_name][i];

      if (i == 0) {
        input.checked = true;
      }

      label = document.createElement('label');
      label.for = tablesHeights[model_name][i];
      label.innerHTML = 'Level ' + i;
      input.addEventListener('click', function () {
        tweens[i].start();
        globalState.activeAnimation = 'table';
        tweens[i].onComplete(() => {
          console.log('animation complete');
          globalState.activeAnimation = 'none';
        });
        let Name=(gltfData.scene.children[0].name)                     
        globalState.AnimationData[Name]='Level ' + i;        
      });

      form.appendChild(input);
      form.appendChild(label);
      div1_body.appendChild(form);
      mainDiv.appendChild(div1_Container);
    }
  } else {
    for (let i = 0; i < gltfData.animations.length; i++) {
      form = document.createElement('div');
      form.style.display = 'flex';
      form.style.marginTop = '2px';

      input = document.createElement('input');

      input.type = 'radio';
      input.name = 'animations';
      input.id = gltfData.animations[0].name + i;
      input.className = 'largerCheckbox';

      label = document.createElement('label');
      label.for = gltfData.animations[0].name + i;
      label.innerHTML = gltfData.animations[i].name;

      form.appendChild(input);
      form.appendChild(label);

      div1_body.appendChild(form);

      //Animation Clips
      animationClips[i] = mixer.clipAction(gltfData.animations[i]);
      animationClips[i].setLoop(LoopOnce);
      animationClips[i].blendMode = 1;
      animationClips[i].clampWhenFinished = true;

      input.addEventListener('click', function () {
        mixer.stopAllAction();
        animationClips[i].play();
        console.log(category);
        globalState.activeAnimation = category;
        mixer.addEventListener('finished', () => {
          console.log(category + 'animation finished');
          globalState.activeAnimation = 'none';
        });
        let Name=(gltfData.scene.children[0].name)                     
        globalState.AnimationData[Name]=gltfData.animations[i].name        

      });
    }
    mainDiv.appendChild(div1_Container);
  }

  //Material Variants UI

  let div2_Container = document.createElement('div');
  div2_Container.className = 'accordion-item';
  // div2_Container.id="animationsUIParent"

  let div2_h2 = document.createElement('h2');
  div2_h2.className = 'accordion-header';
  div2_h2.id = 'flush-headingSeven';

  let div2_btn = document.createElement('button');
  div2_btn.className = 'accordion-button collapsed';
  div2_btn.id = 'variants_show';
  div2_btn.setAttribute('type', 'button');
  div2_btn.setAttribute('data-bs-toggle', 'collapse');
  div2_btn.setAttribute('data-bs-target', '#flush-collapseSeven');
  div2_btn.setAttribute('aria-expanded', 'false');
  div2_btn.setAttribute('aria-controls', 'flush-collapseSeven');
  div2_btn.innerText = 'Material Variants';
  div2_h2.appendChild(div2_btn);

  div2_Container.appendChild(div2_h2);

  let div2_body_Container = document.createElement('div');
  div2_body_Container.className = 'accordion-collapse collapse';
  div2_body_Container.id = 'flush-collapseSeven';
  div2_body_Container.setAttribute('aria-labelledby', 'flush-headingSeven');

  let div2_body = document.createElement('div');
  div2_body.className = 'accordion-body d-flex flex-column m-0 py-0';
  div2_body.id = 'variants_Container animationAcc';

  div2_body_Container.appendChild(div2_body);
  div2_Container.appendChild(div2_body_Container);

  for (let i = 0; i < gltfData.userData.variants.length; i++) {
    input = document.createElement('input');
    input.type = 'radio';
    input.value = gltfData.userData.variants[i];
    input.className = 'btn-check p-0 m-0';
    input.name = `${category}variants`;
    input.id = gltfData.userData.variants[i];
    input.autocomplete = 'off';

    let furnitureName;
    async function input_var_Fun() {
      let myPromise = new Promise(function (resolve) {
        gltfData.functions.selectVariant(gltfData.scene, event.target.value);
        console.log(gltfData)
        furnitureName = localStorage.furnitureName;
        let variant = i + 1;
        
        let Name=(gltfData.scene.children[0].name)                     
        globalState.VariantData[Name]=gltfData.userData.variants[i]
        console.log(globalState.VariantData)

        localStorage.variant = variant;
        let spin_description = localStorage.spin_description;
        if (furnitureName.slice(0, 5) != 'Table') {
          if (modelName == 'Loung_Chair') {
            furnitureName = 'Loung_Chair';
            localStorage.variant = variant;
            spin_description = 'Lounge Chair';
          }

          threeSixtySpin(furnitureName, variant, spin_description);
        } else {
          threeSixtySpinTable(furnitureName, variant, spin_description);
        }       
      });
      await myPromise;
    }
    input.addEventListener('click', function (event) {
      input_var_Fun();            
         
      
        console.log(globalState.VariantData)
    });

    label = document.createElement('label');
    label.setAttribute('for', gltfData.userData.variants[i]);
    label.className = 'btn px-0 py-0 position-relative mt-0';

    img = document.createElement('img');
    img.src =
      'https://d3t7cnf9sa42u5.cloudfront.net/Updated_Models/variantsThumbnails/' +
      model_name +
      '/' +
      gltfData.userData.variants[i] +
      '.webp';
    img.alt = 'thumbnail';

    img.className = 'img-thumbnail px-0 py-0 m-0';
    
    label.appendChild(img);
    div2_body.appendChild(input);
    div2_body.appendChild(label);

   

    
    


  }
  mainDiv.appendChild(div2_Container);

  return mainDiv;
}

export { animationUI };
