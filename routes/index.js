/*
 * GET home page.
 */
var express = require('express');
var router = express.Router();

router.route('/').get(function(req, res){
  res.render('index');
});

router.route('/partials/:name').get(function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
});

module.exports = router;
