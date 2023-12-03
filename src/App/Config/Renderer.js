import * as THREE from 'three';
import App from '../App';

export default class Renderer {
  constructor() {
    this.app = new App();
    this.sizes = this.app.sizes;
    this.camera = this.app.camera;
    this.canvas = this.app.canvas;
    this.scene = this.app.scene;
    this.tests = this.app.tests;

    this.clearColor = '#ff0000';

    this.setInstance();
    if (this.tests.active) {
      this.setTests();
    }
  }

  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      // logarithmicDepthBuffer: true,
      powerPreference: 'high-performance',
      antialias: true,
    });
    this.instance.outputColorSpace = THREE.SRGBColorSpace;
    // this.instance.toneMapping = THREE.CineonToneMapping;
    // this.instance.toneMappingExposure = 3.5;
    this.instance.setClearColor(this.clearColor);
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  setTests() {
    this.tests.renderer = this.tests.gui.addFolder('Renderer');

    // this.tests.renderer
    // .add(this.instance, 'toneMappingExposure', 0, 10, 0.001);
    this.tests.renderer
      .add(this.instance, 'useLegacyLights')
      .name('LegacyLights');

    this.tests.renderer.addColor(this, 'clearColor').onChange(() => {
      this.instance.setClearColor(this.clearColor);
    });
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  update() {
    this.instance.render(this.scene, this.camera.instance);
  }
}
