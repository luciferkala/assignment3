const pool = require("../module/poolAsync");
const utils = require("../module/util/utils");
const responseMessage = require("../module/util/responseMessage");
const statusCode = require("../module/util/statusCode");
const multerImage = require("../model/multerImage");
module.exports = {
  readAll: async blogIdx => {
    const query = `SELECT * FROM article WHERE blogIdx=${blogIdx}`;
    const result = await pool.queryParam_None(query);

    return new Promise((resolve, reject) => {
      if (!result)
        reject(utils.successFalse(responseMessage.ARTICLE_READ_ALL_FAIL));
      else if (result.length === 0)
        reject(utils.successFalse(responseMessage.NO_ARTICLE));
      else
        resolve(
          utils.successTrue(responseMessage.ARTICLE_READ_ALL_SUCCESS, result)
        );
    });
  },
  read: async ({ blogIdx, articleIdx }) => {
    const query = `SELECT * FROM article WHERE articleIdx=${articleIdx} AND blogIdx=${blogIdx}`;
    const result = await pool.queryParam_None(query);
    return new Promise((resolve, reject) => {
      if (!result)
        reject(utils.successFalse(responseMessage.ARTICLE_READ_FAIL));
      else if (result.length === 0)
        reject(utils.successFalse(responseMessage.NO_ARTICLE));
      else
        resolve(
          utils.successTrue(responseMessage.ARTICLE_READ_SUCCESS, result)
        );
    });
  },
  create: async ({ name, author, contents, blogIdx, files }) => {
    const images = files.length !== 0 ? 1 : 0;
    const query =
      "INSERT INTO article (name,author,contents, blogIdx, images) values(?,?,?,?,?)";
    const value = [name, author, contents, blogIdx, images];
    const result = await pool.queryParam_Parse(query, value);
    let test;
    return new Promise(async (resolve, reject) => {
      if (images !== 0) test = await multerImage.array(files, result.insertId);
      if (!result)
        reject(utils.successFalse(responseMessage.ARTICLE_CREATE_FAIL));
      else
        resolve(
          utils.successTrue(responseMessage.ARTICLE_CREATE_SUCCESS, test)
        );
    });
  },
  //   create: async ({ name, author, contents, blogIdx }) => {
  //     const query =
  //       "INSERT INTO article (name,author,contents, blogIdx) values(?,?,?,?)";
  //     const value = [name, author, contents, blogIdx];
  //     const result = await pool.queryParam_Parse(query, value);
  //     return new Promise((resolve, reject) => {
  //       if (!result)
  //         reject(utils.successFalse(responseMessage.ARTICLE_CREATE_FAIL));
  //       else resolve(utils.successTrue(responseMessage.ARTICLE_CREATE_SUCCESS));
  //     });
  //   },
  update: async ({ articleIdx, blogIdx, name, author, contents }) => {
    const query = `UPDATE article SET name='${name}', author='${author}', contents='${contents}' WHERE articleIdx=${articleIdx} AND blogIdx=${blogIdx}`;
    const result = await pool.queryParam_None(query);
    return new Promise((resolve, reject) => {
      if (!result)
        reject(utils.successFalse(responseMessage.ARTICLE_UPDATE_FAIL));
      else resolve(utils.successTrue(responseMessage.ARTICLE_UPDATE_SUCCESS));
    });
  },
  delete: async ({ blogIdx, articleIdx }) => {
    const query = `DELETE FROM article WHERE articleIdx=${articleIdx} AND blogIdx=${blogIdx}`;
    const selectQuery = `SELECT * FROM article WHERE articleIdx=${articleIdx} AND blogIdx=${blogIdx}`;
    const selectResult = await pool.queryParam_None(selectQuery);
    const result = await pool.queryParam_None(query);

    return new Promise(async (resolve, reject) => {
      if (selectResult.length === 0)
        reject(utils.successFalse(responseMessage.NO_ARTICLE));
      else if (!result)
        reject(utils.successFalse(responseMessage.ARTICLE_DELETE_FAIL));
      else resolve(utils.successTrue(responseMessage.ARTICLE_DELETE_SUCCESS));
    });
  }
};
