const http = require('http');
const fs = require('fs');
const path = require('path')
const express = require('express');

const hostname = '0.0.0.0';
const port = 8080;
const app = express();

app.get(/(\/index\.html)|(\/)/,(req, res)=>{
  req.sendFile(res.params.file);
});

