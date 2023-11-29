import * as THREE from 'three';
import App from '../App';

export default class Controllers {
  constructor(scrollElement) {
    this.app = new App();
    this.camera = this.app.camera;
    this.sizes = this.app.sizes;
    this.tests = this.app.tests;

    this.scrollElement = scrollElement;

    addEventListener('scroll', () => {
      this.setScrollFunctionality();
    });

    this.camera.addEventListener('ToggleControllers', () => {
      console.log('Controllers are triggered')
    });
  }

  setScrollFunctionality() {
    const scrollPos = -(scrollY / this.sizes.height);

    // Loop back of the doors count is reached
    if (scrollPos <= -this.sizes.doorsCount * 0.5) {
      window.scrollTo(0, 0);
    } 
    
    this.camera.instance.position.z = scrollPos;
    this.camera.lookAtObject.z = scrollPos - 2;
  }

  disableScrollFunc() {
    console.log('Scroll Functionality is disabled');
    this.scrollElement.style.display = 'none';
  }

  enableScrollFunc() {
    console.log('Scroll Functionality is enabled');
    this.scrollElement.style.display = 'block';
  }
}
