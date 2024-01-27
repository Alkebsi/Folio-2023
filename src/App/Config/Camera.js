import * as THREE from 'three';
import App from '../App';

export default class Camera extends THREE.EventDispatcher {
  constructor() {
    super();
    this.app = new App();
    this.scene = this.app.scene;
    this.sizes = this.app.sizes;
    this.canvas = this.app.canvas;
    this.tests = this.app.tests;

    this.EPS = 1e-5;

    this.setInstance();
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
      100,
    );

    // Added a testing orthographic camera to my scene with
    // wrong vlaues, yet did the work!
    // this.instance = new THREE.OrthographicCamera(
    //   -400,
    //   400,
    //   400,
    //   -400,
    //   1,
    //   1000
    // );

    this.instance.position.set(0, 0, this.EPS);
    this.instanceGroup.add(this.instance);
    this.instanceGroup.position.set(0, 0, 0);
    this.scene.add(this.instanceGroup);
  }

  setTests() {}

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {}
}
