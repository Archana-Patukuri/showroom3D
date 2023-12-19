const spinner = document.querySelector('.spinner1');
let spin_Label = document.getElementById('spin_Label1');
let spinsTableBtn = document.getElementById('spinsTableBtn');
let spinsBtn = document.getElementById('spinsBtn');
let Spinner_container = document.getElementById('Spinner_360_1');
let rotateImageSpin = document.getElementById('rotateImageSpin1');
let spinContainer=document.getElementById("spinnerContainer1")
function threeSixtySpinTable(furnitureName, variant, spin_description) {
  Spinner_container.style.display = 'block';
  spinsBtn.style.display = 'none';
  spinsTableBtn.style.display = 'block';

  spinner.classList.remove('spinnerUpdate');
  spinner.classList.add('spinnerUpdateTable');
  spin_Label.innerText = spin_description;
  let isDragging = false;
  let initialMouseX = 0;
  let initialBackgroundPosition = 0;

  spinner.style.backgroundImage =
    "url('" +
    'https://d3t7cnf9sa42u5.cloudfront.net/Sprite_Sheet/' +
    furnitureName +
    '_Variant' +
    variant +
    '.jpg' +
    "')";
  rotateImageSpin.style.display = 'block';
  setTimeout(hideSpinner, 1000);
  function hideSpinner() {
    Spinner_container.style.display = 'none';
  }
  spinContainer.addEventListener('pointerdown', (e) => {
    if (e.target === spinner) {
      // Check if the mouse down event is on the spinner element
      isDragging = true;
      initialMouseX = e.clientX;
      initialBackgroundPosition = getBackgroundPositionX();
      spinner.style.cursor = 'grabbing'; // Change cursor to indicate grabbing
      rotateImageSpin.style.display = 'none';
    }
  });

  spinContainer.addEventListener('pointermove', (e) => {
    if (isDragging) {
      const deltaX = e.clientX - initialMouseX;
      const frameWidth = 788; // Width of one frame
      const newFrame =
        Math.floor(-initialBackgroundPosition / frameWidth) + deltaX;
      const newBackgroundPosition = newFrame * frameWidth;
      setBackgroundPositionX(newBackgroundPosition);
    }
  });

  spinContainer.addEventListener('pointerup', () => {
    if (isDragging) {
      isDragging = false;
      spinner.style.cursor = 'grab';
      // Restore cursor style
    }
  });

  spinContainer.addEventListener('pointerdown', (e) => {
    if (e.target === spinner) {
      // Check if the mouse down event is on the spinner element
      isDragging = true;
      initialMouseX = e.clientX;
      initialBackgroundPosition = getBackgroundPositionX();
      spinner.style.cursor = 'grabbing'; // Change cursor to indicate grabbing
      rotateImageSpin.style.display = 'none';
    }
  });

  spinContainer.addEventListener('pointermove', (e) => {
    if (isDragging) {
      const deltaX = e.clientX - initialMouseX;
      const frameWidth = 788; // Width of one frame
      const newFrame =
        Math.floor(-initialBackgroundPosition / frameWidth) + deltaX;
      const newBackgroundPosition = newFrame * frameWidth;
      setBackgroundPositionX(newBackgroundPosition);
    }
  });

  spinContainer.addEventListener('pointerup', () => {
    if (isDragging) {
      isDragging = false;
      spinner.style.cursor = 'grab';
      // Restore cursor style
    }
  });

  function getBackgroundPositionX() {
    const computedStyle = window.getComputedStyle(spinner);
    const backgroundPosition = computedStyle.getPropertyValue(
      'background-position'
    );
    return parseFloat(backgroundPosition.split(' ')[0]);
  }

  function setBackgroundPositionX(positionX) {
    spinner.style.backgroundPositionX = positionX + 'px';
  }
}

export { threeSixtySpinTable };
