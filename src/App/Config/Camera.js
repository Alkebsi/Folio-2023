import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import SiteManager from '../SiteManager';

export default class camera {
  constructor() {
    this.siteManager = new SiteManager();
    this.scene = this.siteManager.scene;
    this.sizes = this.siteManager.sizes;
    this.canvas = this.siteManager.canvas;
    this.tests = this.siteManager.tests;

    this.setInstance();
    this.setOrbitControls();
    if (this.tests.active) {
      this.setTests();
    }
  }

  setInstance() {
    this.instanceGroup = new THREE.Group();
    this.instance = new THREE.PerspectiveCamera(
      45,
      this.sizes.width / this.sizes.height,
      0.01,
      100
    );
    this.instance.position.set(10, 5, 10);
    this.instanceGroup.add(this.instance);
    this.scene.add(this.instanceGroup);
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
    this.controls.enabled = true;
  }

  setTests() {}

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
  }
}
