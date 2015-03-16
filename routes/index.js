var express = require('express');
var router = express.Router();

router.route('/').get(function(req, res){
  res.render('index');
});

router.route('/partials/*').get(function (req, res) {
  res.render(req.path.substr(1));
  //TODO: add error handling
});

//catch-all route
router.route('*').get(function (req, res) {
    res.render('index');
});

module.exports = router;
