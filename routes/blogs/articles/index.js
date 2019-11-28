const express = require("express");
const router = express.Router({ mergeParams: true });
const commentRouter = require("./comments");
const statusCode = require("../../../module/util/statusCode");
const upload = require("../../../config/multer");
const Article = require("../../../model/article");

const authUtil = require("../../../module/util/authUtils");
const Confirm = authUtil.Confirm;

/* GET users listing. */
router.get("/", function(req, res, next) {
  const blogIdx = req.params.blogIdx;
  Article.readAll(blogIdx)
    .then(result => res.status(statusCode.OK).json(result))
    .catch(err => {
      console.log(err);
      res.status(statusCode.BAD_REQUEST).json(err);
    });
});

router.get("/:articleIdx", function(req, res, next) {
  const articleIdx = req.params.articleIdx;
  const blogIdx = req.params.blogIdx;
  Article.read({ articleIdx, blogIdx })
    .then(result => res.status(statusCode.OK).json(result))
    .catch(err => {
      console.log(err);
      res.status(statusCode.BAD_REQUEST).json(err);
    });
});

router.post("/", Confirm, upload.array("photos", 5), (req, res, next) => {
  const blogIdx = req.params.blogIdx;
  const { name, author, contents } = req.body;
  const files = req.files.slice("").map(element => {
    return { originalname: element.originalname, location: element.location };
  });
  Article.create({ blogIdx, name, author, contents, files })
    .then(result => res.status(statusCode.OK).json(result))
    .catch(err => {
      console.log(err);
      res.status(statusCode.BAD_REQUEST).json(err);
    });
});

// router.post("/", (req, res, next) => {
//   const blogIdx = req.params.blogIdx;
//   const { name, author, contents } = req.body;
//   Article.create({ blogIdx, name, author, contents })
//     .then(result => res.status(statusCode.OK).json(result))
//     .catch(err => {
//       console.log(err);
//       res.status(statusCode.BAD_REQUEST).json(err);
//     });
// });

router.put("/:articleIdx", Confirm, function(req, res, next) {
  //블로그 글 수정하기 (어쩌면 PATCH가 더 좋을 지도 모르겠음)
  const articleIdx = req.params.articleIdx;
  const blogIdx = req.params.blogIdx;
  const { name, author, contents } = req.body;
  Article.update({ articleIdx, blogIdx, name, author, contents })
    .then(result => res.status(statusCode.OK).json(result))
    .catch(err => {
      console.log(err);
      res.status(statusCode.BAD_REQUEST).json(err);
    });
});

router.delete("/:articleIdx", Confirm, function(req, res, next) {
  // 글 삭제하기
  const articleIdx = req.params.articleIdx;
  const blogIdx = req.params.blogIdx;
  Article.delete({ articleIdx, blogIdx })
    .then(result => res.status(statusCode.OK).json(result))
    .catch(err => {
      console.log(err);
      res.status(statusCode.BAD_REQUEST).json(err);
    });
});

router.use("/:articleIdx/comments", commentRouter);
module.exports = router;
