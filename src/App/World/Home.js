import * as THREE from 'three';
import App from '../App';

export default class Home {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.sizes = this.app.sizes;
    this.tests = this.app.tests;

    this.universalParams = {
      opacity: 1,
      transparent: false,
    };

    // This tells how big the home is
    this.buildingDepth =
      this.sizes.doorsCount +
      this.sizes.entranceDepth +
      this.sizes.fakeDoors / 2;

    this.setInstance();
    this.setGround();
    this.setInnerHall();

    if (this.tests.active) {
      this.setTests();
    }
  }

  setInstance() {
    this.instance = new THREE.Mesh(
      new THREE.BoxGeometry(20, 20, this.buildingDepth),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        side: THREE.DoubleSide,
      }),
    );

    this.instance.position.set(0, 10, -this.buildingDepth * 0.5);

    this.scene.add(this.instance);
  }

  setGround() {
    this.ground = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
      }),
    );

    this.ground.position.set(0, -0.01, 0); // to avoid z-conflect!
    this.ground.rotation.x = -Math.PI * 0.5;

    this.scene.add(this.ground);
  }

  setInnerHall() {
    this.innerHall = new THREE.Mesh(
      new THREE.BoxGeometry(2, 1.5, this.buildingDepth - 0.01),
      new THREE.MeshBasicMaterial({
        color: 0x000020,
        side: THREE.DoubleSide,
      }),
    );

    this.innerHall.position.set(0, 0.753, -this.buildingDepth * 0.5);

    this.scene.add(this.innerHall);
  }

  setTests() {
    this.tests.objectsOpacity = this.tests.world.addFolder('ObjectsOpacity');

    // Setting the ground to transparent
    this.ground.material.transparent = true;
    this.universalParams.transparent = true;

    const updateOpacity = () => {
      this.instance.material.opacity = this.universalParams.opacity;
      this.ground.material.opacity = this.universalParams.opacity;
      this.innerHall.material.opacity = this.universalParams.opacity;
      this.instance.material.transparent = this.universalParams.transparent;
      this.innerHall.material.transparent = this.universalParams.transparent;
      // This didn't work for some reaseon! So, the ground's transparent is true once tests are open
      // this.ground.material.transparent = this.universalParams.transparent;
    };
    updateOpacity();

    this.tests.objectsOpacity
      .add(this.universalParams, 'opacity', 0, 1, 0.01)
      .name('Opacity')
      .onFinishChange(updateOpacity);

    this.tests.objectsOpacity
      .add(this.universalParams, 'transparent')
      .name('Transparency')
      .onFinishChange(updateOpacity);
  }
}
