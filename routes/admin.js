'use strict';
const express = require('express');
const router = express.Router();
const multer  = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');



router.get('/', (req, res) => {
  const parseData = (err, data) => {
    if (err) throw err;
    const requests = JSON.parse(data);
    for (const key in requests) {
      console.log(requests[key].image);
    }
    res.render('admin', { data: requests });
  };
  fs.readFile('./public/uploads/data.json', parseData);
});


module.exports = router;
