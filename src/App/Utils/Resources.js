import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import App from '../App';
import Logger from './Logger';

export default class Resources {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.interval = this.app.interval;
    this.logger = new Logger();
    this.sizes = this.app.sizes;

    this.ready = false;
    this.progress = 0;

    this.setResources();
  }

  setResources() {
    this.loadingManager = new THREE.LoadingManager(
      () => {
        this.logger.info('Elements Loaded');
        this.ready = true;
      },
      (itemURL, loadedItems, totalItems) => {
        this.progress = Math.round((loadedItems / totalItems) * 100);
        this.logger.info(`Loaded ${this.progress}%`);
      },
      (error) => {
        this.logger.error(`There was an error loading the models: ${error}`);
      },
    );

    this.gltfLoader = new GLTFLoader(this.loadingManager);

    // Must-have textures & images
    this.textureLoader = new THREE.TextureLoader(this.loadingManager);
    // Lazy-loading textures & images
    this.imagesLoader = new THREE.TextureLoader();
  }

  setLoadingScene() {
    // Creating a circle where clicked
    this.addCircle = () => {
      // Recalculating the mouse location
      this.cursor = {
        x: (this.sizes.mouseLocation.x * 0.5 + 0.5) * this.sizes.width,
        y: (-this.sizes.mouseLocation.y * 0.5 + 0.5) * this.sizes.height,
      };

      // console.log(this.cursor.x);

      this.circle = `
        <circle class="circles" cx="${this.cursor.x}" cy="${this.cursor.y}" r="40" />
      `;

      if (this.loadingSVGContainer.children.length < 50) {
        this.loadingSVGContainer.innerHTML += this.circle;
      }
    };
    window.addEventListener('click', () => {
      this.addCircle();
    });
  }

  resize() {
    this.loadingSVGContainer.setAttribute(
      'viewBox',
      `0 0 ${this.sizes.width} ${this.sizes.height}`,
    );

    this.cursor = {
      x: (this.sizes.mouseLocation.x * 0.5 + 0.5) * this.sizes.width,
      y: (-this.sizes.mouseLocation.y * 0.5 + 0.5) * this.sizes.height,
    };
  }
}
