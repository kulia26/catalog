'use strict';
const express = require('express');
const router = express.Router();
const multer  = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

function checksum(str, algorithm, encoding) {
  return crypto
    .createHash(algorithm || 'sha1')
    .update(str, 'utf8')
    .digest(encoding || 'hex');
}

const storage = multer.memoryStorage();

const upload = multer({ storage });


const { check, validationResult } = require('express-validator/check');

/* GET home page. */

const saveRequestData = (req) => {
  if (!req.file) {
    throw new Error('Ви не завантажили файл');
  } else {
    const ext = path.extname(req.file.originalname);
    const sum  = checksum(req.file.originalname + req.file.size + Date.now());
    const fileName =  sum + ext;
    fs.writeFile('./public/uploads/items_images/' + fileName, req.file.buffer, (err) => {
      if (err) throw err;
    });
    const writeData = (err, data) => {
      if (err) throw err;
      const item = {};
      item.image = '../uploads/items_images/' + fileName;
      item.time = Date.now().toString();
      item.name = req.body.name;
      item.description = req.body.description;
      item.category = req.body.category;
      const hash = checksum(item.name + Date.now());
      let allItems = JSON.parse(data);
      if (!allItems) {
        allItems = {};
      }
      allItems[hash] = item;
      fs.writeFile('./public/uploads/items.json', JSON.stringify(allItems), (err) => {
        if (err) throw err;
      });
    };
    fs.readFile('./public/uploads/items.json', writeData);
  }
};

router.get('/', (req, res) => {
  res.render('additem', { title: 'Додати товар | Каталог' });
});
router.post('/', upload.single('file'),
  [
    check('name')
      .not()
      .isEmpty()
      .withMessage('Введіть коректну назву товару'),
    check('description')
      .not()
      .isEmpty()
      .withMessage('Введіть коректний опис товару'),
    check('category')
      .not()
      .isEmpty()
      .withMessage('Оберіть категорію'),
  ],
  (req, res) => {
    if (!validationResult(req).isEmpty()) {
      res.render('messages', { errors: validationResult(req)
        .array()
        .filter((el) => el.msg !== 'Invalid value')
        .map(el => {
          el.msg = '❌' + el.msg;
          return el;
        })
      });
    } else {
      saveRequestData(req);
      res.render('messages', { messages: ['🙌 Товар успішно додано'] });
    }
  });



module.exports = router;
