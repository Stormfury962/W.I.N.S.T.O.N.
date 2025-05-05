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
      const user = await db.get("SELECT user_id, is_admin FROM users WHERE email = ?", [email]);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const role = user.is_admin ? "ta" : "student";
      res.json({ 
        role,
        user_id: user.user_id 
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
   }
  }); 
  
  //list posts
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

  //new post
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

  //casting a vote
  router.post("/api/vote", async (req, res) => {
    const { user_id, post_id, reply_id, vote_type } = req.body;

    if (!user_id || !vote_type || (!post_id && !reply_id)) {
      return res.status(400).json({
        error: "user_id, vote_type, and post_id or reply_id are required",
      });
    }

    if (vote_type !== 1 && vote_type !== -1) {
      return res
        .status(400)
        .json({ error: 'vote_type must be either "upvote" or "downvote"' });
    }

    try {
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

  //return total votes
  router.get("/api/posts/:id/votes", async (req, res) => {
    const post_id = req.params.id;

    try {
      const result = await db.get(
        `SELECT 
           SUM(vote_type) AS votes
         FROM votes
         WHERE post_id = ?`,
        [post_id],
      );

      res.json({ post_id, ...result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  //return total votes for reply
  router.get("/api/replies/:id/votes", async (req, res) => {
    const reply_id = req.params.id;

    try {
      const result = await db.get(
        `SELECT 
           SUM(vote_type)
         FROM votes
         WHERE reply_id = ?`,
        [reply_id],
      );

      res.json({ reply_id, ...result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  //post a reply
  router.post('/api/replies', async(req, res)=> {
    const {post_id, user_id, body} = req.body;

    if (!body || !user_id || !post_id){
      return res.status(400).json({error: 'Missing fields'});
    }
    try{
      await db.run(
        "INSERT INTO replies (post_id, user_id, body) VALUES (?, ?, ?)",
        [post_id, user_id, body]
      );
      res.json({ message: "Reply added" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to add reply" });
    }
  });

  //get all replies to a post
  router.get("/api/posts/:id/replies", async (req,res) => {
    const post_id = req.params.id;
    try{
      const replies = await db.all(
        `SELECT replies.*, users.username
         FROM replies
         JOIN users ON replies.user_id = users.user_id
         WHERE post_id = ?
         ORDER BY created_at ASC`,
         [post_id]
      );
      res.json({replies});
    }catch(err){
      res.status(500).json({error: err.message});
    }
  });

  //helps show user role
  router.get("/api/getUserRole/:user_id", async (req, res) => {
  const user_id = req.params.user_id;

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }
  try {
    const user = await db.get("SELECT user_id, is_admin FROM users WHERE user_id = ?", [user_id]);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const role = user.is_admin ? "TA" : "Student";
    res.json({ role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  });

  return router;
}
