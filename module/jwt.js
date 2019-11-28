const randToken = require("rand-token");
const jwt = require("jsonwebtoken");
const { secretOrPrivateKey } = require("../config/secretKey");
const options = {
  algorithm: "HS256",
  expiresIn: "1h",
  issuer: "maestroprog"
};
module.exports = {
  sign: obj => {
    const payload = {
      ...obj
    };
    const result = {
      token: jwt.sign(payload, secretOrPrivateKey, options),
      refreshToken: randToken.uid(256)
    };
    return result;
  },
  verify: token => {
    //해독 메서드
    //해독 시에 에러가 발생 할 수 있기 때문에, 예외 처리를 위한 코드. try,catch로 감싼 이유
    let decoded;
    try {
      decoded = jwt.verify(token, secretOrPrivateKey);
    } catch (err) {
      if (err.message === "jwt expired") {
        console.log("expired token");
        return -3;
      } else if (err.message === "invalid token") {
        console.log("invalid token");
        return -2;
      } else {
        console.log("invalid token");
        return -2;
      }
    }
    return decoded;
  },
  refresh: obj => {
    const payload = {
      ...obj
    };
    return jwt.sign(payload, secretOrPrivateKey, options);
  }
};
