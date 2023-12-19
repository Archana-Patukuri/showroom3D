import { Color } from 'three';
import elementFromHtmlString from '../utils/elementFromHtmlString';
import globalState from '../store/globalState';
import {
  AddLightToken,
  HDRIUpdateToken,
  UpdataLightColor,
  UpdateLightActive,
  UpdateLightIntensity,
  UpdateLightObject,
} from '../utils/pubsubTokens';
// eslint-disable-next-line
import PubSub from 'pubsub-js';

export const globalLightState = [];

export function enableLights(renderer, scene) {
  const controlsContianer = document.querySelector('.initialControlsContainer');

  PubSub.subscribe(UpdateLightActive, (token, updateMsg) => {
    // if (updateMsg.name === 'Sun Light' && globalState.isDay) {
    //   console.log('its night time');
    //   // return;
    // }
    const currentLightState = globalLightState.find((i) =>
      updateMsg.name.includes(i.name)
    );
    // console.log(currentLightState);

    if (!currentLightState) {
      console.log('no light state');
      return;
    }

    if (currentLightState.object.length) {
      currentLightState.object.forEach((item) => {
        item.intensity = updateMsg.value
          ? parseInt(currentLightState.intensity)
          : 0;
      });
    }

    currentLightState.object.intensity = updateMsg.value
      ? parseInt(currentLightState.intensity)
      : 0;
    currentLightState.active = updateMsg.value;

    currentLightState.uiElements.intensity.querySelector('input').disabled =
      !updateMsg.value;
    currentLightState.uiElements.color.querySelector('input').disabled =
      !updateMsg.value;
    currentLightState.uiElements.active.querySelector('input').checked =
      updateMsg.value;
  });
  PubSub.subscribe(UpdateLightIntensity, (token, updateMsg) => {
    const currentLightState = globalLightState.find((i) =>
      updateMsg.name.includes(i.name)
    );

    if (currentLightState.object.length) {
      currentLightState.object.forEach((item) => {
        item.intensity = parseInt(updateMsg.value);
      });
    }

    currentLightState.object.intensity = parseInt(updateMsg.value);
    currentLightState.intensity = parseInt(updateMsg.value);
    currentLightState.uiElements.intensity.querySelector('input').value =
      currentLightState.active && parseInt(updateMsg.value);
  });
  PubSub.subscribe(UpdataLightColor, (token, updateMsg) => {
    const currentLightState = globalLightState.find((i) =>
      updateMsg.name.includes(i.name)
    );
    if (currentLightState.object.length) {
      currentLightState.object.forEach((item) => {
        item.color = new Color(updateMsg.value);
      });
    }
    currentLightState.object.color = new Color(updateMsg.value);
    currentLightState.color = new Color(updateMsg.value);
  });
  PubSub.subscribe(UpdateLightObject, (token, updateMsg) => {
    const currentLightState = globalLightState.find((i) =>
      updateMsg.name.includes(i.name)
    );
    currentLightState.object = updateMsg.object;
  });
  const controlsWrapperPitchDark = elementFromHtmlString(`
    <div class="light_control_wrapper d-flex flex-row justify-content-between"></div>
  `);
  const PirchDarkLabelName = elementFromHtmlString(
    `<span style="">Pitch Dark</span>`
  );
  const PitchDarkToggle = elementFromHtmlString(`
  <label for="pitchDark">
  <input type="checkbox" style="width:18px;height:18px;" name="pitchDark" id="pitchDark" />
  
</label>
  `);
  controlsWrapperPitchDark.appendChild(PirchDarkLabelName);
  controlsWrapperPitchDark.appendChild(PitchDarkToggle);
  controlsContianer.appendChild(controlsWrapperPitchDark);

  PitchDarkToggle.addEventListener('input', (e) => {
    console.log('pitchdark');
   
    if (globalState.isDay) {
      PubSub.publish(HDRIUpdateToken, {
        exposure: e.target.checked ? 0.02 : 0.3,
      });
    } else {
      PubSub.publish(HDRIUpdateToken, {
        exposure: e.target.checked ? 0.02 : 0.3,
      });
    }

    globalLightState.forEach((state) => {
      PubSub.publish(UpdateLightActive, {
        name: state.name,
        value:
          !globalState.isDay && state.name.includes('Sun Light')
            ? false
            : !e.target.checked,
      });
    });
  });
  PubSub.subscribe(AddLightToken, (_, msg) => {
    // console.log(msg);
    // console.log(globalLightState);
    const controlsWrapper = elementFromHtmlString(`
      <div class="light_control_wrapper"></div>
    `);

    // const lightName = elementFromHtmlString(`<span>${msg.name}</span>`);
    const active = elementFromHtmlString(`
    <div class="d-flex flex-row justify-content-between" >
      <span>${msg.name}</span>
      <label for="${msg.name}active"> 
        <input type="checkbox" style="width:18px;height:18px;" name="${msg.name}active" id="${msg.name}active" />         
      </label>
    </div>
    `);
    active.querySelector('input').checked = msg.active;
    // console.log(active);

    active.addEventListener('input', (e) => {
      PitchDarkToggle.querySelector('input').checked = false;
      PubSub.publish(UpdateLightActive, {
        name: e.target.name,
        value:
          !globalState.isDay && e.target.name.includes('Sun Light')
            ? false
            : e.target.checked,
      });
     /*  PubSub.publish(HDRIUpdateToken, {
        exposure: globalState.isDay ? 0.02 : 0.3,
      }); */
    });
    const container_intensity = elementFromHtmlString(`
    <div class="d-flex flex-row justify-content-between">
    </div>
    `);

    const intensity = elementFromHtmlString(`
      <label for="${msg.name}intensity">
        <input type="range" class="slider Slider_range intensity_slider" style="width:80px;margin-right:5px;"  name="${
          msg.name
        }intensity" id="${msg.name}intensity" value="${parseInt(
      msg.intensity
    )}" min="${parseInt(msg.minIntensity)}" max="${parseInt(
      msg.maxIntensity
    )}" step="0.01" name="" id="" />
        
      </label>
    `);
    intensity.querySelector('input').disabled = !msg.active;
    intensity.addEventListener('input', (e) => {
      PubSub.publish(UpdateLightIntensity, {
        name: e.target.name,
        value: parseInt(e.target.value),
      });
    });

    const color = elementFromHtmlString(`
    <label for="${msg.name}color" >
      <input type="color" name="${msg.name}color" id="${
      msg.name
    }color" value="${`#${msg.color.getHexString()}`}"  style="border:none;height: 20px;width:40px"/>
    </label>
    `);
    container_intensity.appendChild(intensity);
    container_intensity.appendChild(color);

    color.querySelector('input').disabled = !msg.active;

    color.addEventListener('input', (e) => {
      PubSub.publish(UpdataLightColor, {
        name: e.target.name,
        value: e.target.value,
      });
    });

    // console.log(msg.color.getHexString());

    msg.uiElements = { active, intensity, color };
    const item = globalLightState.find((i) => i.name === msg.name);
    if (item) {
      return;
    }

    msg.object.intensity = msg.active ? parseInt(msg.object.intensity) : 0;

    globalLightState.push(msg);

    // controlsWrapper.appendChild(lightName);
    controlsWrapper.appendChild(active);
    /* controlsWrapper.appendChild(intensity);
    controlsWrapper.appendChild(color); */
    controlsWrapper.appendChild(container_intensity);
    controlsContianer.appendChild(controlsWrapper);
  });
}
