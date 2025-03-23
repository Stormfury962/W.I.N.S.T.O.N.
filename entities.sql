CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT, --generate unique user_id automatically
    username VARCHAR(255) UNIQUE NOT NULL, --Require unique username
    email VARCHAR(255) UNIQUE NOT NULL, --Require unique email
    password_hash VARCHAR(255) NOT NULL, --Require password
    is_admin BOOLEAN DEFAULT FALSE  --admin flag
);

CREATE TABLE posts (
    post_id INT PRIMARY KEY AUTO_INCREMENT,  --generate unique post_id automatically
    user_id INT NOT NULL, --take in a user
    title VARCHAR(255) NOT NULL, --reequire a title
    body TEXT NOT NULL, --require a body
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- returns the current date and time for created_at
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, --create an updated_at that on update updates the timestamp
    FOREIGN KEY (user_id) REFERENCES users(user_id) --user_id references the user_id 
);

CREATE TABLE replies (
    reply_id INT PRIMARY KEY AUTO_INCREMENT, --generate unique reply_id
    post_id INT NOT NULL, --take parent post_id
    user_id INT NOT NULL,  --take user's id
    body TEXT NOT NULL,     --require a body
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   --returns the current date and time for created_at
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, --create an updated_at that on update updates the timestamp
    FOREIGN KEY (post_id) REFERENCES posts(post_id), 
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE votes (
    vote_id INT PRIMARY KEY AUTO_INCREMENT,  --genearate unique vote_id (not sure if this is needed)
    user_id INT NOT NULL,  --take user's id
    post_id INT NULL,   --take post id
    reply_id INT NULL   --take reply id
    vote_type ENUM('upvote', 'downvote') NOT NULL, --Take a vote type, either 0 or 1 representing upvote or downvote
    UNIQUE (user_id, post_id),  --make sure user_id, post_id, reply_id are unique
    UNIQUE (user_id, reply_id)
    FOREIGN KEY (user_id) REFERENCES users(user_id), 
    FOREIGN KEY (post_id) REFERENCES posts(post_id),
    FOREIGN KEY (reply_id) REFERENCES replies(reply_id),
    CHECK(  --check to ensure we only have either a post_id or reply_id just in case
        (post_id IS NOT NULL AND reply_id IS NULL) OR
        (post_id IS NULL AND reply_id IS NOT NULL)
    )
);
