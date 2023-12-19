import { LoadingManager } from 'three';
function loadingManager(){
    const manager = new LoadingManager();
    manager.onError = function (url) {
        console.log('There was an error loading gltf model' + url);
    };
    return manager
}
export {loadingManager}