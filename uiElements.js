let spinsTableBtn = document.getElementById('spinsTableBtn');
let spinsBtn = document.getElementById('spinsBtn');
spinsBtn.addEventListener('click', function () {
  globalState.pauseRender = true;
  myModal1.classList.remove('show');
  myModal1.classList.add('fade');

  myModal.classList.remove('fade');
  myModal.classList.add('show');
});
spinsTableBtn.addEventListener('click', function () {
  globalState.pauseRender = true;

  myModal.classList.remove('show');
  myModal.classList.add('fade');

  myModal1.classList.remove('fade');
  myModal1.classList.add('show');
});

import eruda from 'eruda';
import globalState from './three_js/store/globalState';
const script = document.createElement('script');
script.src = '//cdn.jsdelivr.net/npm/eruda';
document.body.appendChild(script);
script.onload = () => {
  eruda.init();
  eruda.destroy();
};
const ConsoleObj = document.getElementById('Console');
ConsoleObj.addEventListener('change', function (e) {
  if (e.target.checked) {
    eruda.init();
  } else {
    eruda.destroy();
  }
});
