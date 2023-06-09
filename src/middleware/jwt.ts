import * as jwt from 'jsonwebtoken';

export class Jwt {
  private secretKey = process.env.SECRET_KEY;

  sign(playload: any, expire='2h') {
    let token = jwt.sign(playload, this.secretKey, {
      expiresIn: expire
    });
    return token;
  }

  verify(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secretKey, (err, decoded) => {
        if (err) {
          reject(err)
        } else {
          resolve(decoded)
        }
      });
    });
  }

}
