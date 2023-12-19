import { MOUSE } from 'three';
function basicControls(scene, camera, controls, renderer) {
  controls.enableZoom = true;
  controls.enablePan = true;
  controls.enableRotate = true;
  controls.minPolarAngle = controls.maxPolarAngle = 1.57079;
  controls.listenToKeyEvents(window);

  controls.minDistance = 0;
  // controls.maxDistance = 5;

  document.addEventListener('keydown', onDocumentKeyDown, false);
  async function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 32) {
      //keyCode 32 is for spacebar
      scene.rotation.y -= 0.01;
    }
    if (keyCode == 189) {
      //keyCode 32 is for spacebar
      camera.position.z += 1;
    }
    if (keyCode == 187) {
      //keyCode 32 is for spacebar
      camera.position.z -= 1;
    }
  }
  controls.mouseButtons = {
    LEFT: MOUSE.ROTATE,
    MIDDLE: MOUSE.DOLLY,
    RIGHT: MOUSE.PAN,
  };
  let nav_Bg_color = document.querySelectorAll('.nav_Bg_color');
  function Zoom_Fun() {
    controls.enableZoom = true;
    nav_Bg_color[0].classList.add('changeColor');
    nav_Bg_color[0].style.backgroundColor = '#FFF';
    nav_Bg_color[1].style.backgroundColor = '#F5F5F5';
    nav_Bg_color[1].classList.remove('changeColor');
    nav_Bg_color[2].style.backgroundColor = '#F5F5F5';
    nav_Bg_color[2].classList.remove('changeColor');
  }
  function Zoom_Else_Fun() {
    controls.enableZoom = false;
  }

  function Rotate_Fun() {
    controls.enableRotate = true;
    nav_Bg_color[2].style.backgroundColor = '#FFF';
    nav_Bg_color[2].classList.add('changeColor');
    nav_Bg_color[1].style.backgroundColor = '#F5F5F5';
    nav_Bg_color[1].classList.remove('changeColor');
    nav_Bg_color[0].style.backgroundColor = '#F5F5F5';
    nav_Bg_color[0].classList.remove('changeColor');
  }

  function Rotate_Else_Fun() {
    controls.enableRotate = false;
  }

  function Pan_Fun() {
    controls.enablePan = true;
    nav_Bg_color[1].style.backgroundColor = '#FFF';
    nav_Bg_color[1].classList.add('changeColor');
    nav_Bg_color[0].style.backgroundColor = '#F5F5F5';
    nav_Bg_color[0].classList.remove('changeColor');
    nav_Bg_color[2].style.backgroundColor = '#F5F5F5';
    nav_Bg_color[2].classList.remove('changeColor');
  }

  function Pan_Else_Fun() {
    controls.enablePan = false;
  }

  let navigation_Desktop = document.querySelectorAll('.navigation_Desktop');
  navigation_Desktop[0].addEventListener('click', function () {
    Zoom_Fun();
  });
  navigation_Desktop[1].addEventListener('click', function () {
    Pan_Fun();
  });
  navigation_Desktop[2].addEventListener('click', function () {
    Rotate_Fun();
  });

  // controls.maxDistance=10;

  controls.update();
}

export { basicControls };
