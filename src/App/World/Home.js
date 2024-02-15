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

    // Walls
    this.frontWallRightSide = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 5), this.wallsMaterial);
    this.frontWallRightSide.position.set(0.65, 2.5, 0.1);
    this.frontWallLeftSide = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 5), this.wallsMaterial);
    this.frontWallLeftSide.position.set(-0.65, 2.5, 0.1);
    this.frontWallTopSide = new THREE.Mesh(new THREE.PlaneGeometry(0.60, 3.8), this.wallsMaterial);
    this.frontWallTopSide.position.set(0, 3.1, 0.1);

    this.innerRightWall = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 5), this.wallsMaterial);
    this.innerRightWall.position.set(1, 2.5, -0.025);
    this.innerRightWall.rotation.set(0, -Math.PI * 0.5, 0);

    this.innerLeftWall = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 5), this.wallsMaterial);
    this.innerLeftWall.position.set(-1, 2.5, -0.025);
    this.innerLeftWall.rotation.set(0, Math.PI * 0.5, 0);

    this.frontWall = new THREE.Group();
    this.frontWall.add(
      this.frontWallRightSide,
      this.frontWallLeftSide,
      this.frontWallTopSide,
      this.innerRightWall,
      this.innerLeftWall,
    );

    // Ground
    this.ground = new THREE.Mesh(
      new THREE.PlaneGeometry(2.1, 50),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
      }),
    );

    this.ground.position.set(0, -0.01, -22); // to avoid z-conflect!
    this.ground.rotation.x = -Math.PI * 0.5;

    // Ceiling
    this.ceiling = this.ground.clone();
    this.ceiling.position.y = 5;
    this.ceiling.position.z -= 2.9;
    this.ceiling.scale.setScalar(-1);

    this.instance = new THREE.Group();
    this.instance.add(this.frontWall, this.ground, this.ceiling);
    this.scene.add(this.instance);
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
