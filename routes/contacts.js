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
    fs.writeFile('./uploads/images/' + fileName, req.file.buffer, (err) => {
      if (err) throw err;
    }); 
    const writeDataTxt = (err, data) => {
      if (err) throw err;
      const newReq = req.body;
      newReq.image = './uploads/images/' + fileName;
      newReq.time = Date.now().toString();
      const hash = checksum(newReq.name  + newReq.organization + Date.now());
      let requests = JSON.parse(data);
      if (!requests) {
        requests = {};
      }
      requests[hash] = newReq;
      fs.writeFile('./uploads/data.json', JSON.stringify(requests), (err) => {
        if (err) throw err;
      });
    };
    fs.readFile('./uploads/data.json', writeDataTxt);
  }
};

router.get('/', (req, res) => {
  res.render('contacts', { title: 'Зворотній зв\'язок | Каталог' });
});
router.post('/', upload.single('file'),
  [
    check('name')
      .not()
      .isEmpty()
      .isLength({ min: 5 })
      .withMessage('Введіть коректне ім`я'),
    check('organization')
      .not()
      .isEmpty()
      .isLength({ min: 5 })
      .withMessage('Яку організацію ви представляєте?'),
    check('select')
      .not()
      .isEmpty()
      .withMessage('Оберіть тип звернення'),
    check('text').isLength({ min: 5 }).withMessage('Введіть ваше повідомлення'),
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
      res.render('messages', { messages: ['Дякуємо за ваше звернення ! 🤙'] });
    }
  });



module.exports = router;
