const express = require('express');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Initialize database and insert data if not present
async function initializeDB() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL
    )
  `);

  const [rows] = await db.query('SELECT COUNT(*) AS count FROM items');
  if (rows[0].count === 0) {
    await db.query(`
      INSERT INTO items (name, description) VALUES
      ('Mobile1', 'Oneplus 6'),
      ('Mobile2', 'Oneplus 11')
    `);
  }
}

initializeDB().catch(err => console.error(err));

// Routes
app.get('/items', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM items');
    res.json(rows);
  } catch (err) {
    res.status(500).send('Error retrieving data from database');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
