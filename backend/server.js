const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connessione al database SQLite
const dbPath = path.join(__dirname, 'react.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Errore durante l\'apertura del database', err);
  } else {
    console.log('Connesso al database SQLite:', dbPath);
    
    // Verifica che le tabelle esistano
    db.get("SELECT COUNT(*) as count FROM sqlite_master WHERE type='table'", (err, row) => {
      if (err) {
        console.error('Errore nel verificare le tabelle:', err);
      } else {
        console.log(`Numero di tabelle nel database: ${row.count}`);
        
        // Verifica che ci siano dati
        db.get("SELECT COUNT(*) as count FROM users", (err, userRow) => {
          if (!err) {
            console.log(`Numero di utenti: ${userRow.count}`);
          }
        });
      }
    });
  }
});

// Route di test
app.get('/', (req, res) => {
  res.json({ 
    message: 'Fitness API Server è in esecuzione!',
    endpoints: [
      'GET /api/users',
      'GET /api/users/:id',
      'GET /api/activities/user/:userId',
      'GET /api/workout-plans',
      'POST /api/activities'
    ]
  });
});

// API Routes

// Get all users
app.get('/api/users', (req, res) => {
  console.log('GET /api/users chiamato');
  const sql = 'SELECT * FROM users';
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Errore database:', err);
      res.status(400).json({ error: err.message });
      return;
    }
    console.log(`Trovati ${rows.length} utenti`);
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// Route di login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e password sono richiesti' });
  }

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.get(sql, [email], (err, user) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    if (!user) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }

    // In un'app reale, dovresti usare bcrypt per confrontare le password hashate
    if (user.password_hash !== password) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }

    // Escludi la password dalla risposta
    const { password_hash, ...userWithoutPassword } = user;
    res.json({
      message: 'Login successful',
      user: userWithoutPassword
    });
  });
});

// Get user by id
app.get('/api/users/:id', (req, res) => {
  console.log(`GET /api/users/${req.params.id} chiamato`);
  const sql = 'SELECT * FROM users WHERE id = ?';
  const params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

// Get daily activities for a user
app.get('/api/activities/user/:userId', (req, res) => {
  console.log(`GET /api/activities/user/${req.params.userId} chiamato`);
  const sql = 'SELECT * FROM daily_activities WHERE user_id = ? ORDER BY date DESC';
  const params = [req.params.userId];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// Get workout plans by level and muscle group
app.get('/api/workout-plans', (req, res) => {
  console.log('GET /api/workout-plans chiamato');
  const { level, muscle_group } = req.query;
  let sql = 'SELECT * FROM workout_plans';
  let params = [];

  if (level && muscle_group) {
    sql += ' WHERE level = ? AND muscle_group = ?';
    params = [level, muscle_group];
  } else if (level) {
    sql += ' WHERE level = ?';
    params = [level];
  } else if (muscle_group) {
    sql += ' WHERE muscle_group = ?';
    params = [muscle_group];
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// Get exercises for a workout plan
app.get('/api/workout-plans/:id/exercises', (req, res) => {
  console.log(`GET /api/workout-plans/${req.params.id}/exercises chiamato`);
  const sql = `
    SELECT e.*, wpe.exercise_order, wpe.sets, wpe.reps, wpe.duration_seconds 
    FROM exercises e
    JOIN workout_plan_exercises wpe ON e.id = wpe.exercise_id
    WHERE wpe.workout_plan_id = ?
    ORDER BY wpe.exercise_order
  `;
  const params = [req.params.id];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// Add new daily activity
app.post('/api/activities', (req, res) => {
  console.log('POST /api/activities chiamato');
  const { user_id, date, steps, calories_burned, standing_hours, distance_meters } = req.body;
  const sql = `INSERT INTO daily_activities (user_id, date, steps, calories_burned, standing_hours, distance_meters) 
               VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [user_id, date, steps, calories_burned, standing_hours, distance_meters];
  
  db.run(sql, params, function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: { id: this.lastID },
      changes: this.changes
    });
  });
});

// **CORREZIONE: Route per gestire route non trovate - versione corretta**
app.use((req, res) => {
  res.status(404).json({
    error: 'Route non trovata',
    requested: req.originalUrl,
    available: [
      '/',
      '/api/users',
      '/api/users/:id',
      '/api/activities/user/:userId',
      '/api/workout-plans',
      '/api/workout-plans/:id/exercises',
      '/api/activities (POST)'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);
  console.log(`Testa le API su: http://localhost:${PORT}/api/users`);
});