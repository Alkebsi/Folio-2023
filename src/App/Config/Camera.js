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
    this.renderCamera = 'production';

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
      1000,
    );

    this.instance.position.set(0, 0, this.EPS);
    this.instanceGroup.add(this.instance);
    this.instanceGroup.position.set(0, 0, 0);
    this.scene.add(this.instanceGroup);
  }

  setDebuggingNeeds() {
    this.debugCamera = new THREE.PerspectiveCamera(
      45,
      this.sizes.width / this.sizes.height,
      0.01,
      100,
    );
    this.debugCamera.position.set(4, 4, 4);
    this.scene.add(this.debugCamera);

    this.mainCameraHelper = new THREE.CameraHelper(this.instance);
    this.scene.add(this.mainCameraHelper);
  }

  setTests() {
    this.setDebuggingNeeds();

    this.tests.renderer = this.tests.gui.addFolder('Renderer');

    // window.setTimeout(() => {
    //   this.renderCamera = 'debug';
    //   this.dispatchEvent({ type: 'camera', message: 'debug' });
    // }, 0);

    // TODO: Commnet those lines once ready for production
    const cameraTests = {
      toggle: () => {
        this.renderCamera = 'debug';
        this.dispatchEvent({ type: 'camera', message: 'debug' });
      },
    };
    this.tests.renderer
      .add(cameraTests, 'toggle')
      .name('DebugMode')
      .onChange(() => {
        // TODO: Remove the dat elements once clicked
        // this.tests.renderer.remove();
      });
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
    if (this.tests.active) {
      this.debugCamera.aspect = this.sizes.width / this.sizes.height;
      this.debugCamera.updateProjectionMatrix();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  update() {}
}
