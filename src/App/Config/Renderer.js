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

    this.clearColor = '#000000';

    this.setInstance();
    this.setFog();
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

  setFog() {
    this.fog = new THREE.Fog(this.clearColor, 5, 15);
    if (!this.tests.active) {
      this.scene.fog = this.fog;
    }
  }

  setTests() {
    this.enableFog = false;
    this.tests.renderer.add(this.instance, 'useLegacyLights').name('LegacyLights');

    this.tests.renderer
      .addColor(this, 'clearColor')
      .onChange(() => {
        this.instance.setClearColor(this.clearColor);
        this.scene.fog.color.set(this.clearColor);
      })
      .name('FogColor');

    this.tests.renderer.add(this.fog, 'near', 0, 50, 0.01).name('FogNear');
    this.tests.renderer.add(this.fog, 'far', 0, 50, 0.01).name('FogFar');

    this.tests.renderer.add(this, 'enableFog').onChange(() => {
      if (this.enableFog) {
        this.scene.fog = this.fog;
      } else {
        this.scene.fog = null;
      }
    });
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  update() {
    if (this.camera.renderCamera === 'debug') {
      this.instance.render(this.scene, this.camera.debugCamera);
    } else {
      this.instance.render(this.scene, this.camera.instance);
    }
  }
}
