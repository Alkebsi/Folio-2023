import * as THREE from 'three';
import SiteManager from '../SiteManager';
import Floor from './Floor';
import Models from './Models';

export default class Universe {
  constructor() {
    this.siteManager = new SiteManager();
    this.scene = this.siteManager.scene;
    this.tests = this.siteManager.tests;

    this.axis = new THREE.AxesHelper(1, 1, 1);
    this.scene.add(this.axis);

    this.floor = new Floor();
    this.models = new Models();
  }

  resize() {}

  update() {}
}
