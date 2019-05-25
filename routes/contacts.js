var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('contacts', { title: 'Про нас | Каталог' });
});

module.exports = router;
