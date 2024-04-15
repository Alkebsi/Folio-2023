import App from '../App';

export default class Raycaster {
  constructor() {
    this.app = new App();
    this.doors = this.app.world.doors;

    console.log(this.doors);
  }
}
