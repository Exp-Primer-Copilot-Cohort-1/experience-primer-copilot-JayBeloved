// Create webserver

const fs = require('fs');
const http = require('http');
const port = 3000;

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/comments') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      const comments = JSON.parse(fs.readFileSync('./comments.json', 'utf-8'));
      const newComment = {
        timestamp: Date.now(),
        comment: JSON.parse(body).comment
      };

      comments.push(newComment);
      fs.writeFileSync('./comments.json', JSON.stringify(comments));

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(comments));
    });
  } else if (req.method === 'GET' && req.url === '/comments') {
    const comments = JSON.parse(fs.readFileSync('./comments.json', 'utf-8'));

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(comments));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
