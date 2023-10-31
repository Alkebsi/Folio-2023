import * as THREE from 'three';
import App from '../App';

export default class Home {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.sizes = this.app.sizes;

    this.setInstance();
    this.setGround();
  }

  setInstance() {
    this.instance = new THREE.Mesh(
      new THREE.BoxGeometry(20, 20, this.sizes.doorsCount),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        side: THREE.DoubleSide,
      })
    );

    this.instance.position.set(0, 10, 0);

    this.scene.add(this.instance);
  }

  setGround() {
    this.ground = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
      })
    );
    this.ground.rotation.x = -Math.PI * 0.5;
    
    this.scene.add(this.ground);
  }
}
