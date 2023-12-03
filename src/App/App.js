// Three.js
import { Scene } from 'three';

// Utils
import Tests from './Utils/Tests';
import Sizes from './Utils/Sizes';
import Interval from './Utils/Interval';

// Three.js Configurations
import Camera from './Config/Camera';
import Renderer from './Config/Renderer';

// Three.js Visual Assets
import World from './World/World';
import Controllers from './Config/Controllers';

let instance = null; // this is the variable used inside the SiteManager class

export default class App {
  constructor(canvas, scrollElement) {
    // Checking if it was called once before
    if (instance) {
      // eslint-disable-next-line no-constructor-return
      return instance;
    }
    instance = this;

    // Parameters
    this.canvas = canvas;

    // Fetching Utils
    this.tests = new Tests();
    this.sizes = new Sizes();
    this.interval = new Interval();

    // Creating the Scene
    this.scene = new Scene();

    // Fetching Three.js Elements
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.world = new World();
    this.controllers = new Controllers(scrollElement);

    // Calling Methods
    window.addEventListener('dblclick', () => {
      this.sizes.fullScreen();
    });
    window.addEventListener('resize', () => {
      this.resize();
    });
    requestAnimationFrame(() => {
      this.update();
    });

    if (this.tests.active) {
      window.app = this; // needed for testing only
    }

    // Finall Log
    console.log('Site is ready');
  }

  // Called once the page is resized
  resize() {
    this.sizes.resize();
    this.camera.resize();
    this.renderer.resize(); // This line is a must
    this.world.resize();
  }

  // Called every frame (60fps)
  update() {
    if (this.tests.active) {
      this.tests.stats.begin();
      this.interval.update();
      this.camera.update();
      this.world.update();
      this.renderer.update(); // Not in need if passes are being used.
      this.tests.stats.end();
    } else {
      this.interval.update();
      this.camera.update();
      this.world.update();
      this.renderer.update(); // Not in need if passes are being used.
    }

    requestAnimationFrame(() => {
      this.update();
    });
  }
}
