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
      100,
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
    this.debugCamera.position.set(4, 4, -4);
    this.scene.add(this.debugCamera);
  }

  setTests() {
    this.setDebuggingNeeds();

    this.tests.renderer = this.tests.gui.addFolder('Renderer');
    this.tests.renderer
      .add(this, 'renderCamera', {
        DebugMode: 'debug',
        ProMode: 'production',
      })
      .onChange(() => {
        if (this.renderCamera === 'debug') {
          this.dispatchEvent({ type: 'debug', message: 'debugging' });
        } else {
          this.dispatchEvent({ type: 'debug', message: null });
        }
      });
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {}
}
