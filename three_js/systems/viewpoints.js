import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import globalState from '../store/globalState';

function viewPoints(camera, scene, framesParent) {
  function tweenTo(destination) {
    const tween = new TWEEN.Tween(camera.position).to(destination, 1500);
    tween.easing(TWEEN.Easing.Sinusoidal.InOut);
    tween.start();
    globalState.activeAnimation = 'viewPoints';
    tween.onComplete(() => {
      // console.log('animation complete');
      globalState.activeAnimation = 'none';
    });
  }

  // function view1_Fun() {
  //   var tween = new TWEEN.Tween(camera.position).to(
  //     {
  //       x: 0.01,
  //       y: 2.165,
  //       z: 4.73,
  //     },
  //     1500
  //   );
  //   tween.easing(TWEEN.Easing.Sinusoidal.InOut);
  //   tween.start();
  // }
  // function view2_Fun() {
  //   var tween = new TWEEN.Tween(camera.position).to(
  //     {
  //       x: 0.479,
  //       y: 1.065,
  //       z: 6.433,
  //     },
  //     1500
  //   );
  //   tween.easing(TWEEN.Easing.Sinusoidal.InOut);
  //   tween.start();
  // }
  // function view3_Fun() {
  //   var tween = new TWEEN.Tween(camera.position).to(
  //     {
  //       x: 0,
  //       y: -1.0165,
  //       z: -2.5,
  //     },
  //     1500
  //   );
  //   tween.easing(TWEEN.Easing.Sinusoidal.InOut);
  //   tween.start();
  // }
  // function view7_Fun() {
  //   var tween = new TWEEN.Tween(camera.position).to(
  //     {
  //       x: 0.2,
  //       y: 1.4,
  //       z: -1.45,
  //     },
  //     1500
  //   );
  //   tween.easing(TWEEN.Easing.Sinusoidal.InOut);
  //   tween.start();
  // }

  // function view4_Fun() {
  //   var tween = new TWEEN.Tween(camera.position).to(
  //     {
  //       x: 0.0479,
  //       y: 4.165,
  //       z: 2.0533,
  //     },
  //     1500
  //   );
  //   tween.easing(TWEEN.Easing.Sinusoidal.InOut);
  //   tween.start();
  // }
  // function view5_Fun() {
  //   var tween = new TWEEN.Tween(camera.position).to(
  //     {
  //       x: 2.479,
  //       y: 2.165,
  //       z: 2.433,
  //     },
  //     1500
  //   );
  //   tween.easing(TWEEN.Easing.Sinusoidal.InOut);
  //   tween.start();
  // }

  // function view6_Fun() {
  //   var tween = new TWEEN.Tween(camera.position).to(
  //     {
  //       x: 3.479,
  //       y: 0.165,
  //       z: 0,
  //     },
  //     1500
  //   );
  //   tween.easing(TWEEN.Easing.Sinusoidal.InOut);
  //   tween.start();
  // }

  let Viewpoints_Desktop = document.querySelectorAll('.Viewpoints_Desktop');
  Viewpoints_Desktop[0].addEventListener('change', (e) => {
    if (e.target.checked) {
      // view1_Fun();
      tweenTo({
        x: 0.01,
        y: 2.165,
        z: 4.73,
      });
      let Frames = scene.getObjectByName('Frames');
      if (Frames == undefined && localStorage.framesValue == 'true') {
        scene.add(framesParent);
      }
    }
  });
  Viewpoints_Desktop[4].addEventListener('change', (e) => {
    if (e.target.checked) {
      // view2_Fun();
      tweenTo({
        x: 0.479,
        y: 1.065,
        z: 6.433,
      });
      let Frames = scene.getObjectByName('Frames');
      if (Frames == undefined && localStorage.framesValue == 'true') {
        scene.add(framesParent);
      }
    }
  });
  Viewpoints_Desktop[5].addEventListener('change', (e) => {
    if (e.target.checked) {
      // view3_Fun();
      tweenTo({
        x: 0,
        y: -1.0165,
        z: -2.5,
      });
      let Frames = scene.getObjectByName('Frames');
      if (Frames == undefined && localStorage.framesValue == 'true') {
        scene.add(framesParent);
      }
    }
  });
  Viewpoints_Desktop[6].addEventListener('change', (e) => {
    if (e.target.checked) {
      // view7_Fun();
      tweenTo({
        x: 0.2,
        y: 1.4,
        z: -1.45,
      });
      let Frames = scene.getObjectByName('Frames');
      if (Frames == undefined && localStorage.framesValue == 'true') {
        scene.add(framesParent);
      }
    }
  });
  Viewpoints_Desktop[1].addEventListener('change', (e) => {
    if (e.target.checked) {
      // view4_Fun();
      tweenTo({
        x: 0.0479,
        y: 4.165,
        z: 2.0533,
      });
      let Frames = scene.getObjectByName('Frames');
      if (Frames == undefined && localStorage.framesValue == 'true') {
        scene.add(framesParent);
      }
    }
  });
  Viewpoints_Desktop[3].addEventListener('change', (e) => {
    if (e.target.checked) {
      // view5_Fun();
      tweenTo({
        x: 2.479,
        y: 2.165,
        z: 2.433,
      });
      let Frames = scene.getObjectByName('Frames');
      if (Frames == undefined && localStorage.framesValue == 'true') {
        scene.add(framesParent);
      }
    }
  });
  Viewpoints_Desktop[2].addEventListener('change', (e) => {
    if (e.target.checked) {
      // view6_Fun();
      tweenTo({
        x: 3.479,
        y: 0.165,
        z: 0,
      });
      scene.remove(framesParent);
    }
  });
}

export { viewPoints };
