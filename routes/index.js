const express = require("express");
const router = express.Router();
const blogRouter = require("./blogs");
/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.use("/blogs", blogRouter);
module.exports = router;
