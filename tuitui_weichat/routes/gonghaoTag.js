var express = require('express');
var router = express.Router();
var GonghaoTagModel = require('../model/GonghaoTag.js')

router.get('/', function (req, res, next) {
  GonghaoTagModel.find(function (err, result) {
    if (err) {
      console.log(err)
      res.send({
        err: err
      })
    } else {
      res.send({
        success: "查询成功",
        data: result
      })
    }
  })
})

router.get('/get_name', function (req, res, next) {
  GonghaoTagModel.findOne({
    _id: req.query.tagId
  }, function (err, result) {
    if (err) {
      console.log(err)
      res.send({
        err: err
      })
    } else {
      res.send({
        success: "查询成功",
        data: result
      })
    }
  })
})

router.post('/', function (req, res, next) {
  GonghaoTagModel.findOne({
    name: req.body.name
  }, function (err, result) {
    if (err) {
      console.log(err)
      res.send({
        err: err
      })
    } else {
      console.log('result', result)
      if (result) {
        console.log("有数据")
        res.send({
          success: "查询成功",
          exist: 1,
          data: result
        })
      } else {
        console.log("新增用户")
        var tm = GonghaoTagModel({
          name: req.body.name
        })
        tm.save(function (error, tm) {
          console.log(error)
          res.send({
            success: "查询成功",
            exist: 0,
            data: tm
          })
        });
      }
    }
  });
})


router.delete('/:id', function (req, res, next) {
  GonghaoTagModel.findByIdAndRemove(req.params.id, function (err, result) {
    if (err) {
      console.log(err);
      res.send({
        err: err
      })
    } else {
      res.send({
        success: "删除成功"
      })
    }
  })
})



module.exports = router;