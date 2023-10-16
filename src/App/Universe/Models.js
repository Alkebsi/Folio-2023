import * as THREE from 'three';
import SiteManager from '../SiteManager';

export default class Models {
  constructor() {
    this.siteManager = new SiteManager();
    this.scene = this.siteManager.scene;

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
