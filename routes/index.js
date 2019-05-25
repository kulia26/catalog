var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Головна | Каталог' });
});

router.get('/index.html', function(req, res, next) {
  res.render('index', { title: 'Головна | Каталог' });
});

module.exports = router;
