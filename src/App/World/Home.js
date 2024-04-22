import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
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
    const frontRightWall = new THREE.PlaneGeometry(0.7, 5);
    const frontLeftWall = frontRightWall.clone();
    const frontTopWall = new THREE.PlaneGeometry(0.6, 3.8);
    const innerRightWall = new THREE.PlaneGeometry(0.25, 5);
    const innerLeftWall = new THREE.PlaneGeometry(0.25, 5);

    const ground = new THREE.PlaneGeometry(2.1, this.buildingDepth);
    const ceiling = ground.clone();
    // this.ceiling.position.y = 5;
    // this.ceiling.position.z -= this.sizes.entranceDepth - 1.3;

    innerRightWall.rotateY(Math.PI / 2);
    innerLeftWall.rotateY(Math.PI / 2);

    ground.rotateX(-Math.PI / 2);
    ceiling.rotateX(-Math.PI / 2);

    frontRightWall.translate(0.65, 2.5, 0.1);
    frontLeftWall.translate(-0.65, 2.5, 0.1);
    frontTopWall.translate(0, 3.1, 0.1);
    innerRightWall.translate(1, 2.5, -0.025);
    innerLeftWall.translate(-1, 2.5, -0.025);

    ground.translate(0, -0.01, -this.buildingDepth / 2 + this.sizes.entranceDepth - 1.2);
    ceiling.translate(0, 5, -this.buildingDepth / 2 + this.sizes.entranceDepth - 2.9);

    const finalGeometry = mergeGeometries([
      frontRightWall,
      frontLeftWall,
      frontTopWall,
      innerRightWall,
      innerLeftWall,
      ground,
      ceiling,
    ]);

    this.instance = new THREE.Mesh(finalGeometry, this.wallsMaterial);
    this.scene.add(this.instance);

    // // Ceiling
    // this.ceiling = this.ground.clone();
    // this.ceiling.position.y = 5;
    // this.ceiling.position.z -= this.sizes.entranceDepth - 1.3;
    // this.ceiling.scale.setScalar(-1);

    // this.instance = new THREE.Group();
    // this.instance.add(this.frontWall, this.ground, this.ceiling);
    // this.scene.add(this.instance);

    /**
     * Note: Door walls were created in the Doors.js
     * file to have them aligned with each door.
     */
  }

  setTests() {
    this.tests.objectsOpacity = this.tests.world.addFolder('ObjectsOpacity');

    // Setting the materials to transparent
    this.universalParams.transparent = true;
    // this.ground.material.transparent = this.universalParams.transparent;
    this.wallsMaterial.transparent = this.universalParams.transparent;

    const updateOpacity = () => {
      this.wallsMaterial.opacity = this.universalParams.opacity;
      // this.ground.material.opacity = this.universalParams.opacity;
    };
    updateOpacity();

    this.tests.objectsOpacity
      .add(this.universalParams, 'opacity', 0, 1, 0.01)
      .name('HomeOpacity')
      .onFinishChange(updateOpacity);
  }
}
