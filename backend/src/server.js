const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Setup
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Users Table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone TEXT UNIQUE,
      language TEXT
    )`);

    // Tips Table
    db.run(`CREATE TABLE IF NOT EXISTS tips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT,
      category TEXT
    )`);

    // Insert Demo Data if empty
    db.get("SELECT COUNT(*) as count FROM tips", (err, row) => {
      if (row.count === 0) {
        const stmt = db.prepare("INSERT INTO tips (title, content, category) VALUES (?, ?, ?)");
        stmt.run("Organic Fertilizer", "Use neem cake for better soil health.", "farming");
        stmt.run("Crop Rotation", "Rotate wheat with legumes to fix nitrogen.", "farming");
        stmt.run("PM-Kisan", "Government subsidy of ₹6000 for small farmers.", "govt");
        stmt.finalize();
      }
    });
  });
}

// Routes
const chatRouter = require('./routes/chat');
app.use('/api/chat', chatRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI SATHI API is running' });
});

app.get('/api/tips', (req, res) => {
  db.all("SELECT * FROM tips", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/weather', (req, res) => {
  // Mock weather data
  res.json({
    temp: 32,
    condition: 'Sunny',
    humidity: 45,
    recommendation: 'Good time for sowing wheat.'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
