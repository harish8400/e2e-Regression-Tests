
export class TokenManager {
  static token: string;
  // static expiry: number; 
  static setToken(token: string) {
    this.token = token;
    // console.log(`Token set: ${token}`);
    // const decoded = JSON.parse(Buffer.from(this.token.split('.')[1], 'base64').toString());
    // this.expiry = decoded.exp * 1000 + 15 * 60 * 1000;
    // console.log(`auth token by Harish: ` + token);
    //console.log(`Token expiry: ${new Date(this.expiry).toISOString()}`);
    return token
  } 
  static getToken(token?: string) {
    const authToken1 =this.setToken(token!)
    // console.log(`get Token :`+ authToken1);
    return token;
  }
}