const http = require('http');
const fs = require('fs');
const path = require('path')

const hostname = '0.0.0.0';
const port = 8080;

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, path.sep,'app');
  filePath += req.url !== '/' ? req.url : "/index.html";


  fs.exists(filePath, (exists) => {

    if (exists) {
      let types = {
        '.css':'text/css',
        '.html':'text/html',
        '.js':'text/javascript',
        '.pdf':'application/pdf',
      }

      let type = Object.keys(types).includes(path.extname(filePath)) ? types[path.extname(filePath)] : 'text/plain';
      res.setHeader('Content-Type', type);

      res.statusCode = 200;
      let readStream = fs.createReadStream(filePath);
      readStream.pipe(res);
    } else {
      res.setHeader("Content-Type", "text/plain");
      res.statusCode = 404;
      res.end("Page not found");
    };
  });

});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
