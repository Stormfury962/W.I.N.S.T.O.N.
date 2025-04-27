import express from "express";

const router = express.Router();

export default function initRoutes(db) {
  router.get("/debug/users", async (req, res) => {
    try {
      const users = await db.all("SELECT * FROM users");
      res.json({ users });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post("/api/register", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Username, email and password are required" });
    }

    try {
      const existingUsers = await db.all(
        "SELECT * FROM users WHERE username = ? OR email = ?",
        [username, email],
      );

      if (existingUsers.length > 0) {
        return res
          .status(409)
          .json({ error: "Username or email already exists" });
      }

      await db.run(
        "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
        [username, email, password],
      );

      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post("/api/getUserRole", async (req, res) => {
    const { email } = req.body;
  
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      try {
        const user = await db.get("SELECT is_admin FROM users WHERE email = ?", [email]);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        const role = user.is_admin ? "ta" : "student";
        res.json({ role });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

  
  // List all posts
  router.get("/api/posts", async (req, res) => {
    try {
      const posts = await db.all(`
        SELECT posts.*, users.username
        FROM posts
        JOIN users ON posts.user_id = users.user_id
        ORDER BY posts.created_at DESC
      `);
      res.json({ posts });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Create a new post
  router.post("/api/posts", async (req, res) => {
    const { user_id, title, body } = req.body;

    if (!user_id || !title || !body) {
      return res
        .status(400)
        .json({ error: "user_id, title, and body are required" });
    }

    try {
      await db.run(
        `INSERT INTO posts (user_id, title, body) VALUES (?, ?, ?)`,
        [user_id, title, body],
      );
      res.status(201).json({ message: "Post created successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Cast a vote (post or reply)
  router.post("/api/vote", async (req, res) => {
    const { user_id, post_id, reply_id, vote_type } = req.body;

    if (!user_id || !vote_type || (!post_id && !reply_id)) {
      return res.status(400).json({
        error: "user_id, vote_type, and post_id or reply_id are required",
      });
    }

    if (vote_type !== "upvote" && vote_type !== "downvote") {
      return res
        .status(400)
        .json({ error: 'vote_type must be either "upvote" or "downvote"' });
    }

    try {
      // Try to insert or replace vote
      await db.run(
        `INSERT INTO votes (user_id, post_id, reply_id, vote_type)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(user_id, post_id) DO UPDATE SET vote_type = excluded.vote_type`,
        [user_id, post_id || null, reply_id || null, vote_type],
      );

      res.status(200).json({ message: "Vote recorded" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get total votes for a post
  router.get("/api/posts/:id/votes", async (req, res) => {
    const post_id = req.params.id;

    try {
      const result = await db.get(
        `SELECT 
           SUM(vote_type = 'upvote') AS upvotes,
           SUM(vote_type = 'downvote') AS downvotes
         FROM votes
         WHERE post_id = ?`,
        [post_id],
      );

      res.json({ post_id, ...result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get total votes for a reply
  router.get("/api/replies/:id/votes", async (req, res) => {
    const reply_id = req.params.id;

    try {
      const result = await db.get(
        `SELECT 
           SUM(vote_type = 'upvote') AS upvotes,
           SUM(vote_type = 'downvote') AS downvotes
         FROM votes
         WHERE reply_id = ?`,
        [reply_id],
      );

      res.json({ reply_id, ...result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
