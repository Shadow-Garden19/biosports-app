/**
 * Serveur HTTP pour BIOSPORTS - accessible depuis le telephone sur le meme Wi-Fi.
 * Ecoute sur 0.0.0.0 pour accepter les connexions du reseau local.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8770;
const DIST = path.join(__dirname, 'dist');

const MIMES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function getLocalIP() {
  const os = require('os');
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) return net.address;
    }
  }
  return 'localhost';
}

const server = http.createServer((req, res) => {
  // Page de test pour verifier depuis le telephone
  if (req.url === '/test' || req.url === '/test/') {
    const ip = getLocalIP();
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Test</title></head>
<body style="font-family:sans-serif;padding:20px;text-align:center;">
  <h1>BIOSPORTS – Connexion OK</h1>
  <p>Si tu vois cette page sur ton telephone, le reseau fonctionne.</p>
  <p><a href="/" style="font-size:1.2em;color:#2563eb;">Ouvre l\'app BIOSPORTS ici</a></p>
  <p style="color:#666;font-size:0.9em;">URL : http://${ip}:${PORT}</p>
</body></html>`);
    return;
  }

  let urlPath = req.url.split('?')[0].replace(/^\//, '');
  if (urlPath === '') urlPath = 'index.html';
  const safePath = path.normalize(urlPath).replace(/^(\.\.(\/|\\))+/, '');
  const filePath = path.join(DIST, safePath);

  if (!filePath.startsWith(DIST)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      fs.readFile(path.join(DIST, 'index.html'), (e, data) => {
        if (e) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      });
      return;
    }
    const ext = path.extname(filePath);
    const contentType = MIMES[ext] || 'application/octet-stream';
    fs.readFile(filePath, (e, data) => {
      if (e) {
        res.writeHead(500);
        res.end('Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIP();
  console.log('');
  console.log('  BIOSPORTS - Serveur pour telephone');
  console.log('  =================================');
  console.log('');
  console.log('  Sur ce PC :     http://localhost:' + PORT);
  console.log('  Sur ton tel :   http://' + ip + ':' + PORT);
  console.log('  Test tel :      http://' + ip + ':' + PORT + '/test');
  console.log('');
  console.log('  Sur ton Samsung : ouvre Chrome et tape l\'adresse "Sur ton tel".');
  console.log('  (Telephone et PC sur le meme Wi-Fi)');
  console.log('');
});
