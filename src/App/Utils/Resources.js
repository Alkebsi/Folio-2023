import App from '../App';

export default class Resources {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.interval = this.app.interval;
    this.sizes = this.app.sizes;

    this.loadingSVGContainer = document.querySelector('#circles-con');

    // Update the loading paned svg view port height once loading the page
    this.loadingSVGContainer.setAttribute(
      'viewBox',
      `0 0 ${this.sizes.width} ${this.sizes.height}`,
    );

    this.setLoadingScene();
  }

  setLoadingScene() {
    // Creating a circle where clicked
    this.addCircle = () => {
      // Recalculating the mouse location
      this.cursor = {
        x: (this.sizes.mouseLocation.x * 0.5 + 0.5) * this.sizes.width,
        y: (-this.sizes.mouseLocation.y * 0.5 + 0.5) * this.sizes.height,
      };

      // console.log(this.cursor.x);

      this.circle = `
        <circle class="circles" cx="${this.cursor.x}" cy="${this.cursor.y}" r="40" />
      `;

      if (this.loadingSVGContainer.children.length < 50) {
        this.loadingSVGContainer.innerHTML += this.circle;
      }
    };
    window.addEventListener('click', () => {
      this.addCircle();
    });
  }

  resize() {
    this.loadingSVGContainer.setAttribute(
      'viewBox',
      `0 0 ${this.sizes.width} ${this.sizes.height}`,
    );

    this.cursor = {
      x: (this.sizes.mouseLocation.x * 0.5 + 0.5) * this.sizes.width,
      y: (-this.sizes.mouseLocation.y * 0.5 + 0.5) * this.sizes.height,
    };
  }
}
