export class logModel {
  ip;
  url;
  method;
  statusCode;
  message;

  constructor(ip, url, method, statusCode, message) {
    this.ip = ip;
    this.url = url;
    this.method = method;
    this.statusCode = statusCode;
    this.message = message;
  }

  toJSON() {
    return {
      ip: this.ip,
      url: this.url,
      method: this.method,
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}
