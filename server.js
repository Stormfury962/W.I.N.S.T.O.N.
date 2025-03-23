// File structure:
// - server.js (main application file)
// - package.json (dependencies)
// - /config (database configuration)
// - /routes (API routes)
// - /models (database models)
// - /middleware (authentication middleware)
// - /public (static files, frontend)
// - /views (HTML templates)

// =====================================================
// server.js
// =====================================================
const express = require('express');
const mysql = require('mysql2/promise');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bcrypt = require('bcrypt');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'forum_db'
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
const sessionStore = new MySQLStore(dbConfig);
app.use(session({
  key: 'forum_session',
  secret: 'forum_session_secret',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  }
}));

// Create database connection pool
const pool = mysql.createPool(dbConfig);

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
};

const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.is_admin) {
    return next();
  }
  res.status(403).send('Access denied. Admin privileges required.');
};

// Make user data available to all templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// =====================================================
// Routes
// =====================================================

// Home page - display all posts
app.get('/', async (req, res) => {
  try {
    const [posts] = await pool.query(`
      SELECT p.*, u.username,
      (SELECT COUNT(*) FROM replies WHERE post_id = p.post_id) as reply_count,
      (SELECT COALESCE(SUM(CASE WHEN vote_type = 'upvote' THEN 1 WHEN vote_type = 'downvote' THEN -1 ELSE 0 END), 0)
       FROM votes WHERE post_id = p.post_id) as vote_score
      FROM posts p
      JOIN users u ON p.user_id = u.user_id
      ORDER BY p.created_at DESC
    `);
    
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Error fetching posts' });
  }
});

// API endpoint to get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const [posts] = await pool.query(`
      SELECT p.*, u.username,
      (SELECT COUNT(*) FROM replies WHERE post_id = p.post_id) as reply_count,
      (SELECT COALESCE(SUM(CASE WHEN vote_type = 'upvote' THEN 1 WHEN vote_type = 'downvote' THEN -1 ELSE 0 END), 0)
       FROM votes WHERE post_id = p.post_id) as vote_score
      FROM posts p
      JOIN users u ON p.user_id = u.user_id
      ORDER BY p.created_at DESC
    `);
    
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Error fetching posts' });
  }
});

// Get single post with replies
app.get('/api/posts/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    
    // Get post details
    const [posts] = await pool.query(`
      SELECT p.*, u.username,
      (SELECT COALESCE(SUM(CASE WHEN vote_type = 'upvote' THEN 1 WHEN vote_type = 'downvote' THEN -1 ELSE 0 END), 0)
       FROM votes WHERE post_id = p.post_id) as vote_score
      FROM posts p
      JOIN users u ON p.user_id = u.user_id
      WHERE p.post_id = ?
    `, [postId]);
    
    if (posts.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Get replies
    const [replies] = await pool.query(`
      SELECT r.*, u.username,
      (SELECT COALESCE(SUM(CASE WHEN vote_type = 'upvote' THEN 1 WHEN vote_type = 'downvote' THEN -1 ELSE 0 END), 0)
       FROM votes WHERE reply_id = r.reply_id) as vote_score
      FROM replies r
      JOIN users u ON r.user_id = u.user_id
      WHERE r.post_id = ?
      ORDER BY r.created_at ASC
    `, [postId]);
    
    // Get user's votes if logged in
    let userVotes = {};
    if (req.session.user) {
      const [postVotes] = await pool.query(
        'SELECT post_id, vote_type FROM votes WHERE user_id = ? AND post_id = ?',
        [req.session.user.user_id, postId]
      );
      
      const [replyVotes] = await pool.query(
        'SELECT reply_id, vote_type FROM votes WHERE user_id = ? AND reply_id IN (SELECT reply_id FROM replies WHERE post_id = ?)',
        [req.session.user.user_id, postId]
      );
      
      postVotes.forEach(vote => {
        userVotes[`post_${vote.post_id}`] = vote.vote_type;
      });
      
      replyVotes.forEach(vote => {
        userVotes[`reply_${vote.reply_id}`] = vote.vote_type;
      });
    }
    
    res.json({
      post: posts[0],
      replies,
      userVotes
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Error fetching post' });
  }
});

// Create new post
app.post('/api/posts', isAuthenticated, async (req, res) => {
  try {
    const { title, body } = req.body;
    const userId = req.session.user.user_id;
    
    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body are required' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO posts (user_id, title, body) VALUES (?, ?, ?)',
      [userId, title, body]
    );
    
    const postId = result.insertId;
    
    const [posts] = await pool.query(`
      SELECT p.*, u.username FROM posts p
      JOIN users u ON p.user_id = u.user_id
      WHERE p.post_id = ?
    `, [postId]);
    
    res.status(201).json(posts[0]);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Error creating post' });
  }
});

// Add reply to post
app.post('/api/posts/:id/replies', isAuthenticated, async (req, res) => {
  try {
    const postId = req.params.id;
    const { body } = req.body;
    const userId = req.session.user.user_id;
    
    if (!body) {
      return res.status(400).json({ error: 'Reply body is required' });
    }
    
    // Verify post exists
    const [posts] = await pool.query('SELECT * FROM posts WHERE post_id = ?', [postId]);
    if (posts.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO replies (post_id, user_id, body) VALUES (?, ?, ?)',
      [postId, userId, body]
    );
    
    const replyId = result.insertId;
    
    const [replies] = await pool.query(`
      SELECT r.*, u.username FROM replies r
      JOIN users u ON r.user_id = u.user_id
      WHERE r.reply_id = ?
    `, [replyId]);
    
    res.status(201).json(replies[0]);
  } catch (error) {
    console.error('Error creating reply:', error);
    res.status(500).json({ error: 'Error creating reply' });
  }
});

// Handle votes
app.post('/api/votes', isAuthenticated, async (req, res) => {
  try {
    const { post_id, reply_id, vote_type } = req.body;
    const userId = req.session.user.user_id;
    
    if ((!post_id && !reply_id) || (post_id && reply_id)) {
      return res.status(400).json({ error: 'Either post_id or reply_id must be provided, but not both' });
    }
    
    if (vote_type !== 'upvote' && vote_type !== 'downvote') {
      return res.status(400).json({ error: 'vote_type must be either "upvote" or "downvote"' });
    }
    
    let targetTable, targetId, idColumn;
    if (post_id) {
      targetTable = 'posts';
      targetId = post_id;
      idColumn = 'post_id';
    } else {
      targetTable = 'replies';
      targetId = reply_id;
      idColumn = 'reply_id';
    }
    
    // Verify target exists
    const [targets] = await pool.query(`SELECT * FROM ${targetTable} WHERE ${idColumn} = ?`, [targetId]);
    if (targets.length === 0) {
      return res.status(404).json({ error: `${targetTable.slice(0, -1)} not found` });
    }
    
    // Check if user already voted
    const [existingVotes] = await pool.query(
      `SELECT * FROM votes WHERE user_id = ? AND ${idColumn} = ?`,
      [userId, targetId]
    );
    
    let result;
    if (existingVotes.length > 0) {
      const existingVote = existingVotes[0];
      
      if (existingVote.vote_type === vote_type) {
        // Remove the vote if clicking the same button
        [result] = await pool.query(
          `DELETE FROM votes WHERE user_id = ? AND ${idColumn} = ?`,
          [userId, targetId]
        );
      } else {
        // Update vote if changing from upvote to downvote or vice versa
        [result] = await pool.query(
          `UPDATE votes SET vote_type = ? WHERE user_id = ? AND ${idColumn} = ?`,
          [vote_type, userId, targetId]
        );
      }
    } else {
      // Create new vote
      [result] = await pool.query(
        `INSERT INTO votes (user_id, ${idColumn}, vote_type) VALUES (?, ?, ?)`,
        [userId, targetId, vote_type]
      );
    }
    
    // Get updated vote score
    const [voteResults] = await pool.query(`
      SELECT COALESCE(SUM(CASE WHEN vote_type = 'upvote' THEN 1 WHEN vote_type = 'downvote' THEN -1 ELSE 0 END), 0) as vote_score 
      FROM votes 
      WHERE ${idColumn} = ?
    `, [targetId]);
    
    res.json({ 
      success: true, 
      vote_score: voteResults[0].vote_score,
      user_vote: existingVotes.length > 0 && existingVotes[0].vote_type === vote_type ? null : vote_type
    });
  } catch (error) {
    console.error('Error handling vote:', error);
    res.status(500).json({ error: 'Error handling vote' });
  }
});

// Delete post
app.delete('/api/posts/:id', isAuthenticated, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.session.user.user_id;
    
    // Check if post exists and user has permission
    const [posts] = await pool.query('SELECT * FROM posts WHERE post_id = ?', [postId]);
    
    if (posts.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    if (posts[0].user_id !== userId && !req.session.user.is_admin) {
      return res.status(403).json({ error: 'Permission denied' });
    }
    
    // Delete in proper order to respect foreign key constraints
    await pool.query('DELETE FROM votes WHERE post_id = ?', [postId]);
    await pool.query('DELETE FROM votes WHERE reply_id IN (SELECT reply_id FROM replies WHERE post_id = ?)', [postId]);
    await pool.query('DELETE FROM replies WHERE post_id = ?', [postId]);
    await pool.query('DELETE FROM posts WHERE post_id = ?', [postId]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Error deleting post' });
  }
});

// =====================================================
// Authentication Routes
// =====================================================

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email and password are required' });
    }
    
    // Check if username or email already exists
    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }
    
    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, passwordHash]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Registration successful. You can now log in.' 
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    // Find user
    const [users] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    const user = users[0];
    
    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    // Set session
    req.session.user = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      is_admin: user.is_admin
    };
    
    res.json({
      success: true,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        is_admin: user.is_admin
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Error logging out' });
    }
    res.json({ success: true });
  });
});

// Get current user
app.get('/api/user', (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Serve HTML for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// =====================================================
// package.json
// =====================================================
/*
{
  "name": "forum-app",
  "version": "1.0.0",
  "description": "A simple forum application with Node.js",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "bcrypt": "^5.1.0",
    "express": "^4.18.2",
    "express-mysql-session": "^3.0.0",
    "express-session": "^1.17.3",
    "mysql2": "^3.3.3"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
*/
