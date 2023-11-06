import App from '../App';

export default class Controllers {
  constructor(scrollElement) {
    this.app = new App();
    this.camera = this.app.camera;
    this.sizes = this.app.sizes;
    this.tests = this.app.tests;

    this.scrollElement = scrollElement;

    this.setScrollFunctionality();

    if (this.camera.controls.enabled) {
      this.disableScrollFunc();
    }
  }

  setScrollFunctionality() {

  }

  disableScrollFunc() {
    console.log('this is working');
    this.scrollElement.style.display = 'none';
  }
}
