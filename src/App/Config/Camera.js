import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import App from '../App';

export default class Camera extends THREE.EventDispatcher {
  constructor() {
    super();
    this.app = new App();
    this.scene = this.app.scene;
    this.sizes = this.app.sizes;
    this.canvas = this.app.canvas;
    this.tests = this.app.tests;

    this.lookAtObject = new THREE.Vector3(0, 0.75, 0);
    
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
      10000
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

    this.instance.position.set(0, 0.75, 3);
    this.instanceGroup.add(this.instance);
    this.scene.add(this.instanceGroup);
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
    this.controls.enabled = false;
  }

  setTests() {
    this.tests.camera = this.tests.world.addFolder("Camera");

    this.tests.camera
      .add(this.controls, 'enabled')
      .name('OrbitControls')
      .onChange(() => {
        console.warn('the scroll functionality should stop working');
        this.dispatchEvent('ToggleControllers');
      });
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    if (this.controls.enabled) {
      this.controls.update();
    } else {
      this.instance.lookAt(this.lookAtObject);
    }
  }
}
