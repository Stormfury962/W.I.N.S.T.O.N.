const API_URL = 'http://localhost:3000';

const makeRequest = async (endpoint, method = 'GET', data = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Something went wrong');
  }

  return response.json();
};

export const api = {

  registerUser: (userData) => makeRequest('/api/register', 'POST', userData),
  getUserRole: (email) => makeRequest('/api/getUserRole', 'POST', { email }),

  getPosts: () => makeRequest('/api/posts'),
  createPost: (postData) => makeRequest('/api/posts', 'POST', postData),

  voteOnPost: (voteData) => makeRequest('/api/vote', 'POST', voteData),
  getPostVotes: (postId) => makeRequest(`/api/posts/${postId}/votes`),
  getReplyVotes: (replyId) => makeRequest(`/api/replies/${replyId}/votes`),
};
