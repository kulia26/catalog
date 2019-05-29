'use strict';
const express = require('express');
const router = express.Router();

/* GET home page. */

router.get('/', (req, res) => {
  const itm = 'MacBook Pro mid 2013';
  res.render('item', { title: itm + ' | Каталог', item: itm });
});

module.exports = router;
