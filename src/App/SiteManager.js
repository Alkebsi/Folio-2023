// Three.js
import { Scene } from 'three';

// Utils
import Tests from './Utils/Tests';
import Sizes from './Utils/Sizes';
import Interval from './Utils/Interval';

// Three.js Configurations
import Camera from './Config/Camera';
import Renderer from './Config/Renderer';
import LoadingMgr from './Config/LoadingMgr';

// Three.js Visual Assets
import Universe from './Universe/Universe';

let instance = null; // this is the variable used inside the SiteManager class

export default class SiteManager {
  constructor(canvas) {
    // Global variables
    // window.siteManager = this; // indeed not in need

    // Checking if it was called once before
    if (instance) {
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
    this.loadingMgr = new LoadingMgr();
    this.universe = new Universe();

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

    // Finall Log
    console.log('Site is ready');
  }

  // Called once the page is resized
  resize() {
    this.sizes.resize();
    this.camera.resize();
    this.renderer.resize(); // This line is a must
    this.loadingMgr.resize();
    this.universe.resize();
  }

  // Called every frame (60fps)
  update() {
    if (this.tests.active) {
      this.tests.stats.begin();
      this.interval.update();
      this.camera.update();
      this.universe.update();
      this.renderer.update(); // Not in need if passes are being used.
      this.tests.stats.end();
    } else {
      this.interval.update();
      this.camera.update();
      this.universe.update();
      this.renderer.update(); // Not in need if passes are being used.
    }

    requestAnimationFrame(() => {
      this.update();
    });
  }
}