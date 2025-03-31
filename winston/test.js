import axios from "axios";

const baseURL = "http://localhost:3000";

// Helper: POST request with error handling
async function post(path, data) {
  try {
    const response = await axios.post(`${baseURL}${path}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    console.log(`POST ${path}`, response.data);
    return response.data;
  } catch (err) {
    handleError(err, "POST", path);
  }
}

// Helper: GET request with error handling
async function get(path) {
  try {
    const response = await axios.get(`${baseURL}${path}`, {
      headers: { "Content-Type": "application/json" },
    });
    console.log(`GET ${path}`, response.data);
    return response.data;
  } catch (err) {
    handleError(err, "GET", path);
  }
}

// Centralized error handler
function handleError(error, method, path) {
  if (error.response) {
    console.error(
      `[${method} ${path}]`,
      error.response.status,
      error.response.data,
    );
  } else if (error.request) {
    console.error(`[${method} ${path}] No response`, error.request);
  } else {
    console.error(`[${method} ${path}] Error`, error.message);
  }
}

// Run the test sequence
async function run() {
  // 1. Create a user
  const user = await post("/api/register", {
    username: "minhosuhml157",
    email: "ml157@rutgers.edu",
    password: "ibench105",
  });

  // 2. Create a post
  const newPost = await post("/api/posts", {
    user_id: 1, // assuming first user created gets user_id = 1
    title: "Any gyms nearby?",
    body: "Just moved to the area, any recommendations?",
  });

  // 3. Get all posts and print info
  const { posts } = await get("/api/posts");
  const postId = posts[0]?.post_id;
  console.log("Post Info:", posts[0]);
  const oldVoteInfo = await get(`/api/posts/${postId}/votes`);
  console.log("Old Vote Info:", oldVoteInfo);

  // 4. Upvote the post
  await post("/api/vote", {
    user_id: 1,
    post_id: postId,
    vote_type: "upvote",
  });

  // 5. Get vote count and print
  const newVoteInfo = await get(`/api/posts/${postId}/votes`);
  console.log("Updated Vote Info:", newVoteInfo);
}

run();
