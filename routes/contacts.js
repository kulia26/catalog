var express = require('express');
var router = express.Router();
var multer  = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

function checksum(str, algorithm, encoding) {
  return crypto
    .createHash(algorithm || 'sha1')
    .update(str, 'utf8')
    .digest(encoding || 'hex')
}

var storage = multer.memoryStorage();
 
var upload = multer({ storage: storage })


let { check,validationResult } = require('express-validator/check');

/* GET home page. */

router.get('/', function(req, res, next) {
    res.render('contacts', { title: 'Зворотній зв\'язок | Каталог' });
});
router.post('/', upload.single('file'),
[
  check('name').not().isEmpty().isLength({ min: 5 }).withMessage('Введіть коректне ім\`я'), 
  check('organization').not().isEmpty().isLength({ min: 5 }).withMessage('Яку організацію ви представляєте?'),   
  check('select').not().isEmpty().withMessage('Оберіть тип звернення'), 
  check('text').isLength({ min: 5 }).withMessage('Введіть ваше повідомлення'),   
],
 function(req, res) {
  if(!validationResult(req).isEmpty()){
    res.render('messages', { errors: validationResult(req)
      .array()
      .filter((el) => el.msg !== 'Invalid value')
      .map(el => {
        el.msg = "❌" + el.msg;
        return el; 
      })
    });
  }
  else{
    saveRequestData(req);
    res.render('messages', {messages : ['Дякуємо за ваше звернення ! 🤙']});
  } 
});

let saveRequestData = (req) =>{
  if (!req.file){
    throw new Error('Ви не завантажили файл');
  }else{
    let ext = path.extname(req.file.originalname);
    let fileName = checksum(req.file.originalname+req.file.size+Date.now())+ext;
    fs.writeFile('./uploads/images/'+fileName, req.file.buffer, (err) => {
      if (err) throw err;
    });
    const data = req.body;
    data.filePath = './uploads/images/'+fileName;
    data.time = Date.now().toString();
    fs.writeFile('./uploads/data/'+checksum(data.name+data.text+data.organization+Date.now()), JSON.stringify(data), (err) => {
      if (err) throw err;
    });
  }
}

module.exports = router;
