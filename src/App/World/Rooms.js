import * as THREE from 'three';
import App from '../App';

export default class Rooms {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.sizes = this.app.sizes;

    this.setInstance();
  }

  setInstance() {
    this.roomsGeometry = new THREE.BoxGeometry(5, 1.48, 0.98);
    this.roomsMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      side: THREE.DoubleSide,
    });

    this.roomSide = true; // true = right / false = left

    if (!this.sizes.oddDoors) {
      for (let i = 0; i < this.sizes.doorsCount; i += 1) {
        this.rooms = new THREE.Mesh(this.roomsGeometry, this.roomsMaterial);

        // Making the doors face each other
        if (this.roomSide) {
          this.rooms.position.set(3.52, 0.75, -i * 0.5 - 0.5);
          this.roomSide = false;
        } else {
          this.rooms.position.set(-3.52, 0.75, -i * 0.5);
          this.roomSide = true;
        }
        // this.doorsGroup.add(this.rooms);
        // this.scene.add(this.doorsGroup);

        this.scene.add(this.rooms);
      }
    } else {
      for (let i = 0; i < this.sizes.doorsCount * 2; i += 1) {
        this.rooms = new THREE.Mesh(this.roomsGeometry, this.roomsMaterial);

        // Making the doors face each other
        if (this.roomSide) {
          this.rooms.position.set(3.52, 0.75, -i * 0.5 - 0.5);
          this.roomSide = false;
        } else {
          this.rooms.position.set(-3.52, 0.75, -i * 0.5);
          this.roomSide = true;
        }

        this.scene.add(this.rooms);
      }
    }
  }
}
