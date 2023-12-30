import App from '../App';

export default class Controllers {
  constructor(scrollElement) {
    this.app = new App();
    this.logger = this.app.logger;
    this.camera = this.app.camera;
    this.sizes = this.app.sizes;
    this.tests = this.app.tests;

    this.scrollElement = scrollElement;
    this.isClicking = false;

    window.addEventListener('scroll', () => {
      this.setScrollFunctionality();
    });

    window.addEventListener('mousemove', () => {
      this.setRotationalFuncitonality();
    });

    this.camera.addEventListener('toggleControllers', (e) => {
      if (e.message) {
        this.disableScrollFunc();
      } else {
        this.enableScrollFunc();
      }
    });
  }

  setScrollFunctionality() {
    const scrollPos = -(window.scrollY / this.sizes.height);

    // Loop back of the doors count is reached
    if (scrollPos <= -this.sizes.doorsCount * 0.5) {
      window.scrollTo(0, 0);
    }

    this.camera.instance.position.z = scrollPos;
    this.camera.lookAtObject.z = scrollPos - 2;
  }

  setRotationalFuncitonality() {
    window.addEventListener('mousedown', () => {
      this.isClicking = true;
    });
    window.addEventListener('mouseup', () => {
      this.isClicking = false;
    });

    if (this.isClicking) {
      this.camera.lookAtObject.x = -this.sizes.mouseLocation.x;
    }
  }

  disableScrollFunc() {
    this.logger.info('Scroll Functionality is disabled');
    this.scrollElement.style.display = 'none';
  }

  enableScrollFunc() {
    this.logger.info('Scroll Functionality is enabled');
    this.camera.instance.position.set(0, 0.75, 0);
    this.scrollElement.style.display = 'block';
  }
}
