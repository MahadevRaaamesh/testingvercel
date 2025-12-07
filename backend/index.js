const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000; 

if (!process.env.DATABASE_URL) {
  console.warn('Warning: DATABASE_URL is not set. dotenv may not have loaded .env from the expected path. Current cwd:', process.cwd());
} else {
  const dbUrl = process.env.DATABASE_URL;
  const masked = dbUrl.replace(/(:\/\/[^:]+):([^@]+)@/, (m, p1) => p1 + ':***@');
  console.log('Loaded DATABASE_URL (masked):', masked);
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,  'frontend')));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false 
  }
});

app.get('/api/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY created_at ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.post('/api/tasks', async (req, res) => {
  const { description } = req.body;
  if (!description) return res.status(400).json({ message: 'Description is required' });

  try {
    const result = await pool.query(
      'INSERT INTO tasks (description) VALUES ($1) RETURNING *',
      [description]
    );
    res.status(201).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted successfully', task: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

module.exports = app; 

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running locally on port ${PORT}`));
}