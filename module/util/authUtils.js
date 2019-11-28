const jwt = require("../jwt");
const resMessage = require("./responseMessage");
const statusCode = require("./statusCode");
const util = require("./utils");

const authUtil = {
  Init: (req, res, next) => {
    const { id, pwd } = req.body;
    if (!id || !pwd) {
      res.status(statusCode.FORBIDDEN).send(responseMessage.NULL_VALUE);
    }
    const data = req.body.id;
    const token = jwt.sign(data);
    req.body.token = token;
    next();
  },
  Confirm: (req, res, next) => {
    const token = req.headers.token;

    if (!token) {
      res
        .status(statusCode.BAD_REQUEST)
        .json(util.successFalse(resMessage.NULL_VALUE));
      return;
    }

    const result = jwt.verify(token);
    if (result == -1) {
      res
        .status(statusCode.UNAUTHORIZED)
        .send(util.successFalse(resMessage.EXPIRED_TOKEN));
      return;
    }
    if (result == -2) {
      res
        .status(statusCode.UNAUTHORIZED)
        .send(util.successFalse(resMessage.INVALID_TOKEN));
      return;
    }
    console.log(result);
    // const userIdx = result.userIdx;
    // if (!userIdx) {
    //   res
    //     .status(statusCode.BAD_REQUEST)
    //     .send(util.successFalse(resMessage.NULL_VALUE));
    //   return;
    // }
    // console.log(req.decoded);
    // req.decoded = userIdx;
    next();
  }
};
// const authUtil = {
//     LoggedIn: async(req, res, next) => {
//         var token = req.headers.token;

//         if (!token) {
//             return res.status(statusCode.BAD_REQUEST).json(util.successFalse(resMessage.EMPTY_TOKEN));
//         }
//         const result = jwt.verify(token);

//         if(result.isError){
//             const {code, json} = result.data;
//             if(code && json) {
//                 return res.status(code).send(util.successFalse(json));
//             }
//             const err = result.data;
//             return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.successFalse(err.message));
//         }

//         const {userIdx} = result.data;
//         if (!userIdx){
//             return res.status(statusCode.UNAUTHORIZED).send(util.successFalse(resMessage.INVALID_TOKEN));
//         }
//         req.decoded = userIdx;
//         next();
//     },
// };

// module.exports = authUtil;
module.exports = authUtil;
