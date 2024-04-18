import * as THREE from 'three';
import gsap, { Power2 } from 'gsap';
import App from '../App';

export default class Doors {
  constructor() {
    this.app = new App();
    this.logger = this.app.logger;
    this.scene = this.app.scene;
    this.sizes = this.app.sizes;
    this.resources = this.app.resources;
    this.tests = this.app.tests;

    this.universalParams = {
      opacity: 0.5,
      transparent: false,
    };
    this.doorModels = null;

    this.wallsMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide, // since the camera will go inside the rooms
      transparent: this.universalParams.transparent,
      opacity: this.universalParams.opacity,
    });

    this.loadDoorModel();
    this.setScene();
    if (this.tests.active) {
      this.setTests();
    }
  }

  loadDoorModel() {
    this.resources.gltfLoader.load('./models/door.glb', (gltf) => {
      this.doorModels = {
        body: gltf.scene.children.find((obj) => obj.name === 'Body'),
        backHandle: gltf.scene.children[0].children.find((obj) => obj.name === 'BackHandle'),
        frontHandle: gltf.scene.children[0].children.find((obj) => obj.name === 'FrontHandle'),
        window: gltf.scene.children[0].children.find((obj) => obj.name === 'Window'),
        border: gltf.scene.children.find((obj) => obj.name === 'Border'),
      };

      const white = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const black = new THREE.MeshBasicMaterial({ color: 0x000000 });

      this.doorModels.body.material = white;
      this.doorModels.border.material = black;
      this.doorModels.window.material = black;
      this.doorModels.frontHandle.material = black;
      this.doorModels.backHandle.material = black;

      this.door = new THREE.Group();
      this.door.add(this.doorModels.body, this.doorModels.border);
      this.door.position.set(0, 0.25, 0);
      this.door.scale.set(0.6, 0.6, 0.6);
    });
  }

  setScene() {
    if (this.resources.ready && this.door) {
      this.setEntranceDoor();
      this.setRoomDoors();
    } else {
      requestAnimationFrame(() => {
        this.setScene();
      });
    }
  }

  setEntranceDoor() {
    this.entranceDoor = this.door.clone();

    this.entranceDoor.position.set(0, 0, 0.1);

    this.scene.add(this.entranceDoor);
  }

  // Created them here no align them with each door
  setDoorWalls(i, isRight) {
    this.index = i / 2;
    this.finalResult = this.sizes.doorsCount * 2;
    this.sideWall = new THREE.Group();

    if (this.index > 0 && !isRight) {
      this.addMesh = (index) => {
        this.inbetweens = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 5), this.wallsMaterial);
        this.toppings = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 3.85), this.wallsMaterial);

        this.inbetweens.rotation.y = -Math.PI * 0.5;
        this.inbetweens.position.set(1, 2.5, -index);

        this.toppings.rotation.y = -Math.PI * 0.5;
        this.toppings.position.set(1, 3.075, -index + 0.5);

        this.sideWall.add(this.inbetweens, this.toppings);
      };
      this.addMesh(this.index);

      if (this.finalResult === i) {
        this.addMesh(this.index + 1);
      }
    }

    this.leftSideWalls = this.sideWall.clone();
    this.leftSideWalls.position.set(-2, 0, 0);

    this.scene.add(this.sideWall, this.leftSideWalls);
  }

  setRoomDoors() {
    this.doorsGroup = new THREE.Group();
    this.doorsCount = this.sizes.doorsCount * 2 + 2;
    this.rightRoom = true; // true = the room is on the right side

    for (let i = 0; i < this.doorsCount; i += 1) {
      const roomDoors = this.door.clone();
      roomDoors.children[0].userData.doorNumber = i;
      roomDoors.userData.doorNumber = i;
      // console.log(roomDoors);

      roomDoors.rotation.y = Math.PI * 0.5;

      // Making the doors face each other
      if (this.rightRoom) {
        roomDoors.position.set(1, 0, -i * 0.5 - 0.5);
        roomDoors.scale.z = -roomDoors.scale.z;
        this.rightRoom = false;
      } else {
        roomDoors.position.set(-1, 0, -i * 0.5);
        this.rightRoom = true;
      }

      this.setDoorWalls(i, this.rightRoom);
      this.doorsGroup.add(roomDoors);
    }
    this.scene.add(this.doorsGroup);

    // Once things are done, create fake doors
    this.setFakeDoors();
  }

  setFakeDoors() {
    this.fakeDoorsGroup = new THREE.Group();
    this.fakeDoorsCount = this.sizes.fakeDoors;
    this.space = this.doorsCount * 0.5;

    for (let i = 0; i < this.fakeDoorsCount; i += 1) {
      const roomDoors = this.door.clone();
      roomDoors.rotation.y = Math.PI * 0.5;

      // Making the doors face each other
      if (this.rightRoom) {
        roomDoors.position.set(1, 0, -i * 0.5 - 0.5 - this.space);
        roomDoors.scale.z = -roomDoors.scale.z;
        this.rightRoom = false;
      } else {
        roomDoors.position.set(-1, 0, -i * 0.5 - this.space);
        this.rightRoom = true;
      }

      this.setDoorWalls(i + this.doorsCount + 2, this.rightRoom);
      this.fakeDoorsGroup.add(roomDoors);
    }

    this.scene.add(this.fakeDoorsGroup);
  }

  // This funcitons is triggered from the raycaster class
  clicked(door) {
    this.clickedDoor = door;
    gsap.to(this.clickedDoor.rotation, {
      ease: Power2.easeInOut,
      delay: 1,
      duration: 2,
      y: Math.PI / 2,
    });
    gsap.to(this.clickedDoor.rotation, {
      ease: Power2.easeInOut,
      delay: 4,
      duration: 1,
      y: 0,
    });

    /**
     * Move every other door to Valhalla
     */

    // Doors to one side of the one clicked
    this.rightSideDoors = this.clickedDoor.parent.parent.children.filter(
      (child) => child.userData.doorNumber > this.clickedDoor.userData.doorNumber,
    );

    // Doors to the other side of the one clicked
    this.leftSideDoors = this.clickedDoor.parent.parent.children.filter(
      (child) => child.userData.doorNumber < this.clickedDoor.userData.doorNumber,
    );

    // Animating the doors closer to the enterance
    for (let i = 0; i < this.leftSideDoors.length; i += 1) {
      gsap.to(this.leftSideDoors[i].position, {
        z: '+=5',
        duration: 2,
        ease: Power2,
      });

      // Bring them back after few seconds
      gsap.to(this.leftSideDoors[i].position, {
        z: '-=5',
        duration: 0,
        delay: 3,
      });
    }

    // Animating the doors ahead of the enterance
    for (let i = 0; i < this.rightSideDoors.length; i += 1) {
      gsap.to(this.rightSideDoors[i].position, {
        z: '-=5',
        duration: 2,
        ease: Power2,
      });

      // Every fake door will move here
      gsap.to(this.fakeDoorsGroup.position, {
        z: -5,
        duration: 2,
        ease: Power2,
      });

      // Bring them back after few seconds
      gsap.to(this.rightSideDoors[i].position, {
        z: '+=5',
        duration: 0,
        delay: 3,
      });
      gsap.to(this.fakeDoorsGroup.position, {
        z: 0,
        duration: 0,
        delay: 3,
      });
    }
  }

  setTests() {
    this.universalParams.transparent = true;
    this.wallsMaterial.transparent = this.universalParams.transparent;

    const updateOpacity = () => {
      this.wallsMaterial.opacity = this.universalParams.opacity;
      // console.log(this.wallsMaterial.opacity)
    };
    updateOpacity();

    this.tests.objectsOpacity
      .add(this.universalParams, 'opacity', 0, 1, 0.01)
      .name('WallsOpacity')
      .onFinishChange(updateOpacity);
  }
}
