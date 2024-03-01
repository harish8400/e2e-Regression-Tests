import { tokens } from '../utils/token_utils';

export default class TokenManager {

  static token: string;
  static expiry: number;

  static getToken() {
    const now = new Date().getTime();
    if (!this.token || now > this.expiry) {
      this.token = tokens.default;
      // Assuming tokens.default is a string representation of the token with an expiration claim (exp)
      const decoded = JSON.parse(Buffer.from(this.token.split('.')[1], 'base64').toString());
      this.expiry = decoded.exp * 1000 + 15 * 60 * 1000; // 15 minutes from now
    }
    return this.token;
  }

  // Additional method to get the current token (if needed)
  static getCurrentToken() {
    const now = new Date().getTime();
    if (now > this.expiry) {
      // Token has expired, return null or handle it accordingly
      return null;
    }
    return this.token;
  }
}