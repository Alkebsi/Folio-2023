/* eslint-disable no-console */
export default class Logger {
  info(message) {
    this.info = message;
    console.log(this.info);
  }

  warn(warning) {
    this.warning = warning;
    console.warn(this.warning);
  }

  error(error) {
    this.error = error;
    console.error(this.error);
  }
}
