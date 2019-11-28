const pool = require("../module/poolAsync");
const utils = require("../module/util/utils");
const responseMessage = require("../module/util/responseMessage");
const statusCode = require("../module/util/statusCode");

module.exports = {
  readAll: async () => {
    const query = "SELECT * FROM blog";
    const result = await pool.queryParam_None(query);

    return new Promise((resolve, reject) => {
      if (!result)
        reject(utils.successFalse(responseMessage.BLOG_READ_ALL_FAIL));
      else if (result.length === 0)
        reject(utils.successFalse(responseMessage.NO_BLOG));
      else
        resolve(
          utils.successTrue(responseMessage.BLOG_READ_ALL_SUCCESS, result)
        );
    });
  },
  read: async blogIdx => {
    const query = `SELECT * FROM blog WHERE blogIdx=${blogIdx}`;
    const result = await pool.queryParam_None(query);
    return new Promise((resolve, reject) => {
      if (!result) reject(utils.successFalse(responseMessage.BLOG_READ_FAIL));
      else if (result.length === 0)
        reject(utils.successFalse(responseMessage.NO_BLOG));
      else
        resolve(utils.successTrue(responseMessage.BLOG_READ_SUCCESS, result));
    });
  },
  create: async ({ name, owner }) => {
    const query = "INSERT INTO blog (name, owner) values(?,?)";
    const value = [name, owner];
    const result = await pool.queryParam_Parse(query, value);
    return new Promise((resolve, reject) => {
      if (!result) reject(utils.successFalse(responseMessage.BLOG_CREATE_FAIL));
      else resolve(utils.successTrue(responseMessage.BLOG_CREATE_SUCCESS));
    });
  },
  update: async ({ blogIdx, name, owner }) => {
    const query = `UPDATE blog SET name='${name}', owner='${owner}' WHERE blogIdx=${blogIdx}`;
    const result = await pool.queryParam_None(query);
    return new Promise((resolve, reject) => {
      if (!result) reject(utils.successFalse(responseMessage.BLOG_UPDATE_FAIL));
      else resolve(utils.successTrue(responseMessage.BLOG_UPDATE_SUCCESS));
    });
  },
  delete: async ({ blogIdx }) => {
    const query = `DELETE FROM blog WHERE blogIdx=${blogIdx}`;
    const selectQuery = `SELECT * FROM blog WHERE blogIdx=${blogIdx}`;
    const selectResult = await pool.queryParam_None(selectQuery);
    const result = await pool.queryParam_None(query);

    return new Promise(async (resolve, reject) => {
      if (selectResult.length === 0)
        reject(utils.successFalse(responseMessage.NO_BLOG));
      else if (!result)
        reject(utils.successFalse(responseMessage.BLOG_DELETE_FAIL));
      else resolve(utils.successTrue(responseMessage.BLOG_DELETE_SUCCESS));
    });
  }
};
