import App from '../App';

export default class Sizes {
  constructor() {
    this.app = new App();
    this.canvas = this.app.canvas;

    this.setSizes();
    this.setDoorsCount();
    this.getCursorLocation();
    this.getMobileOrentation();
  }

  setSizes() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
  }

  resize() {
    this.setSizes();
  }

  fullScreen() {
    if (!document.fullscreenElement) {
      document.querySelector('html').requestFullscreen();
    }
  }

  setDoorsCount() {
    this.doorsCount = 11;

    if (this.doorsCount % 2 === 1) {
      this.oddDoors = true;
    } else if (this.doorsCount % 2 === 0) {
      this.oddDoors = false;
    } else {
      console.error(`The doors count is not set appropriately: ${this.doorsCount}`)
    }
  }

  getCursorLocation() {
    this.mouseLocation = {
      x: 0,
      y: 0,
    };

    window.addEventListener('mousemove', (event) => {
      this.mouseLocation.x = (event.clientX / this.width) * 2 - 1;
      this.mouseLocation.y = (-event.clientY / this.height) * 2 + 1;
    });

    return this.mouseLocation;
  }

  getMobileOrentation() {
    this.gyro = {
      x: 0,
      y: 0,
    };

    window.addEventListener('deviceorientation', (event) => {
      this.gyro.x = (-event.gamma / 90) * 4;
      this.gyro.y = (event.beta / 90) * 2;
      // The alpha (gyro.z) is not usable
      // this.gyro.z = event.alpha;
    });
  }
}
