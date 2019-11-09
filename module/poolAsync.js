const poolPromise = require("../config/dbConfig");
module.exports = {
  queryParam_None: async query => {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await poolPromise;
        const connection = await pool.getConnection();
        try {
          const result = await connection.query(query); //const를 사용할 수 있음, null을 사용하는게 아니라 유연한 코드를 작성 가능
          pool.releaseConnection(connection);
          resolve(result);
        } catch (err) {
          pool.releaseConnection(connection);
          reject(err);
        }
      } catch (err) {
        reject(err);
      }
    });
  },
  queryParam_Arr: async (...args) => {
    this.queryParam_Parse(args[0], args[1]);
  },
  queryParam_Parse: async (query, value) => {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await poolPromise;
        const connection = await pool.getConnection();
        try {
          const result = await connection.query(query, value);
          pool.releaseConnection(connection);
          resolve(result);
        } catch (err) {
          pool.releaseConnection(connection);
          reject(err);
        }
      } catch (err) {
        reject(err);
      }
    });
  },
  Transaction: async (...args) => {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await poolPromise;
        const connection = await pool.getConnection();
        try {
          await connection.beginTransaction();
          args.forEach(async it => await it(connection));
          await connection.commit();
          pool.releaseConnection(connection);
          resolve(true);
        } catch (err) {
          await connection.rollback();
          pool.releaseConnection(connection);
          reject(err);
        }
      } catch (err) {
        reject(err);
      }
    });
  }
};
