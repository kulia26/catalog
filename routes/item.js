var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('item', { title: 'Про нас | Каталог', item : 'MacBook Pro mid 2013'});
});

module.exports = router;
