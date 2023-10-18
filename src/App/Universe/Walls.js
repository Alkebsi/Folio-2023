import * as THREE from 'three';
import SiteManager from '../SiteManager';

export default class Walls {
  constructor() {
    this.siteManager = new SiteManager();
    this.scene = this.siteManager.scene;

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
