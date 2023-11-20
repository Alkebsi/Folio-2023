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

    if (this.camera.controls.enabled) {
      this.disableScrollFunc();
    }
  }

  setScrollFunctionality() {
    const scrollPos = -(scrollY / this.sizes.height) - 1;

    this.camera.instance.position.z = scrollPos;
    this.camera.lookAtObject.z = scrollPos - 2;
  }

  disableScrollFunc() {
    console.log('this is working');
    this.scrollElement.style.display = 'none';
  }
}
