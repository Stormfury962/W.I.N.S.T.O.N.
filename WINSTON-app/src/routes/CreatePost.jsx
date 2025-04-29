import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreatePost() {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const navigate = useNavigate();
    const user_id = 1; //change later hardcoded user id for now
    const handleSubmit = async () => {
    
    if (!title || !body) return alert("Please fill in both fields.");

    try {
        const res = await fetch("http://localhost:3000/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, title, body }),
      });

        if (res.ok) {
            alert("Post created!");
            navigate("/"); 
        } else {
            const err = await res.json();
            alert(err.error || "Failed to create post");
        }
    } catch (err) {
      console.error("Error submitting post:", err);
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
