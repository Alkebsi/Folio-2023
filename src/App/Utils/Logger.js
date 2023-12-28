/* eslint-disable no-console */
export default class Logger {
  info(message) {
    this.msg = message;
    console.log(this.msg);
  }

  warn(warning) {
    this.msg = warning;
    console.warn(this.msg);
  }

  error(error) {
    this.msg = error;
    console.error(this.msg);
  }
}
