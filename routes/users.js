const express = require("express");
const router = express.Router();
const responseMessage = require("../module/util/responseMessage");
const statusCode = require("../module/util/statusCode");
const User = require("../model/user");
const jwt = require("../module/jwt");
const authUtils = require("../module/util/authUtils");
const Init = authUtils.Init;
const Confirm = authUtils.Confirm;

/* GET users listing. */
router.post("/signin", Init, (req, res) => {
  const { id, pwd } = req.body;
  // if (!id || !pwd) {
  //   res.status(statusCode.FORBIDDEN).send(responseMessage.NULL_VALUE);
  // }
  User.signIn(id, pwd)
    .then(result => {
      result.data = req.body.token;
      res.status(statusCode.OK).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(statusCode.INTERNAL_SERVER_ERROR).json(err);
    });
});

router.post("/signup", function(req, res, next) {
  const { id, pwd, name, gender } = req.body;

  if (!id || !pwd || !name || !gender) {
    res.status(statusCode.FORBIDDEN).send(responseMessage.NULL_VALUE);
  }
  User.signUp(id, pwd, name, gender)
    .then(result => res.status(statusCode.OK).json(result))
    .catch(err => {
      console.log(err);
      res.status(statusCode.DB_ERROR).json(err);
    });
});

module.exports = router;
