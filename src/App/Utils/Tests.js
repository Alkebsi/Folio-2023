import { GUI } from 'dat.gui';
import Stats from 'stats-js';

export default class Tests {
  constructor(statsType) {
    this.active = window.location.hash === '#tests';

    this.isMobile = this.isMobile();

    if (this.active) {
      this.statsType = statsType;
      this.statsType = 0; // 0 = fbs, click on the FPS panel for more.

      this.gui = new GUI();
      this.stats = new Stats();

      this.world = this.gui.addFolder('World');

      this.setStats();
    }
  }

  setStats() {
    this.stats.showPanel(this.statsType);
    document.body.appendChild(this.stats.dom);
  }

  isMobile() {
    this.isMobile = true;

    if (navigator.userAgent.search(/(mobile|android|ios|phone)/i) > 0) {
      return this.isMobile;
    }
    return !this.isMobile;
  }
}
