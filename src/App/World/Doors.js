import * as THREE from 'three';
import App from '../App';

export default class Doors {
  constructor() {
    this.app = new App();
    this.logger = this.app.logger;
    this.scene = this.app.scene;
    this.sizes = this.app.sizes;
    this.resources = this.app.resources;

    this.doorModels = null;

    this.setEntranceDoor();
    this.setRoomDoors();
  }

  setEntranceDoor() {
    this.entranceDoor = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 1, 0.1),
      new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.2 }),
    );

    this.entranceDoor.position.set(0, 0.75, 0);

    // this.scene.add(this.entranceDoor);
  }

  setRoomDoors() {
    this.roomDoorsGeometry = new THREE.BoxGeometry(0.1, 1, 0.5);
    this.roomDoorsMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.doorsGroup = new THREE.Group();

    this.resources.gltfLoader.load('./models/door.glb', (gltf) => {
      this.doorModels = {
        body: gltf.scene.children.find((obj) => obj.name === 'Body'),
        backHandle: gltf.scene.children[0].children.find((obj) => obj.name === 'BackHandle'),
        frontHandle: gltf.scene.children[0].children.find((obj) => obj.name === 'FrontHandle'),
        window: gltf.scene.children[0].children.find((obj) => obj.name === 'Window'),
        border: gltf.scene.children.find((obj) => obj.name === 'Border'),
      };

      this.doorModels.body.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      this.doorModels.border.material = new THREE.MeshBasicMaterial({ color: 0x444444 });
      this.doorModels.window.material = new THREE.MeshBasicMaterial({ color: 0x000000 });
      this.doorModels.frontHandle.material = new THREE.MeshBasicMaterial({ color: 0x000000 });
      this.doorModels.backHandle.material = new THREE.MeshBasicMaterial({ color: 0x000000 });

      this.door = new THREE.Group();
      this.door.add(this.doorModels.body, this.doorModels.border);
      this.door.position.set(0, 0.25, 0);
      this.door.scale.set(0.4, 0.4, 0.4);
      this.scene.add(this.door);
    });

    this.doorsCount = this.sizes.doorsCount * 2 + 2;

    this.roomDoorSide = true; // true = right / false = left

    if (!this.sizes.oddDoors) {
      for (let i = 0; i < this.doorsCount; i += 1) {
        const roomDoors = new THREE.Mesh(this.roomDoorsGeometry, this.roomDoorsMaterial);

        // Making the doors face each other
        if (this.roomDoorSide) {
          roomDoors.position.set(1, 0.75, -i * 0.5 - 0.5);
          this.roomDoorSide = false;
        } else {
          roomDoors.position.set(-1, 0.75, -i * 0.5);
          this.roomDoorSide = true;
        }
        this.doorsGroup.add(roomDoors);
      }
      this.scene.add(this.doorsGroup);
    } else {
      for (let i = 0; i < this.doorsCount; i += 1) {
        const roomDoors = new THREE.Mesh(this.roomDoorsGeometry, this.roomDoorsMaterial);

        // Making the doors face each other
        if (this.roomDoorSide) {
          roomDoors.position.set(1, 0.75, -i * 0.5 - 0.5);
          this.roomDoorSide = false;
        } else {
          roomDoors.position.set(-1, 0.75, -i * 0.5);
          this.roomDoorSide = true;
        }
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
      if (this.roomDoorsGeometry && this.roomDoorsMaterial) {
        const roomDoors = new THREE.Mesh(this.roomDoorsGeometry, this.roomDoorsMaterial);

        // Making the doors face each other
        if (this.roomDoorSide) {
          roomDoors.position.set(1, 0.75, -i * 0.5 - 0.5 - this.space);
          this.roomDoorSide = false;
        } else {
          roomDoors.position.set(-1, 0.75, -i * 0.5 - this.space);
          this.roomDoorSide = true;
        }
        this.doorsGroup.add(roomDoors);
      } else {
        this.logger.error("You haven't set the geometry/material for the doors");
      }
    }

    this.scene.add(this.fakeDoorsGroup);
  }
}
