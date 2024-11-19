import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root123',
  database: 'blog'
});

const app = express();

app.use(cors());
app.use(express.json());

// Get all posts
app.get('/posts', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM posts');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single post by ID
app.get('/postsdisplay/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM posts WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new post
app.post('/posts', async (req, res) => {
  const { title, content, author,userid} = req.body;
  try {
    const [result] = await db.query('INSERT INTO posts (title, content, author, user_id) VALUES (?, ?, ?, ?)', [title, content, author,userid]);
    res.status(201).json({ id: result.insertId, title, content, author,userid});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a post
app.put('/posts/:id', async (req, res) => {
  const { title, content, author } = req.body;
  try {
    const [result] = await db.query('UPDATE posts SET title = ?, content = ?, author = ? WHERE id = ?', [title, content, author, req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ id: req.params.id, title, content, author });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a post
app.delete('/posts/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new user
app.post('/users', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const [result] = await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password]);
    res.status(201).json({ id: result.insertId, name, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login user
app.post('/loginUser', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User does not exist' });
    }
    const user = rows[0];
    if (user.password !== password) {
      return res.status(401).json({ message: 'Incorrect password' });
    }
    // Assuming you have a function to generate a token
    const token = generateToken(user.id);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user by token
app.post('/getUser', async (req, res) => {
  // const token = req.headers.token;
  const {userID} = req.body;
  try {
    // Assuming you have a function to decode the token and get the user ID
    // const userId = decodeToken(token);
    console.log(userId)
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single user by ID
app.get('/getSingleUser/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Check if the current user is following the author
app.get('/isFollowing/:userId/:authorId', async (req, res) => {
  const { userId, authorId } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM following WHERE user_id = ? AND following_id = ?', [userId, authorId]);
    res.json({ isFollowing: rows.length > 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Follow a user
app.post('/followUser/:id', async (req, res) => {
  const { id } = req.params;
  const { currentUserId } = req.body;

  try {
    await db.query('INSERT INTO following (user_id, following_id) VALUES (?, ?)', [currentUserId, id]);
    res.status(200).json({ message: 'User followed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Unfollow a user
app.post('/unfollowUser/:id', async (req, res) => {
  const { id } = req.params;
  const { currentUserId } = req.body;

  try {
    await db.query('DELETE FROM following WHERE user_id = ? AND following_id = ?', [currentUserId, id]);
    res.status(200).json({ message: 'User unfollowed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get follower count for a user
app.get('/followerCount/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const [rows] = await db.query('SELECT COUNT(*) AS followerCount FROM following WHERE following_id = ?', [userId]);
    const followerCount = rows[0].followerCount;
    res.json({ followerCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get list of followers for a user
app.get('/followers/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const [rows] = await db.query('SELECT users.id, users.name FROM following JOIN users ON following.user_id = users.id WHERE following.following_id = ?', [userId]);
    res.json({ followers: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get list of people the user is following
app.get('/following/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const [rows] = await db.query('SELECT users.id, users.name FROM following JOIN users ON following.following_id = users.id WHERE following.user_id = ?', [userId]);
    res.json({ following: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Like a post
app.post('/likePost/:id', async (req, res) => {
  const { id } = req.params;
  const { token } = req.headers;
  try {
    // Assuming you have a function to get user ID from token
    const userId = getUserIdFromToken(token);
    await db.query('INSERT INTO likes (user_id, post_id) VALUES (?, ?)', [userId, id]);
    res.status(200).json({ message: 'Post liked' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dislike a post
app.post('/dislikePost/:id', async (req, res) => {
  const { id } = req.params;
  const { token } = req.headers;
  try {
    // Assuming you have a function to get user ID from token
    const userId = getUserIdFromToken(token);
    await db.query('DELETE FROM likes WHERE user_id = ? AND post_id = ?', [userId, id]);
    res.status(200).json({ message: 'Post disliked' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get posts by user
app.post('/getPostsByUser', async (req, res) => {
  const {id} = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM posts WHERE user_id = ?', [id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search posts by keyword
app.get('/searchPosts', async (req, res) => {
  const { keyword } = req.query;
  try {
    const [rows] = await db.query('SELECT * FROM posts WHERE title LIKE ? OR content LIKE ?', [`%${keyword}%`, `%${keyword}%`]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user details
app.put('/updateUser', async (req, res) => {
  const { id, name, email, password } = req.body;
  try {
    const [result] = await db.query('UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?', [name, email, password, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user account
app.delete('/deleteUser/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get author details and their posts by user_id
app.get('/authors/:user_id', async (req, res) => {
  try {
    const userId = req.params.user_id;
    const [authorRows] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    const [postRows] = await db.query('SELECT * FROM posts WHERE user_id = ?', [userId]);

    if (authorRows.length === 0) {
      return res.status(404).json({ error: 'Author not found' });
    }

    res.json({ author: authorRows[0], posts: postRows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



function getUserIdFromToken(token) {
  // Implement token decoding logic here
  return 'dummy-user-id';
}

function generateToken(userId) {
  // Implement token generation logic here
  return 'dummy-token';
}

function decodeToken(token) {
  // Implement token decoding logic here
  return 1; // Return a dummy user ID for now
}

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

export default app;