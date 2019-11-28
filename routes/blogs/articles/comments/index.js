var express = require("express");
var router = express.Router({ mergeParams: true });
const utils = require("../../../../module/util/utils");
const responseMessage = require("../../../../module/util/responseMessage");
const statusCode = require("../../../../module/util/statusCode");
const Comment = require("../../../../model/comment");
const Confirm = require("../../../../module/util/authUtils").Confirm;
/* GET users listing. */
router.get("/", function(req, res, next) {
  const articleIdx = req.params.articleIdx;
  Comment.readAll(articleIdx)
    .then(result => {
      res.status(statusCode.OK).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(statusCode.BAD_REQUEST).json(err);
    });
});

router.get("/:commentIdx", function(req, res, next) {
  const commentIdx = req.params.commentIdx;
  const articleIdx = req.params.articleIdx;
  Comment.read({ commentIdx, articleIdx })
    .then(result => {
      res.status(statusCode.OK).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(statusCode.BAD_REQUEST).json(err);
    });
});

router.post("/", Confirm, function(req, res, next) {
  const articleIdx = req.params.articleIdx;
  const { name, author, contents } = req.body;

  if (!name || !author || !contents) {
    res
      .status(statusCode.NO_CONTENT)
      .json(utils.successFalse(responseMessage.NULL_VALUE));
    return;
  }

  Comment.create({ name, author, contents, articleIdx })
    .then(result => res.status(statusCode.OK).json(result))
    .catch(err => {
      console.log(err);
      res.status(statusCode.BAD_REQUEST).json(err);
    });
});

router.put("/:commentIdx", Confirm, function(req, res, next) {
  //블로그 글 수정하기 (어쩌면 PATCH가 더 좋을 지도 모르겠음)
  const commentIdx = req.params.commentIdx;
  const articleIdx = req.params.articleIdx;
  const { name, author, contents } = req.body;

  Comment.update({ commentIdx, articleIdx, name, author, contents })
    .then(result => res.status(statusCode.OK).json(result))
    .catch(err => {
      console.log(err);
      res.status(statusCode.BAD_REQUEST).json(err);
    });
});

router.delete("/:commentIdx", Confirm, function(req, res, next) {
  // 글 삭제하기
  const commentIdx = req.params.commentIdx;
  const articleIdx = req.params.articleIdx;
  Comment.delete({ articleIdx, commentIdx })
    .then(result => res.status(statusCode.OK).json(result))
    .catch(err => {
      console.log(err);
      res.status(statusCode.BAD_REQUEST).json(err);
    });
});

module.exports = router;
