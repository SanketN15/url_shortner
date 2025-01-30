# URL Shortener using Node.js & SQLite

This project is a **URL Shortener** built using **Node.js, Express.js, and SQLite**. Users can enter a long URL and receive a shortened version, which redirects to the original URL when accessed.

## Features 🚀
- Generates **random 6-character short URLs**.
- Stores URLs in an **SQLite database**.
- **Redirects** users when they visit a shortened URL.
- Runs on **Express.js** web framework.

---

## Folder Structure 📂
```
project-folder/
│── public/          # Static files (if any)
│── database.sql     # SQLite database file
│── server.js        # Main application file
│── package.json     # Dependencies & scripts
```

---

## Installation & Setup 🛠️
### 1. Clone the Repository
```sh
git clone https://github.com/yourusername/url-shortener.git
cd url-shortener
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Start the Server
```sh
node server.js
```

### 4. Open in Browser
Visit: `http://localhost:9000`

---

## Code Breakdown 🔍

### 1. **Import Dependencies**
```js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
```
- **Express.js** handles HTTP requests.
- **SQLite3** stores URL mappings.
- **Body-parser** processes form data.

### 2. **Initialize Server & Database**
```js
const app = express();
const port = 9000;
let db = new sqlite3.Database('./database.sql');
```
- Sets up the server on **port 9000**.
- Connects to `database.sql` (or creates it if missing).

### 3. **Create Table (if not exists)**
```js
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS urls (id INTEGER PRIMARY KEY, original_url TEXT NOT NULL, short_url TEXT NOT NULL)');
});
```
- Ensures a table `urls` exists for storing URL mappings.

### 4. **Middleware for Parsing & Static Files**
```js
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
```
- `bodyParser.urlencoded({ extended: true })` allows form data parsing.
- `express.static('public')` serves static files.

### 5. **Function to Generate Short URL**
```js
function generateShortURL() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
```
- Creates a **random 6-character** string for short URLs.

### 6. **Handle URL Shortening (POST Request)**
```js
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
```
- Gets **original URL** from form submission.
- Generates **a random short URL**.
- Saves both in the **database**.
- Returns a **clickable short URL**.

### 7. **Redirect to Original URL (GET Request)**
```js
app.get('/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl;

  db.get('SELECT original_url FROM urls WHERE short_url = ?', [shortUrl], (err, row) => {
    if (err || !row) {
      return res.status(404).send('Short URL not found');
    }
    res.redirect(row.original_url);
  });
});
```
- **Fetches original URL** from the database based on `shortUrl`.
- **Redirects the user** to the original website.
- **Handles errors** (if short URL does not exist).

### 8. **Start Server**
```js
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
```
- Starts the Express server at `http://localhost:9000`.

---

## How It Works ⚡
1. **User submits a long URL** (e.g., `https://example.com`).
2. **Server generates a short URL** (e.g., `http://localhost:9000/XyZ123`).
3. **User visits the short URL**, and it redirects them to the original URL.

---

## Issues & Fixes ✅
### 🔹 Possible Improvements
- Store timestamps for tracking URL usage.
- Implement **custom short URLs** (user-defined).
- Add an **admin panel** to manage short links.
- Validate user input to prevent invalid URLs.

---

## License 📜
This project is open-source. Modify and improve it as needed. 😊


