import * as THREE from 'three';
import SiteManager from '../SiteManager';

export default class Door {
  constructor() {
    this.siteManager = new SiteManager();
    this.scene = this.siteManager.scene;

    this.setInstance();
  }

  setInstance() {
    this.instance = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );

    this.instance.position.set(0, 0.5, 0.1);

    this.scene.add(this.instance);
  }
}
