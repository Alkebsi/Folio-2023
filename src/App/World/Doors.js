import * as THREE from 'three';
import App from '../App';

export default class Doors {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.sizes = this.app.sizes;

    this.setEntranceDoor();
    this.setRoomDoors();
  }

  setEntranceDoor() {
    this.entranceDoor = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 1, 0.1),
      new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    );

    this.entranceDoor.position.set(0, 0.75, 0);

    this.scene.add(this.entranceDoor);
  }

  setRoomDoors() {
    this.roomDoorsGeometry = new THREE.BoxGeometry(0.1, 1, 0.5);
    this.roomDoorsMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.doorsGroup = new THREE.Group();

    this.doorsCount = this.sizes.doorsCount * 2 + 2;

    this.roomDoorSide = true; // true = right / false = left

    if (!this.sizes.oddDoors) {
      for (let i = 0; i < this.doorsCount; i += 1) {
        const roomDoors = new THREE.Mesh(
          this.roomDoorsGeometry,
          this.roomDoorsMaterial,
        );

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
        const roomDoors = new THREE.Mesh(
          this.roomDoorsGeometry,
          this.roomDoorsMaterial,
        );

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
  }
}
