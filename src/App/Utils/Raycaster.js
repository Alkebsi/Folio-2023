import * as THREE from 'three';
import App from '../App';

export default class Raycaster {
  constructor() {
    this.app = new App();
    this.camera = this.app.camera;
    this.sizes = this.app.sizes;
    this.doors = this.app.world.doors;
    this.resources = this.app.resources;

    // Since I am in the raycaster file, door = intersecting door
    this.door = null;
    this.callOnce = true;

    this.instance = new THREE.Raycaster();
  }

  setIntersectionClicks() {
    // TODO: Change it so that it only works when the user clicks
    // Not on right click or dblclick? Make sure of the camera controls!
    // They were the ones causing this issue since the beginning
    window.addEventListener('contextmenu', () => {
      if (this.door) {
        this.door.rotation.y = Math.PI * 0.5;
      }
    });
  }

  setIntersections() {
    if (this.resources.ready) {
      this.intersections = this.instance.intersectObjects(this.doors.doorsGroup.children);

      if (
        this.intersections[0] &&
        this.intersections[0].object.name === 'Body' &&
        this.intersections[0].distance < 3
      ) {
        this.door = this.intersections[0].object;
      } else {
        this.door = null;
      }
    }
  }

  update() {
    if (this.resources.ready && this.callOnce) {
      this.setIntersectionClicks();
      this.callOnce = false;
    }
    this.instance.setFromCamera(this.sizes.mouseLocation, this.camera.instance);
    this.setIntersections();
  }
}
