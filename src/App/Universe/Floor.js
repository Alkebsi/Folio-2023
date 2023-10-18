import * as THREE from 'three';
import SiteManager from '../SiteManager';

export default class Floor {
  constructor() {
    this.siteManger = new SiteManager();
    this.scene = this.siteManger.scene;

    this.setInstance();
  }

  setInstance() {
    this.floorGeometry = new THREE.PlaneGeometry(100, 100, 16, 16);
    this.floorMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

    this.floor = new THREE.Mesh(this.floorGeometry, this.floorMaterial);
    this.floor.rotation.set(-Math.PI * 0.5, 0, 0);

    this.scene.add(this.floor);
  }
}
