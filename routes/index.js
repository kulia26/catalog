'use strict';
const express = require('express');
const router = express.Router();
const fs = require('fs');

/* GET home page. */
router.get('/index/:category', (req, res) => {
  console.log('category:' + req.params.category);
  const renderItems = (err, data) => {
    if (err) throw err;
    const allItems =  JSON.parse(data);
    const goodItems = {};
    const category = req.params.category;
    if (!category || category === 'index') {
      res.render('index', { title: 'Всі товари', items: allItems });
      return;
    }
    for (const key in allItems) {
      if (allItems.hasOwnProperty(key)) {
        const item = allItems[key];
        if (item.category === category) {
          goodItems[key] = item;
        }
      }
    }
    const categories = {
      'laptops': 'Ноутбуки',
      'tablets': 'Планшети',
      'smartphones': 'Смартфони',
      'keyboards': 'Клавіатури',
      'mouses': 'Мишки',
      'headphones': 'Навушники',
      'players': 'Плеєри',
    };
    res.render('index', { title: categories[category], items: goodItems });
  };
  fs.readFile('./public/uploads/items.json', renderItems);
});

router.get('/', (req, res) => {
  const renderItems = (err, data) => {
    if (err) throw err;
    res.render('index', { title: 'Всі товари', items: JSON.parse(data) });
  };
  fs.readFile('./public/uploads/items.json', renderItems);
});

module.exports = router;
