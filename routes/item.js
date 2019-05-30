'use strict';
const express = require('express');
const router = express.Router();
const fs = require('fs');

/* GET home page. */

router.get('/:hash', (req, res) => {
  const renderItems = (err, data) => {
    if (err) throw err;
    const hash  = req.params.hash;
    console.log('hash: ' + hash);
    if (hash === '') {
      throw new Error('Вибачте, ми не знайшли цей товар (');
    }
    const itm =  JSON.parse(data)[hash];
    res.render('item', { item: itm });
  };
  fs.readFile('./public/uploads/items.json', renderItems);
});

module.exports = router;
