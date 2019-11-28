const upload = require("../config/multer");
const pool = require("../module/poolAsync");
const utils = require("../module/util/utils");
const responseMessage = require("../module/util/responseMessage");

module.exports = {
  array: async (files, articleIdx) => {
    const query = `INSERT INTO image (articleIdx, originalname, location) values (?,?,?)`;
    let originalname;
    let location;
    const value = [articleIdx, originalname, location];
    let result;
    return new Promise(async (resolve, reject) => {
      for (element of files) {
        value[1] = element.originalname;
        value[2] = element.location;
        try {
          result = await pool.queryParam_Parse(query, value);
        } catch (err) {
          console.log(err);
          reject(utils.successFalse(responseMessage.IMAGE_UPLOAD_FAIL));
          return;
        }
      }
      resolve(utils.successTrue(responseMessage.IMAGE_UPLOAD_SUCCESS), result);
    });
  }
};
