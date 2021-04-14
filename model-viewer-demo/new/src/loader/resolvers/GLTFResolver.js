import {Loader} from "three";

export class GLTFResolver implements Loader {
  constructor(){

    this.type = 'glb'
  }

  // resolve(item) {
  //   return new Promise(resolve => {
  //     this.loader.load(item.url, scene => {
  //       resolve(Object.assign(item, {scene: scene}))
  //     })
  //   })
//  }

  get(item) {
    return item.scene
  }
}
