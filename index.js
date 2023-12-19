import { threeSixtySpin } from './threeSixtySpin/threesixty1.js';
import { threeSixtySpinTable } from './threeSixtySpin/threesixty2';
import globalState from './three_js/store/globalState.js';
import { World } from './three_js/World.js';
import { dayNightInstance } from './three_js/systems/dayNight.js';
async function main(worldInstance) {
  let home_card_close_Desktop = document.getElementById(
    'home_card_close_Desktop'
  );
  let home_card_container_Desktop = document.getElementById(
    'home_card_container_Desktop'
  );

  home_card_close_Desktop.addEventListener('click', function () {
    home_card_container_Desktop.style.display = 'none';
  });
  globalState.worldInstance = worldInstance;
  worldInstance.createUI();

  await worldInstance.loadRoomGLTF();
  await worldInstance.loadHDRI();
  await worldInstance.loadLightsGLTF();
  
  worldInstance.SwitchModes();
  worldInstance.createPostProcess();
  worldInstance.start();
  let home_card_close = document.getElementById('home_card_close');
  home_card_close.style.display = 'block';
  let Spinner = document.getElementById('Spinner');
  let prompt = document.getElementById('ar-prompt');
  let Prompt_ui = document.getElementById('Prompt_ui');

  let furniture_val = 0;
  let animationsUIContainer = document.getElementById('animationsUIParent');
  let load_Furniture_Desktop = document.getElementById(
    'load_Furniture_Desktop'
  );
  load_Furniture_Desktop.addEventListener('click', async function (e) {
    if (furniture_val == 0) {
      console.time('Furniture Loading Time');
      // Spinner.style.display = 'block';
      // globalState.loading=true
      await worldInstance.loadBlindsGLTF();
      console.time('chair loaded');
      await worldInstance.loadChairGLTF(), console.timeEnd('chair loaded');
      console.time('table loaded');
      await worldInstance.loadTableGLTF(), console.timeEnd('table loaded');

      furnitureName = 'Table1';
      variant = 1;
      spin_description = 'Table1';
      threeSixtySpinTable(furnitureName, variant, spin_description);

      e.target.closest('.landingButton').classList.add('activeBtn');
      // Spinner.style.display = 'none';
      if (Prompt_ui.checked) {
        prompt.style.display = 'block';
      }
      animationsUIContainer.style.display = 'block';
      console.timeEnd('Furniture Loading Time');
      furniture_val += 1;
    }
  });
  let light_val = 0;
  let load_Lighting_Desktop = document.getElementById('load_Lighting_Desktop');
  load_Lighting_Desktop.addEventListener('click', async (e) => {
    if (light_val == 0) {
      Spinner.style.display = 'block';

      console.time('Lighting Loading Time');
      globalState.pauseRender = true;
      //  globalState.loading=true

      console.time('cylindrical lights added');
      await worldInstance.loadCylindricalLight();
      console.timeEnd('cylindrical lights added');

      console.time('switched lighting from day light to night light');
      // await worldInstance.lightPresets();
      // dayNightInstance.enableNightLights();
      console.timeEnd('switched lighting from day light to night light');
      
      console.time('desktop light added');
      // await worldInstance.loadDesktopLight();
      console.timeEnd('desktop light added');

     

      // Spinner.style.display = 'none';

      e.target.closest('.landingButton').classList.add('activeBtn');
      if (Prompt_ui.checked) {
        prompt.style.display = 'block';
      }
      light_val += 1;
      globalState.pauseRender = false;
      //  globalState.loading=false
      console.timeEnd('Lighting Loading Time');

      localStorage.lastInput = 'Table1';
      /* furnitureName = 'Desktop_Lamp';
      variant = 1;
      spin_description = 'Desktop Lamp';      
      threeSixtySpin(furnitureName, variant, spin_description); */
    }
  });
  let Accessories_val = 0,
    chair_val = 0;
  let load_Accessories_Desktop = document.getElementById(
    'load_Accessories_Desktop'
  );
  load_Accessories_Desktop.addEventListener('click', async function (e) {
    if (Accessories_val == 0) {
      console.time('Accessories Loading Time');
      // Spinner.style.display = 'block';
      await worldInstance.loadMirrorGLTF();
      await worldInstance.loadAccessoriesGLTF();
      await worldInstance.loadVaseGLTF();
      // await worldInstance.loadFanGLTF();
      e.target.closest('.landingButton').classList.add('activeBtn');
      // Spinner.style.display = 'none';
      if (Prompt_ui.checked) {
        prompt.style.display = 'block';
      }
      console.timeEnd('Accessories Loading Time');
      Accessories_val += 1;
    }
  });
  let load_LoungChair_Desktop = document.getElementById(
    'load_LoungChair_Desktop'
  );
  let furnitureName, variant, spin_description;
  load_LoungChair_Desktop.addEventListener('click', async function (e) {
    if (chair_val == 0) {
      console.time('lounge chair Loading Time');
      // Spinner.style.display = 'block';
      await worldInstance.loadLoungChairGLTF();
      furnitureName = 'Loung_Chair';
      variant = 1;
      spin_description = 'Lounge Chair';
      threeSixtySpin(furnitureName, variant, spin_description);
      e.target.closest('.landingButton').classList.add('activeBtn');
      // Spinner.style.display = 'none';
      if (Prompt_ui.checked) {
        prompt.style.display = 'block';
      }
      animationsUIContainer.style.display = 'block';
      console.timeEnd('lounge chair Loading Time');
      chair_val += 1;
    }
  });

  let lightControls_Button = document.querySelector('.lightControls_Button');
  let LightsContainer = document.getElementById('LightsContainer');
  let light_ui = document.getElementById('light_ui');

  let flush_collapseEight = document.getElementById('flush-collapseEight');

  lightControls_Button.addEventListener('click', function () {
    LightsContainer.style.display = 'block';

    light_ui.setAttribute('aria-expanded', 'true');
    flush_collapseEight.classList.add('show');
  });
  let furniture_button = document.querySelector('.furniture_button');
  furniture_button.addEventListener('click', function () {
    light_ui.setAttribute('aria-expanded', 'false');
    flush_collapseEight.classList.remove('show');
  });
}

const worldInstance = new World();

main(worldInstance).catch((err) => {
  console.error(err);
});

document.querySelector('.spinsCloseBtn').addEventListener('click', () => {
  globalState.pauseRender = false;
  worldInstance.animate();
});
