import * as THREE from 'three';
import App from '../App';

export default class Doors {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;

    this.setEnteranceDoor();
  }

  setEnteranceDoor() {
    this.enteranceDoor = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 1, 0.1),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );

    this.enteranceDoor.position.set(0, 0.5, 0.5);

    this.scene.add(this.enteranceDoor);
  }
}
