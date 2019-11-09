const express = require("express");
const router = express.Router({ mergeParams: true });
const articleRouter = require("./articles");
const pool = require("../../module/poolAsync");
const authUtil = require("../../module/authUtil");
const responseMessage = require("../../module/responseMessage");
/* GET users listing. */
router.get("/", function(req, res, next) {
  const query = "SELECT * FROM blog";
  pool
    .queryParam_None(query)
    .then(data => {
      let finish = authUtil.successTrue(
        responseMessage.BOARD_READ_ALL_SUCCESS,
        data
      );
      console.log(finish.data);
      res.send(finish.data);
    })
    .catch(err => {
      console.log(err);
      console.log(authUtil.successFalse(responseMessage.BOARD_READ_ALL_FAIL));
    });
  /*
  GET 메서드를 이용해서 블로그 글 전체 보기
  1. poolAsync에서 메서드를 이용해서 전체 내용을 가져온다.
  2. 가져온 내용을 res.send()로 보내준다.
  */
});

router.get("/:blogIdx", function(req, res, next) {
  let idx = req.params.blogIdx;
  // const query = `SELECT * FROM blog WHERE blogIdx=${idx}`;
  const query = `SELECT * FROM blog WHERE blogIdx=${idx}`;
  pool
    .queryParam_None(query)
    .then(data => {
      let finish = authUtil.successTrue(
        responseMessage.BOARD_READ_SUCCESS,
        data
      );
      console.log(finish.data);
      res.send(finish.data);
    })
    .catch(err => {
      console.log(err);
      console.log(authUtil.successFalse(responseMessage.BOARD_READ_FAIL));
    });
  /*
  GET 메서드를 이용해서 블로그 글 하나만 보여준다.
  1. poolAsync에서 메서드를 이용해서, blogIdx와 맞는 데이터만 가져온다.
  2. 가져온 내용을 res.send()로 보내준다.
  */
});

router.post("/", function(req, res, next) {
  // 블로그 글 쓰기
  /*
  POST request 구현 방법
  1. poolAsync.param_none을 이용해서 쿼리문을 보내고, DB에 글을 추가한다.
  2. 추가를 완료했음을 페이지에 보내준다.
  */
  const { blogIdx, name, owner } = req.body;
  const query = "INSERT INTO blog values(?,?,?)";
  const value = [blogIdx, name, owner];
  pool
    .queryParam_Parse(query, value)
    .then(data => {
      let finish = authUtil.successTrue(
        responseMessage.BOARD_CREATE_SUCCESS,
        data
      );
      console.log(finish.message);
      res.send(finish.message);
    })
    .catch(err => {
      console.log(err);
      console.log(authUtil.successFalse(responseMessage.BOARD_CREATE_FAIL));
    });
});

router.put("/:blogIdx", function(req, res, next) {
  //블로그 글 수정하기 (어쩌면 PATCH가 더 좋을 지도 모르겠음)
  const blogIdx = req.params.blogIdx;
  const { name, owner } = req.body;
  const query = `UPDATE blog SET name='${name}', owner='${owner}' WHERE blogIdx=${blogIdx}`;
  pool
    .queryParam_None(query)
    .then(data => {
      let finish = authUtil.successTrue(
        responseMessage.BOARD_UPDATE_SUCCESS,
        data
      );
      console.log(finish.data);
      res.send(finish.message);
    })
    .catch(err => {
      console.log(err);
      console.log(authUtil.successFalse(responseMessage.BOARD_UPDATE_FAIL));
    });
});

router.delete("/:blogIdx", function(req, res, next) {
  // 블로그 글 삭제하기
  const blogIdx = req.params.blogIdx;
  const query = `DELETE FROM blog WHERE blogIdx=${blogIdx}`;
  pool
    .queryParam_None(query)
    .then(data => {
      let finish = authUtil.successTrue(
        responseMessage.BOARD_DELETE_SUCCESS,
        data
      );
      console.log(finish.data);
      res.send(finish.message);
    })
    .catch(err => {
      console.log(err);
      console.log(authUtil.successFalse(responseMessage.BOARD_DELETE_FAIL));
    });
});
router.use("/:blogIdx/articles", articleRouter);
module.exports = router;
