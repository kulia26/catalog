var express = require('express');
var router = express.Router();
var multer  = require('multer');
const path = require('path');
const crypto = require('crypto');

function checksum(str, algorithm, encoding) {
  return crypto
    .createHash(algorithm || 'sha1')
    .update(str, 'utf8')
    .digest(encoding || 'hex')
}

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/images');
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);

    cb(null, checksum(file.originalname+file.size+Date.now())+ext);
  }
})
 
var upload = multer({ storage: storage })


let { check,validationResult } = require('express-validator/check');

/* GET home page. */

router.get('/', function(req, res, next) {
    res.render('contacts', { title: 'Зворотній зв\'язок | Каталог' });
});
router.post('/', upload.single('file'),
[
  check('name').not().isEmpty().isLength({ min: 5 }).withMessage('Введіть коректне ім\`я'), 
  check('organization').not().isEmpty().isLength({ min: 2 }).withMessage('Яку організацію ви представляєте?'),   
  check('select').not().isEmpty().withMessage('Оберіть тип звернення'), 
  check('text').isLength({ min: 1 }).withMessage('Введіть ваше повідомлення'),   
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
    res.render('messages', {messages : ['Дякуємо за ваше звернення ! 🤙']});
  } 
});

module.exports = router;
