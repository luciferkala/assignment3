const pool = require("../module/poolAsync");
const utils = require("../module/util/utils");
const responseMessage = require("../module/util/responseMessage");
const statusCode = require("../module/util/statusCode");

module.exports = {
  readAll: async articleIdx => {
    const query = `SELECT * FROM comment WHERE articleIdx=${articleIdx}`;
    const result = await pool.queryParam_None(query);

    return new Promise((resolve, reject) => {
      if (!result)
        reject(utils.successFalse(responseMessage.COMMENT_READ_ALL_FAIL));
      else if (result.length === 0)
        reject(utils.successFalse(responseMessage.NO_COMMENT));
      else
        resolve(
          utils.successTrue(responseMessage.COMMENT_READ_ALL_SUCCESS, result)
        );
    });
  },
  read: async ({ commentIdx, articleIdx }) => {
    const query = `SELECT * FROM comment WHERE commentIdx=${commentIdx} AND articleIdx=${articleIdx}`;
    const result = await pool.queryParam_None(query);
    return new Promise((resolve, reject) => {
      if (!result)
        reject(utils.successFalse(responseMessage.COMMENT_READ_FAIL));
      else if (result.length === 0)
        reject(utils.successFalse(responseMessage.NO_COMMENT));
      else
        resolve(
          utils.successTrue(responseMessage.COMMENT_READ_SUCCESS, result)
        );
    });
  },
  create: async ({ name, author, contents, articleIdx }) => {
    const query =
      "INSERT INTO comment (name,author,contents, articleIdx) values(?,?,?,?)";
    const value = [name, author, contents, articleIdx];
    const result = await pool.queryParam_Parse(query, value);
    return new Promise((resolve, reject) => {
      if (!result)
        reject(utils.successFalse(responseMessage.COMMENT_CREATE_FAIL));
      else
        resolve(
          utils.successTrue(responseMessage.COMMENT_CREATE_SUCCESS, result)
        );
    });
  },
  update: async ({ articleIdx, commentIdx, name, author, contents }) => {
    const query = `UPDATE comment SET name='${name}', author='${author}', contents='${contents}' WHERE commentIdx=${commentIdx} AND articleIdx=${articleIdx}`;
    const result = await pool.queryParam_None(query);
    return new Promise((resolve, reject) => {
      if (!result)
        reject(utils.successFalse(responseMessage.COMMENT_UPDATE_FAIL));
      else resolve(utils.successTrue(responseMessage.COMMENT_UPDATE_SUCCESS));
    });
  },
  delete: async ({ commentIdx, articleIdx }) => {
    const query = `DELETE FROM comment WHERE commentIdx=${commentIdx} AND articleIdx=${articleIdx}`;
    const selectQuery = `SELECT * FROM comment WHERE commentIdx=${commentIdx} AND articleIdx=${articleIdx}`;
    const selectResult = await pool.queryParam_None(selectQuery);
    const result = await pool.queryParam_None(query);

    return new Promise(async (resolve, reject) => {
      if (selectResult.length === 0)
        reject(utils.successFalse(responseMessage.NO_COMMENT));
      else if (!result)
        reject(utils.successFalse(responseMessage.COMMENT_DELETE_FAIL));
      else resolve(utils.successTrue(responseMessage.COMMENT_DELETE_SUCCESS));
    });
  }
};
