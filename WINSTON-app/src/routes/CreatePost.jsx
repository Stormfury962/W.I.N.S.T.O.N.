import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from '../firebase';
import { api } from '../services/api';
import Navbar from '../components/Navbar.jsx';

function CreatePost() {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
            if (!currentUser) {
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleSubmit = async () => {
        if (!title || !body) return alert("Please fill in both fields.");
        if (!user) return alert("You must be logged in to create a post.");

        try {
            const userData = await api.getUserRole(user.email);

            await api.createPost({
                user_id: userData.user_id, 
                title, 
                body
            });

            alert("Post created!");
            navigate("/");
        } catch (err) {
            console.error("Error submitting post:", err);
            alert(err.message || "Failed to create post");
        }
    };
  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "2rem" }}>
      <h2>Create a New Post</h2>
      <input
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <textarea
        placeholder="Post Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows="5"
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <button onClick={handleSubmit}>Submit Post</button>
    </div>
  );
}
export default CreatePost;
