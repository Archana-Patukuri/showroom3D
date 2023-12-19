const spinner = document.querySelector('.spinner');
let spin_Label = document.getElementById('spin_Label');
let spinsTableBtn = document.getElementById('spinsTableBtn');
let spinsBtn = document.getElementById('spinsBtn');
let Spinner_container = document.getElementById('Spinner_360');
let rotateImageSpin = document.getElementById('rotateImageSpin');
let spinContainer=document.getElementById("spinnerContainer")
let totalFrames = 60,
  ready = false,
  dragging = false,
  pointerStartPosX = 0,
  pointerEndPosX = 0,
  pointerDistance = 0,
  monitorStartTime = 0,
  monitorInt = 10,
  ticker = 0,
  speedMultiplier = 10,
  currentFrame = 0,
  frames = [],
  endFrame = 0,
  loadedImages = 0;
let flag = 0;
function threeSixtySpin(furnitureName, variant, spin_description) {
  Spinner_container.style.display = 'block';

  spinsTableBtn.style.display = 'none';
  spinsBtn.style.display = 'block';
  dragging = false;

  spinner.classList.add('spinnerUpdate');
  spinner.classList.remove('spinnerUpdateTable');
  (currentFrame = 0), (frames = []), (endFrame = 0), (loadedImages = 0);
  totalFrames = 60;

  spin_Label.innerText = spin_description;

  function loadImage() {
    imageLoaded();
  }

  loadImage();
  function imageLoaded() {
    loadedImages++;
    if (loadedImages == totalFrames) {
      showThreesixty();
      if (flag == 0) {
        spinner.style.backgroundImage =
          "url('" +
          'https://d3t7cnf9sa42u5.cloudfront.net/Sprite_Sheet/' +
          furnitureName +
          '_Variant' +
          2 +
          '.jpg' +
          "')";

        flag += 1;
      } else {
        spinner.style.backgroundImage =
          "url('" +
          'https://d3t7cnf9sa42u5.cloudfront.net/Sprite_Sheet/' +
          furnitureName +
          '_Variant' +
          variant +
          '.jpg' +
          "')";
      }
      rotateImageSpin.style.display = 'block';
    } else {
      loadImage();
    }
  }

  function showThreesixty() {
    ready = true;
    endFrame = -720;
  }

  function updateSpinner(frame) {
    const frameWidth = 525; // Width of a single frame in pixels
    const newPosition = frame * frameWidth; // Calculate the new background position
    spinner.style.backgroundPosition = `${newPosition}px 0`;
  }

  function render() {
    if (currentFrame !== endFrame) {
      var frameEasing =
        endFrame < currentFrame
          ? Math.floor((endFrame - currentFrame) * 0.1)
          : Math.ceil((endFrame - currentFrame) * 0.1);
      currentFrame += frameEasing;
      let frame = currentFrame;
      updateSpinner(frame);
    } else {
      window.clearInterval(ticker);
      ticker = 0;
    }
  }
  function refresh() {
    if (ticker === 0) {
      ticker = self.setInterval(render, Math.round(1000 / 60));
    }
  }
  function getPointerEvent(event) {
    return event.targetTouches ? event.targetTouches[0] : event;
  }
  spinContainer.addEventListener('pointerdown', function (event) {
    event.preventDefault();
    pointerStartPosX = getPointerEvent(event).pageX;
    dragging = true;
    spinner.style.cursor = 'grabbing';
    rotateImageSpin.style.display = 'none';
  });
  spinContainer.addEventListener('pointerup', function (event) {
    event.preventDefault();
    dragging = false;
    spinner.style.cursor = 'grab';
  });
  spinContainer.addEventListener('pointermove', function (event) {
    event.preventDefault();
    trackPointer(event);
  });
  function trackPointer(event) {
    var userDragging = ready && dragging ? true : false;
    if (userDragging) {
      pointerEndPosX = getPointerEvent(event).pageX;
      if (monitorStartTime < new Date().getTime() - monitorInt) {
        pointerDistance = pointerEndPosX - pointerStartPosX;
        endFrame =
          currentFrame +
          Math.ceil(
            (totalFrames - 1) *
              speedMultiplier *
              (pointerDistance / window.innerWidth)
          );
        refresh();
        monitorStartTime = new Date().getTime();
        pointerStartPosX = getPointerEvent(event).pageX;
      }
    } else {
      return;
    }
  }
  setTimeout(hideSpinner, 1000);
  function hideSpinner() {
    Spinner_container.style.display = 'none';
  }
}

export { threeSixtySpin };
