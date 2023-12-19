// import modelLoader from '../components/gltf_loader/modelLoader';
import { gltfLoad } from '../components/gltf_loader/gltfLoad';
import assets from '../dataBase/assets.json';
let Spinner = document.getElementById('Spinner');
export default class PreloadModels {
  constructor() {
    // this.loadInitialModels();
    this.accessoryData = [];
    this.initialAccessoryModels = [
      /*  {
        name: 'pots',
        url: 'https://d1asmhoz5zfmcr.cloudfront.net/compressed_models/vase/Flower_Pot_draco.glb',
      },
      {
        name: 'frames',
        url: 'https://d1asmhoz5zfmcr.cloudfront.net/compressed_models/Accessories/Frames_Without_Glass1.glb',
      },
      {
        name: 'mirror',
        url: 'https://d1asmhoz5zfmcr.cloudfront.net/compressed_models/mirror/mirror_draco.glb',
      }, */
       {
         name: 'cylindricalLight',
         url: assets.Lights_2[0].URL,
       },
      {
        name: 'Desktop',
        url: assets.Lights[0].URL,
      },
    ];
      this.loadInitialAccessoryModels();
  }

  loadInitialAccessoryModels() {
    this.initialAccessoryModels.forEach(async (item) => {
       Spinner.style.display = 'block';
      const { gltfData } = await gltfLoad(item.url);
      // console.log(`loading ${item.name} in class implimentation `);
      this.accessoryData.push({ name: item.name, model: gltfData });
       Spinner.style.display = 'none';
    });
    return null;
  }

  async getAccessory(modelName) {
      Spinner.style.display = 'block';
    const { model } = this.accessoryData.find(
      (item) => item.name === modelName
    );
    if (!model) {
      alert('no model');
      return null;
    }
     Spinner.style.display = 'none';
    return model;
  }

  /* async loadInitialModels() {
    // this.loadInitialAccessoryModels();

    this.roomModelUrl =
      'https://d1asmhoz5zfmcr.cloudfront.net/compressed_models/Room/Room_Variants_latest1.glb';
    const { gltfData } = await modelLoader(this.roomModelUrl);
    return gltfData;
  } */
}
