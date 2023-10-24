import * as THREE from 'three';
import App from '../App';

export default class Models {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;

    this.setModels();
  }

  setModels() {
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );

    this.scene.add(box);
  }
}
