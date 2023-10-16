export default class Interval {
  constructor() {
    this.start = Date.now();
    this.current = this.start;
    this.delta = 16;
    this.elapse = 0;
  }

  update() {
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapse = (this.current - this.start) / 1000;
  }
}
