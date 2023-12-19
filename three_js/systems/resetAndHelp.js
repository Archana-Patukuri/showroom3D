import { Vector3 } from 'three';

function distanceVector(v1, v2) {
  const dx = v1.x - v2.x;
  const dy = v1.y - v2.y;
  const dz = v1.z - v2.z;

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
function resetAndHelp(camera,cameraControls){
    let reset=document.getElementById("Reload");
    async function reset_Fun(){
      let myPromise = new Promise(function(resolve) {
        window.location.reload(true);    
      });
      await myPromise;  
    }      
   
    async function ResetView_Fun(){
      let myPromise = new Promise(function(resolve) {        
        // camera.position.set(0.01,1.5,4.7);                  
        if (distanceVector(new Vector3(0.01, 1.5, 5), camera.position) < 0.1) {
          return;
        }
        camera.position.lerp(new Vector3(0.01, 1.5, 5), 0.1);
        cameraControls.target.lerp(new Vector3(0, 1.5, 0), 0.1);
        requestAnimationFrame(ResetView_Fun);

      });
      await myPromise;  
    }      
    let reset_Desktop=document.getElementById("reset_Desktop")
    reset_Desktop.onclick = function() {
      ResetView_Fun()
    }      
  
    document.addEventListener("keydown", onDocumentKeyDown, false);
    async function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 27) {
      ResetView_Fun()
    } 
  }
    async function Help_Fun(){
      let myPromise = new Promise(function(resolve) {
        window.open("../../help.html");   
      });
      await myPromise;  
    }      

  
    let help3DButton=document.getElementById("help3DButton")
    help3DButton.addEventListener("click",function(){
      Help_Fun()
    })    
}
export {resetAndHelp};