var express = require("express");
var router = express.Router();
var number = 0;
router.randomnumber4 = function(){
  number = Math.floor(Math.random() * (1 + 4 - 1) + 1);
  return number;
}
router.randomnumber6 = function(){
  number = Math.floor(Math.random() * (1 + 6 - 1) + 1);
  return number;
}
router.randomnumber8 = function(){
  number = Math.floor(Math.random() * (1 + 8 - 1) + 1);
  return number;
}
router.randomnumber10 = function(){
  number = Math.floor(Math.random() * (1 + 10 - 1) + 1);
  return number;
}
router.randomnumber20 = function(){
  number = Math.floor(Math.random() * (1 + 20 - 1) + 1);
  return number;
}
router.randomnumber100 = function(){
  number = Math.floor(Math.random() * (1 + 100 - 1) + 1);
  return number;
}
module.exports = router;
