import * as THREE from 'three';
import App from '../App';

export default class Home {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;

    this.setInstance();
  }

  setInstance() {
    this.instance = new THREE.Mesh(
      new THREE.BoxGeometry(20, 20, 1),
      new THREE.MeshBasicMaterial({color: 0x000000})
    );

    this.instance.position.set(0, 10, 0);

    this.scene.add(this.instance);
  }
}
