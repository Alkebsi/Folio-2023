import * as THREE from 'three';
import App from '../App';
import Models from './Models';
import Home from './Home';
import Doors from './Doors';

export default class World {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.tests = this.app.tests;

    this.walls = new Home();
    this.doors = new Doors();
    // this.models = new Models();
  }

  resize() {}

  update() {}
}
