import * as THREE from 'three';
import CameraControls from 'camera-controls';
import App from '../App';

CameraControls.install({ THREE });

export default class Controllers {
  constructor(scrollElement) {
    this.app = new App();
    this.canvas = this.app.canvas;
    this.logger = this.app.logger;
    this.camera = this.app.camera;
    this.interval = this.app.interval;
    this.sizes = this.app.sizes;
    this.tests = this.app.tests;

    this.scrollElement = scrollElement;
    this.isClicking = false;
    this.drag = { x: 0, y: 0 };

    window.addEventListener('scroll', () => {
      this.setScrollFunctionality();
    });

    this.setCameraControls();

    this.camera.addEventListener('toggleControllers', (e) => {
      if (e.message) {
        this.disableScrollFunc();
      } else {
        this.enableScrollFunc();
      }
    });
  }

  setScrollFunctionality() {
    const scrollPos = -(window.scrollY / this.sizes.height);

    // Loop back of the doors count is reached
    if (scrollPos <= -this.sizes.doorsCount * 0.5) {
      window.scrollTo(0, 0);
    }

    this.camera.instance.position.set(0, 0.75, scrollPos);
    // this.camera.lookAtObject.z = scrollPos - 2;
  }

  setCameraControls() {
    this.cameraControls = new CameraControls(this.camera.instance, this.canvas);
    this.cameraControls.minDistance = 1;
    this.cameraControls.maxDistance = 1;
    this.cameraControls.azimuthRotateSpeed = -0.3; // negative value to invert rotation direction
    this.cameraControls.polarRotateSpeed = -0.3; // negative value to invert rotation direction
    this.cameraControls.truckSpeed = 10;
    this.cameraControls.mouseButtons.wheel = null;
    this.cameraControls.touches.two = CameraControls.ACTION.TOUCH_TRUCK; // Check on mobile
    this.cameraControls.smoothTime = 200;
    this.cameraControls.draggingSmoothTime = 200;
    this.cameraControls.saveState();
  }

  disableScrollFunc() {
    this.logger.info('Scroll Functionality is disabled');
    this.scrollElement.style.display = 'none';
  }

  enableScrollFunc() {
    this.logger.info('Scroll Functionality is enabled');
    this.camera.instanceGroup.position.set(0, 0.75, 0);
    this.scrollElement.style.display = 'block';
  }

  update() {
    this.cameraControls.update(this.interval.delta);
  }
}
