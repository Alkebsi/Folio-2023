import * as THREE from 'three';
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
      opacity: 0.7,
      transparent: false,
    };
    this.doorModels = null;

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

      const modelsMaterial = new THREE.MeshBasicMaterial({ color: 0x990000 });

      this.doorModels.body.material = modelsMaterial;
      this.doorModels.border.material = modelsMaterial;
      this.doorModels.window.material = modelsMaterial;
      this.doorModels.frontHandle.material = modelsMaterial;
      this.doorModels.backHandle.material = modelsMaterial;

      this.doorModels.body.rotation.y = Math.PI * 0.25;

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

    this.entranceDoor.position.set(0, 0, 0);

    this.scene.add(this.entranceDoor);
  }

  setDoorWalls(i, isRight) {
    this.index = i / 2;
    this.finalResult = this.sizes.doorsCount * 2;
    this.sideWall = new THREE.Group();

    if (this.index > 0 && !isRight) {
      this.addMesh = (index) => {
        this.inbetweens = new THREE.Mesh(
          new THREE.PlaneGeometry(0.3, 5),
          new THREE.MeshBasicMaterial({
            color: 0x000000,
            side: THREE.DoubleSide,
            transparent: this.universalParams.transparent,
            opacity: this.universalParams.opacity,
          }),
        );
        this.toppings = new THREE.Mesh(
          new THREE.PlaneGeometry(0.7, 3.85),
          new THREE.MeshBasicMaterial({
            color: 0x000000,
            side: THREE.DoubleSide,
            transparent: this.universalParams.transparent,
            opacity: this.universalParams.opacity,
          }),
        );

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
    this.rightRoom = true; // true = the room is in the right

    if (!this.sizes.oddDoors) {
      for (let i = 0; i < this.doorsCount; i += 1) {
        const roomDoors = this.door.clone();
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
    } else {
      for (let i = 0; i < this.doorsCount; i += 1) {
        const roomDoors = this.door.clone();
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
    }

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
      this.doorsGroup.add(roomDoors);
    }

    this.scene.add(this.fakeDoorsGroup);
  }

  setTests() {
    this.tests.doors = this.tests.world.addFolder('Doors');
    this.universalParams.transparent = true;

    /* //TODO: this did work! Find a way around the toppings and inbetweens.
    this.tests.doors.add(this.universalParams, 'transparent').onChange(() => {
      this.toppings.material.transparent = this.universalParams.transparent;
    });
    // */
  }
}
