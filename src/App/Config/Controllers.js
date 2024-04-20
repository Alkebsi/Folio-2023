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

    // TODO: Not being used anymore! Optimize the thing and remove this one
    this.scrollElement = scrollElement;
    this.isClicking = false;
    this.drag = { x: 0, y: 0 };

    // How deep will the user enter in the rooms
    this.entranceDepth = 3;

    // Controllers animation smooth time
    this.animationTime = 800;

    // Tells what type of camera controllers is active
    this.isRoomsControls = false;

    // Variables upon resize
    this.resize();

    /**
     * Note: Use this one to lock the pointer and you will
     * still have the movementX and movmentY of the cursor
     * to do a custom one. All in all, so it once ready
     * for the cursor and make sure to animate the cursor
     * element accourding to the movementX/Y not clientX/Y!
     */
    // Using pointer lock to have the user rotate freely
    // window.addEventListener('mousedown', () => {
    //   this.canvas.requestPointerLock();
    // });

    // To pervent the user from scrolling back
    this.oldScrollPosition = 0;
    window.addEventListener('scroll', () => {
      if (this.oldScrollPosition < window.scrollY) {
        this.setScrollFunctionality();
        this.oldScrollPosition = window.scrollY;
      } else {
        window.scrollTo(0, this.oldScrollPosition);
      }
    });

    // In times of a reload, the user should be at the start
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.setTimeout(() => {
      window.scrollTo(0, 0); // once the user reloads the page
    }, 1);

    this.setCameraControls();

    if (this.tests.active) {
      this.setTests();

      this.camera.addEventListener('camera', (e) => {
        if (e.message === 'debug') {
          this.disableScrollFunc();
          this.setDebugControls();
        } else if (e.message === 'production') {
          this.enableScrollFunc();
          this.setCameraControls();
        } else {
          this.logger.error('The camera controls was called with an unusuall properity');
        }
      });

      this.setScrollFunctionality(); // to set the camera position before scrolling!
    }
  }

  setScrollFunctionality() {
    this.scrollPos = -(window.scrollY / this.sizes.height);

    // Loop back if the doors count is reached
    if (this.scrollPos <= -Math.round(this.sizes.doorsCount / 2)) {
      window.scrollTo(0, 0);
    }

    this.cameraControls.moveTo(0, 0.7, this.scrollPos - 0.5, true);
    // this.camera.instanceGroup.position.set(0, 0.75, scrollPos);
    // this.camera.lookAtObject.z = scrollPos - 2;
  }

  setCameraControls() {
    this.cameraControls = new CameraControls(this.camera.instance, this.canvas);

    // this.cameraControls.minDistance = 1;
    // this.cameraControls.maxDistance = 1;

    this.cameraControls.maxAzimuthAngle = this.maxAzimuthAngle;
    this.cameraControls.minAzimuthAngle = this.minAzimuthAngle;
    this.cameraControls.azimuthRotateSpeed = -0.1; // negative value to invert rotation direction

    this.cameraControls.maxPolarAngle = Math.PI * 0.625;
    this.cameraControls.minPolarAngle = Math.PI * 0.375;
    this.cameraControls.polarRotateSpeed = -0.1; // negative value to invert rotation direction

    this.cameraControls.mouseButtons.wheel = CameraControls.ACTION.NONE;
    this.cameraControls.touches.two = CameraControls.ACTION.NONE;
    // this.cameraControls.truckSpeed = 10; // not needed as I managed the scrolling functionality

    this.cameraControls.smoothTime = 0; // Be careful when changing this as it will ruin the loop
    this.cameraControls.draggingSmoothTime = 200;

    this.cameraControls.moveTo(0, 0.7, 3, true);
    this.cameraControls.saveState();
  }

  // TODO: Commnet those lines once ready for production
  setDebugControls() {
    this.cameraControls = new CameraControls(this.camera.debugCamera, this.canvas);
    this.cameraControls.smoothTime = 200;
    this.cameraControls.draggingSmoothTime = 200;

    this.cameraControls.saveState();
  }

  disableScrollFunc() {
    this.logger.info('Scroll functionality is disabled');
    this.cameraControls.mouseButtons.wheel = null;
    this.cameraControls.mouseButtons.left = null;
    this.cameraControls.touches.one = null;
  }

  enableScrollFunc(scrollable) {
    this.logger.info('Scroll functionality is enabled');
    this.cameraControls.smoothTime = this.animationTime;

    if (scrollable) {
      this.cameraControls.mouseButtons.wheel = CameraControls.ACTION.NONE;
    }
    this.cameraControls.mouseButtons.left = CameraControls.ACTION.ROTATE;
    this.cameraControls.touches.one = CameraControls.ACTION.ROTATE;
  }

  // This funcitons is triggered from the raycaster class
  clicked(door) {
    this.clickedDoor = door;
    this.disableScrollFunc();

    // Animate to the room, then
    this.cameraControls.smoothTime = 200;
    this.setRoomEntranceAnimation();

    window.setTimeout(() => {
      this.setRoomStyleCameraControls();
    }, 2000);
  }

  setRoomEntranceAnimation() {
    // Just incase!
    if (!this.cameraControls) {
      this.logger.error('Called camera_to_the_room animation without setting the controls first!');
    }

    // Look at the doors
    this.cameraControls.setLookAt(
      // Camera Position
      -this.clickedDoor.parent.position.x / 1.1,
      0.7,
      this.clickedDoor.parent.position.z,

      // Target
      this.clickedDoor.parent.position.x / 1000,
      0.7,
      this.clickedDoor.parent.position.z,

      // enableTransitions
      true,
    );

    // Enter the room
    window.setTimeout(() => {
      this.cameraControls.setLookAt(
        // Camera Position
        -this.clickedDoor.parent.position.x * -this.entranceDepth,
        0.7,
        this.clickedDoor.parent.position.z,

        // Target
        -this.clickedDoor.parent.position.x * -(this.entranceDepth + 0.01),
        0.7,
        this.clickedDoor.parent.position.z,

        // enableTransitions
        true,
      );
    }, 1300 + this.animationTime);

    // Go right in front of the entrance door
    window.setTimeout(() => {
      this.cameraControls.setLookAt(
        // Camera Position
        0,
        0.7,
        3,

        // Target
        0,
        0.7,
        3.01,

        // enableTransitions
        false,
      );
    }, 2400 + this.animationTime);
  }

  // Triggered once the user enters a room
  setRoomStyleCameraControls() {
    // Just incase!
    if (!this.cameraControls) {
      this.logger.error('Called the room camera controls without setting the controls first!');
    }

    this.isRoomsControls = true;

    // First thing to do, enable the controls
    this.enableScrollFunc(false);

    this.cameraControls.minAzimuthAngle = -Infinity;
    this.cameraControls.maxAzimuthAngle = Infinity;

    this.cameraControls.maxPolarAngle = Math.PI;
    this.cameraControls.minPolarAngle = -Math.PI;
  }

  setTests() {
    this.tests.controllers = this.tests.gui.addFolder('Controllers');
    this.tests.camCons = this.tests.controllers.addFolder('Camera');

    this.tests.camCons
      .add(this.cameraControls, 'maxAzimuthAngle', -Math.PI * 2, Math.PI * 2, 0.001)
      .name('MaxAzAngle');
    this.tests.camCons
      .add(this.cameraControls, 'minAzimuthAngle', -Math.PI * 2, Math.PI * 2, 0.001)
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
    this.tests.camCons.add(this.cameraControls, 'polarRotateSpeed', -1, 1, 0.001);

    this.tests.camCons
      .add(this.cameraControls, 'draggingSmoothTime', 0, 1000, 1)
      .name('DragSmooth');
  }

  resize() {
    /**
     * Note: TODO: This is going to create many bugs once the user goes
     * back to the hall to view other rooms. So, better you check it often
     * and delete this comment once things are fine
     */
    if (this.sizes.isPortrait) {
      this.maxAzimuthAngle = Math.PI * 0.25;
      this.minAzimuthAngle = -Math.PI * 0.25;

      if (!this.isRoomsControls && this.cameraControls) {
        this.cameraControls.maxAzimuthAngle = this.maxAzimuthAngle;
        this.cameraControls.minAzimuthAngle = this.minAzimuthAngle;
      } else if (this.isRoomsControls && this.cameraControls) {
        // console.log('You changed to portrait mode while you are inside a room');
      } else {
        // console.log('Called for the first time and set the min and max azurize!!!');
      }
    } else {
      this.maxAzimuthAngle = Math.PI * 0.2;
      this.minAzimuthAngle = -Math.PI * 0.2;
      if (!this.isRoomsControls && this.cameraControls) {
        this.cameraControls.maxAzimuthAngle = this.maxAzimuthAngle;
        this.cameraControls.minAzimuthAngle = this.minAzimuthAngle;
      } else if (this.isRoomsControls && this.cameraControls) {
        // console.log('You changed to landscape mode while you are inside a room');
      } else {
        // console.log('Called for the first time and set the min and max azurize!!!');
      }
    }
  }

  update() {
    this.cameraControls.update(this.interval.delta);
  }
}
