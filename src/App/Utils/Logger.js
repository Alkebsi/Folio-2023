/* eslint-disable no-console */
export default class Logger {
  info(message) {
    this.msg = message;
    // console.log('Info:', this.msg); // got annoying!
  }

  warn(warning) {
    this.msg = warning;
    console.warn('Warnning:', this.msg);
  }

  error(error) {
    this.msg = error;
    console.error('Error:', this.msg);
  }
}
