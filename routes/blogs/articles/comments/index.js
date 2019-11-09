var express = require("express");
var router = express.Router({ mergeParams: true });
const pool = require("../../../../module/poolAsync");
const authUtil = require("../../../../module/authUtil");
const responseMessage = require("../../../../module/responseMessage");
/* GET users listing. */
router.get("/", function(req, res, next) {
  const articleIdx = req.params.articleIdx;
  const query = `SELECT * FROM comment WHERE articleIdx=${articleIdx}`;
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

router.get("/:commentIdx", function(req, res, next) {
  const commentIdx = req.params.commentIdx;
  const articleIdx = req.params.articleIdx;
  const query = `SELECT * FROM comment WHERE commentIdx=${commentIdx} AND articleIdx=${articleIdx}`;
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
      console.log(authUtil.successFalse(responseMessage.BOARD_READ_ALL_FAIL));
    });
  /*
  GET 메서드를 이용해서 글 하나만 보여준다.
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
  const articleIdx = req.params.articleIdx;
  const { commentIdx, name, author, contents } = req.body;
  const query = "INSERT INTO comment values(?,?,?,?,?)";
  const value = [commentIdx, name, author, contents, articleIdx];
  pool
    .queryParam_Parse(query, value)
    .then(data => {
      let finish = authUtil.successTrue(
        responseMessage.BOARD_CREATE_SUCCESS,
        data
      );
      console.log(finish.data);
      res.send(finish.message);
    })
    .catch(err => {
      console.log(err);
      console.log(authUtil.successFalse(responseMessage.BOARD_CREATE_FAIL));
    });
});

router.put("/:commentIdx", function(req, res, next) {
  //블로그 글 수정하기 (어쩌면 PATCH가 더 좋을 지도 모르겠음)
  const commentIdx = req.params.commentIdx;
  const articleIdx = req.params.articleIdx;
  const { name, author, contents } = req.body;
  const query = `UPDATE comment SET name='${name}', author='${author}', contents='${contents}' WHERE commentIdx=${commentIdx} AND articleIdx=${articleIdx}`;
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

router.delete("/:commentIdx", function(req, res, next) {
  // 글 삭제하기
  const commentIdx = req.params.commentIdx;
  const articleIdx = req.params.articleIdx;
  const query = `DELETE FROM comment WHERE commentIdx=${commentIdx} AND articleIdx=${articleIdx}`;
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

module.exports = router;
