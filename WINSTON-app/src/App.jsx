import { useState } from 'react';
import {useEffect} from 'react';
import {Link} from 'react-router-dom';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Login from './routes/Login.jsx';
import Register from './routes/Register.jsx';
import Navbar from './components/Navbar.jsx';
import { api } from './services/api';


function App() {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await api.getPosts();
        setPosts(data.posts || []);
      } catch (error) {
        console.error("Failed to load posts", error);
      }
    };
    
    fetchPosts();
  }, []);

  return(
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Welcome to WINSTON</h1>
      <p>Web-based Interface Network for Students, TAs, and Organized Networks</p>
      <Link to="/new-post">
        <button style={{ margin: '20px 0', padding: '10px 20px' }}>
          Create a New Post
        </button>
      </Link>
      <h2>All Discussions</h2>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((post, i) => (
          <div key={i} style={{ border: '1px solid #ccc', margin: '10px auto', padding: '10px', maxWidth: '600px', textAlign: 'left' }}>
            <strong>{post.title}</strong>
            <p>{post.body}</p>
            <small>Posted by {post.username}</small>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "8px" }}>
              <button onClick={() => handleVote(post.post_id, 1)}> Upvote</button>
              <button onClick={() => handleVote(post.post_id, -1)}> Downvote</button>
              <p> {post.upvotes}   {post.downvotes}</p>
          </div>
        </div>
        ))
      )}
    </div>
  );
}
export default App
