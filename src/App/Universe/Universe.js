import * as THREE from 'three';
import SiteManager from '../SiteManager';
import Floor from './Floor';
import Models from './Models';
import Walls from './Walls';
import Door from './Door';

export default class Universe {
  constructor() {
    this.siteManager = new SiteManager();
    this.scene = this.siteManager.scene;
    this.tests = this.siteManager.tests;

    this.floor = new Floor();
    this.walls = new Walls();
    this.door = new Door();
    // this.models = new Models();
  }

  resize() {}

  update() {}
}
