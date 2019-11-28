const express = require("express");
const router = express.Router({ mergeParams: true });
const articleRouter = require("./articles");

const responseMessage = require("../../module/util/responseMessage");
const statusCode = require("../../module/util/statusCode");
const Blog = require("../../model/blog");

const authUtil = require("../../module/util/authUtils");
const Confirm = authUtil.Confirm;

router.get("/", function(req, res, next) {
  Blog.readAll()
    .then(result => {
      res.status(statusCode.OK).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(statusCode.NOT_FOUND).json(err);
    });
});

router.get("/:blogIdx", function(req, res, next) {
  let blogIdx = req.params.blogIdx;
  Blog.read(blogIdx)
    .then(result => res.status(statusCode.OK).json(result))
    .catch(err => {
      console.log(err);
      res.status(statusCode.INTERNAL_SERVER_ERROR).json(err);
    });
});

router.post("/", Confirm, function(req, res, next) {
  const { name, owner } = req.body;
  if (!name || !owner) {
    res.status(statusCode.NO_CONTENT).json(responseMessage.NULL_VALUE);
    return;
  }

  Blog.create({ name, owner })
    .then(result => res.status(statusCode.OK).json(result))
    .catch(err => res.status(statusCode).json(err));
});

router.put("/:blogIdx", Confirm, function(req, res, next) {
  const blogIdx = req.params.blogIdx;
  const { name, owner } = req.body;

  if (!name || !owner) {
    res.status(statusCode.NO_CONTENT).json(responseMessage.NULL_VALUE);
    return;
  }

  Blog.update({ blogIdx, name, owner })
    .then(result => res.status(statusCode.OK).json(result))
    .catch(err => {
      console.log(err);
      res.status(statusCode.BAD_REQUEST).json(err);
    });
});

router.delete("/:blogIdx", Confirm, function(req, res, next) {
  // 블로그 글 삭제하기
  const blogIdx = req.params.blogIdx;
  Blog.delete(blogIdx)
    .then(result => res.status(statusCode.OK).json(result))
    .catch(err => {
      console.log(err);
      res.status(statusCode.BAD_REQUEST).json(err);
    });
});
router.use("/:blogIdx/articles", articleRouter);
module.exports = router;
