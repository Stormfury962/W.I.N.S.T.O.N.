import { useState } from 'react';
import {useEffect} from 'react';
import {Link} from 'react-router-dom';
import { auth } from './firebase';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Login from './routes/Login.jsx';
import Register from './routes/Register.jsx';
import Navbar from './components/Navbar.jsx';
import { api } from './services/api';

function App() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [votedPosts, setVotedPosts] = useState(new Set());
  
  //monitoring
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
   useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await api.getPosts();

	      //added to get vote count for posts
        const postsWithVotes = await Promise.all(
          data.posts.map(async (post) => {
            const votes = await api.getPostVotes(post.post_id);
            return { ...post, ...votes };
          })
        );
        setPosts(postsWithVotes);
	      } catch (error) {
        console.error("Failed to load posts", error);
      }
    };
    
    fetchPosts();
  }, []);

  const handleVote = async (postId, voteType) => {
    if (!user) {
      alert("Please log in to vote");
      return;
    }

    try {
      //pull id
      const userData = await api.getUserRole(user.email);
      
      //vote submission
      await api.voteOnPost({
        user_id: userData.user_id,
        post_id: postId,
        vote_type: voteType === 1 ? 'upvote' : 'downvote'
      });

      //update
      setVotedPosts(prev => new Set(prev).add(postId));
      
      //refresh posts
      const data = await api.getPosts();
      const postsWithVotes = await Promise.all(
        data.posts.map(async (post) => {
          const votes = await api.getPostVotes(post.post_id);
          return { ...post, ...votes };
        })
      );
      setPosts(postsWithVotes);
    } catch (error) {
      console.error("Failed to vote:", error);
      alert("Failed to submit vote");
    }
  };
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
              {user && !votedPosts.has(post.post_id) ? (
                <>
                  <button onClick={() => handleVote(post.post_id, 1)}>Upvote</button>
                  <button onClick={() => handleVote(post.post_id, -1)}>Downvote</button>
                </>
              ) : (
                <span style={{ marginRight: '10px' }}>
                  {votedPosts.has(post.post_id) ? "You have voted!" : "Please log in to vote"}
                </span>
              )}
              <p>👍 {post.upvotes || 0} 👎 {post.downvotes || 0}</p> 
          </div>
        </div>
        ))
      )}
    </div>
  );
}
export default App
