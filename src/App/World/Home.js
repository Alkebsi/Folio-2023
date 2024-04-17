import * as THREE from 'three';
import App from '../App';

export default class Home {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.sizes = this.app.sizes;
    this.tests = this.app.tests;

    this.universalParams = {
      opacity: 0.5,
      transparent: false,
    };

    // This tells how deep the home is
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
    this.frontWallTopSide = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 3.8), this.wallsMaterial);
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
      new THREE.PlaneGeometry(2.1, this.buildingDepth),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
      }),
    );

    // The Y axis was set to -0.01 to avoid z-conflect
    this.ground.position.set(0, -0.01, -this.buildingDepth / 2 + this.sizes.entranceDepth - 1.2);
    this.ground.rotation.x = -Math.PI * 0.5;

    // Ceiling
    this.ceiling = this.ground.clone();
    this.ceiling.position.y = 5;
    this.ceiling.position.z -= this.sizes.entranceDepth - 1.3;
    this.ceiling.scale.setScalar(-1);

    this.instance = new THREE.Group();
    this.instance.add(this.frontWall, this.ground, this.ceiling);
    this.scene.add(this.instance);

    /**
     * Note: Door walls were created in the Doors.js
     * file to have them aligned with each door.
     */
  }

  setTests() {
    this.tests.objectsOpacity = this.tests.world.addFolder('ObjectsOpacity');

    // Setting the materials to transparent
    this.universalParams.transparent = true;
    this.ground.material.transparent = this.universalParams.transparent;
    this.wallsMaterial.transparent = this.universalParams.transparent;

    const updateOpacity = () => {
      this.wallsMaterial.opacity = this.universalParams.opacity;
      this.ground.material.opacity = this.universalParams.opacity;
    };
    updateOpacity();

    this.tests.objectsOpacity
      .add(this.universalParams, 'opacity', 0, 1, 0.01)
      .name('HomeOpacity')
      .onFinishChange(updateOpacity);
  }
}
