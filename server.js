const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const port = 9000;


let db = new sqlite3.Database('./database.sql');


db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS urls (id INTEGER PRIMARY KEY, original_url TEXT NOT NULL, short_url TEXT NOT NULL)');
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


function generateShortURL() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}


app.post('/shorten', (req, res) => {
  const originalUrl = req.body.url;
  const shortUrl = generateShortURL();

  
  db.run('INSERT INTO urls (original_url, short_url) VALUES (?, ?)', [originalUrl, shortUrl], function (err) {
    if (err) {
      return res.status(500).send('Error occurred');
    }
    res.send(`Short URL: <a href="/${shortUrl}">/${shortUrl}</a>`);
  });
});


app.get('/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl;


  db.get('SELECT original_url FROM urls WHERE short_url = ?', [shortUrl], (err, row) => {
    if (err || !row) {
      return res.status(404).send('Short URL not found');
    }
    res.redirect(row.original_url);
  });
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


