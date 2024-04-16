import App from '../App';
import Home from './Home';
import Doors from './Doors';

export default class World {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.sizes = this.app.sizes;
    this.tests = this.app.tests;

    this.home = new Home();
    this.doors = new Doors(this.home.universalParams);
    // this.rooms = new Rooms();

    if (this.tests.active) {
      this.setTests();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  update() {}

  // eslint-disable-next-line class-methods-use-this
  resize() {}

  // eslint-disable-next-line class-methods-use-this
  setTests() {}
}
