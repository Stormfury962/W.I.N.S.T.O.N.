import { useState } from 'react';
import {useEffect} from 'react';
import {Link} from 'react-router-dom';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Login from './routes/Login.jsx';
import Register from './routes/Register.jsx';
import Navbar from './components/Navbar.jsx';
import { api } from './services/api';
import { auth } from "./firebase.js";





const getVote = async(postID) => {
  try{
    const data = await api.getPostVotes(postID);
    return(data);
  }
  catch (err){
    console.error("Error in retrieving votes:", err);
    alert(err.message || "Failed to load vote");
  }
}

function App() {
  const [posts, setPosts] = useState([]);
  const [replyInputs, setReplyInputs] = useState({});
  const [replies, setReplies] = useState({});
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await api.getPosts();
        const postsWithVotes = await Promise.all((data.posts || []).map(async (post) => {
          const voteData = await getVote(post.post_id);
          return {
            ...post,
            votes: voteData.votes
          };
        }));
        setPosts(postsWithVotes);
        
      } catch (error) {
        console.error("Failed to load posts", error);
      }
    };
    fetchPosts();
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
          navigate('/login');
      }
    return () => unsubscribe();
  });

  }, []);
  const handleVote = async (postId, value) => {
    if (!user) {
        alert("You must be logged in to vote");
        return navigate('/login');
    }
  
    try {
        const userData = await api.getUserRole(user.email);
    
        await api.voteOnPost({
            user_id: userData.user_id,
            post_id: postId,
            vote_type: value
        });
    } catch (err) {
        console.error("Error voting on post:", err);
        alert(err.message || "Failed to vote on post");
    }
  };
  
  const fetchReplies = async(postId) =>{
    try{
      const res = await fetch(`http://localhost:3000/api/posts/${postId}/replies`);
      const data = await res.json();
      setReplies(prev => ({ ...prev, [postId]: data.replies }));
    }catch(err){
      console.error('Failed to fetch replies:', err);
    }
  };

  const handleReply = async(postId) =>{
    const user_id =1; //CHANGE AFTER
    const body = replyInputs[postId]
    if (!body) return alert("Reply can't be empty")

    try{
      const res = await fetch("http://localhost:3000/api/replies",{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({post_id: postId, user_id, body})
      });

      if(res.ok){
        fetchReplies(postId);
        setReplyInputs(prev => ({ ...prev, [postId]: ""}));
      }else{
        const err = await res.json();
        alert(err.error || "Failed to post reply");
      }
    }catch (err){
      console.error('Reply error:', err);
      alert('Error posting reply')
    }
  };

  return(
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Dashboard</h1>
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
              <button onClick={() => handleVote(post.post_id, 1)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0px 5px', cursor: 'pointer' }}>
               <i className="material-symbols-outlined">keyboard_arrow_up</i> Upvote
             </button>
             <span>0</span>
             <button onClick={() => handleVote(post.post_id, -1)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0px 5px', cursor: 'pointer' }}>
               <i className="material-symbols-outlined">keyboard_arrow_down</i>Downvote 
             </button>
              <p> Votes: {post.votes}</p>
            </div>

            <div style={{marginTop: "10px"}}>
              <input
                type='text'
                placeholder='Write a Reply'
                value={replyInputs[post.post_id] || ""}
                onChange={(e) => setReplyInputs({...replyInputs, [post.post_id]: e.target.value})}
                style={{width: "80%"}} />
                <button onClick={() => handleReply(post.post_id)}>Reply</button>
            </div>

            <div style={{marginTop:"6px", paddingLeft: '10px'}}>
              {(replies[post.post_id] || []).map((reply, index) =>(
                <p key={index} style={{fontStyle: "italic"}}>
                  {reply.body} - <strong>{reply.username}</strong>
                </p>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default App
