import * as THREE from 'three';
import App from '../App';

export default class Home {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.sizes = this.app.sizes;
    this.tests = this.app.tests;

    this.universalParams = {
      opacity: 0.7,
      transparent: false,
    };

    // This tells how big the home is
    this.buildingDepth =
      this.sizes.doorsCount + this.sizes.entranceDepth + this.sizes.fakeDoors / 2;

    this.setInstance();
    this.setGround();
    if (this.tests.active) {
      this.setTests();
    }
  }

  setInstance() {
    this.wallsMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide,
      transparent: this.universalParams.transparent,
      opacity: this.universalParams.opacity,
    });

    this.frontWallRightSide = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.wallsMaterial);
    this.frontWallRightSide.position.set(1.32, 1, 0);
    this.frontWallLeftSide = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.wallsMaterial);
    this.frontWallLeftSide.position.set(-1.32, 1, 0);
    this.frontWallTopSide = new THREE.Mesh(new THREE.PlaneGeometry(0.64, 0.8), this.wallsMaterial);
    this.frontWallTopSide.position.set(0, 1.6, 0);

    this.frontWall = new THREE.Group();
    this.frontWall.add(
      this.frontWallRightSide,
      this.frontWallLeftSide,
      this.frontWallTopSide,
    );

    this.instance = new THREE.Group();
    this.instance.add(this.frontWall);
    this.scene.add(this.instance);
  }

  setGround() {
    this.ground = new THREE.Mesh(
      new THREE.PlaneGeometry(4.6, 50),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
      }),
    );

    this.ground.position.set(0, -0.01, -22); // to avoid z-conflect!
    this.ground.rotation.x = -Math.PI * 0.5;

    this.scene.add(this.ground);
  }

  setTests() {
    this.tests.objectsOpacity = this.tests.world.addFolder('ObjectsOpacity');

    // Setting the ground to transparent
    this.ground.material.transparent = true;
    this.universalParams.transparent = true;

    const updateOpacity = () => {
      this.wallsMaterial.opacity = this.universalParams.opacity;
      this.ground.material.opacity = this.universalParams.opacity;
      this.wallsMaterial.transparent = this.universalParams.transparent;
      // This didn't work for some reaseon! So, the ground's transparent is true once tests are open
      // this.ground.material.transparent = this.universalParams.transparent;
    };
    updateOpacity();

    this.tests.objectsOpacity
      .add(this.universalParams, 'opacity', 0, 1, 0.01)
      .name('HomeOpacity')
      .onFinishChange(updateOpacity);

    this.tests.objectsOpacity
      .add(this.universalParams, 'transparent')
      .name('HomeTransparency')
      .onFinishChange(updateOpacity);
  }
}
