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

    if (this.tests.active) {
      this.camera.addEventListener('debug', (e) => {
        if (e.message) {
          this.disableScrollFunc();
          this.setDebugControls();
          console.log('debugging');
        } else {
          this.enableScrollFunc();
          this.setCameraControls();
          console.log('nothing');
        }
      });

      this.setTests();
    }
  }

  setScrollFunctionality() {
    const scrollPos = -(window.scrollY / this.sizes.height);

    // Loop back of the doors count is reached
    if (scrollPos <= -this.sizes.doorsCount * 0.5) {
      window.scrollTo(0, 0);
    }

    this.cameraControls.moveTo(0, 0.75, scrollPos, true);
    // this.camera.instanceGroup.position.set(0, 0.75, scrollPos);
    // this.camera.lookAtObject.z = scrollPos - 2;
  }

  setCameraControls() {
    console.log('setCameraControls is working now');
    this.cameraControls = new CameraControls(this.camera.instance, this.canvas);

    this.cameraControls.minDistance = 1;
    this.cameraControls.maxDistance = 1;

    this.cameraControls.maxAzimuthAngle = Math.PI * 0.25;
    this.cameraControls.minAzimuthAngle = -Math.PI * 0.25;
    this.cameraControls.azimuthRotateSpeed = -0.1; // negative value to invert rotation direction

    this.cameraControls.maxPolarAngle = Math.PI * 0.625;
    this.cameraControls.minPolarAngle = Math.PI * 0.375;
    this.cameraControls.polarRotateSpeed = -0.1; // negative value to invert rotation direction

    this.cameraControls.mouseButtons.wheel = CameraControls.ACTION.NONE;
    this.cameraControls.touches.two = CameraControls.ACTION.NONE;
    // this.cameraControls.truckSpeed = 10; // not needed as I manage the scrolling functionality

    this.cameraControls.smoothTime = 0; // This should not be changed!
    this.cameraControls.draggingSmoothTime = 200;

    this.cameraControls.moveTo(0, 0.75, 3, true);
    this.cameraControls.saveState();
  }

  setDebugControls() {
    this.cameraControls = new CameraControls(this.camera.debugCamera, this.canvas);
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
    this.scrollElement.style.display = 'block';
  }

  setTests() {
    this.tests.controllers = this.tests.gui.addFolder('Controllers');
    this.tests.camCons = this.tests.controllers.addFolder('Camera');

    this.tests.camCons
      .add(
        this.cameraControls,
        'maxAzimuthAngle',
        -Math.PI * 2,
        Math.PI * 2,
        0.001,
      )
      .name('MaxAzAngle');
    this.tests.camCons
      .add(
        this.cameraControls,
        'minAzimuthAngle',
        -Math.PI * 2,
        Math.PI * 2,
        0.001,
      )
      .name('MinAzAngle');
    this.tests.camCons
      .add(this.cameraControls, 'azimuthRotateSpeed', -1, 1, 0.001)
      .name('RotateSpeed');

    this.tests.camCons
      .add(this.cameraControls, 'maxPolarAngle', -Math.PI, Math.PI, 0.001)
      .name('MaxPoAngle');
    this.tests.camCons
      .add(this.cameraControls, 'minPolarAngle', -Math.PI, Math.PI, 0.001)
      .name('MinPoAngle');
    this.tests.camCons.add(
      this.cameraControls,
      'polarRotateSpeed',
      -1,
      1,
      0.001,
    );

    this.tests.camCons
      .add(this.cameraControls, 'draggingSmoothTime', 0, 1000, 1)
      .name('DragSmooth');

    this.tests.controllers.add(this.sizes, 'doorsCount', 0, 1000, 1);
  }

  update() {
    this.cameraControls.update(this.interval.delta);
  }
}
