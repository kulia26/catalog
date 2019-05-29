'use strict';
const express = require('express');
const router = express.Router();
const multer  = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');


router.get('/', (req, res) => {
  res.render('admin', { title: 'Зворотній зв\'язок | Каталог' });
});


module.exports = router;
