const pool = require("../module/poolAsync");
const responseMessage = require("../module/util/responseMessage");
const statusCode = require("../module/util/statusCode");
const utils = require("../module/util/utils");
const jwt = require("../module/jwt");

module.exports = {
  signIn: (id, pwd) => {
    return new Promise(async (resolve, reject) => {
      const query = `SELECT * FROM user WHERE id="${id}" AND pwd="${pwd}"`;
      const value = [id, pwd];
      const result = await pool.queryParam_Parse(query, value);

      if (!result) {
        reject(utils.successFalse(responseMessage.INTERNAL_SERVER_ERROR));
      } else if (result.length === 0) {
        reject(utils.successFalse(responseMessage.NO_USER));
      } else {
        // const uToken = jwt.sign(result[0]);
        resolve(utils.successTrue(responseMessage.SIGN_IN_SUCCESS));
      }
    });
  },
  signUp: async (id, pwd, name, gender) => {
    const query =
      "INSERT INTO user (id, pwd, name, gender) values (?, ?, ?, ?);";
    const value = [id, pwd, name, gender];
    const result = await pool.queryParam_Parse(query, value);
    return new Promise((resolve, reject) => {
      if (!result) {
        reject(utils.successFalse(responseMessage.SIGN_UP_FAIL));
      } else {
        resolve(utils.successTrue(responseMessage.SIGN_UP_SUCCESS));
      }
    });
  }
};
