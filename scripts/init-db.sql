SET TIMEZONE = 'America/Vancouver';

CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    bio VARCHAR(200),
    instagram VARCHAR(30),
    date_joined timestamptz NOT NULL default now(),
    PRIMARY KEY (username)
);

CREATE TABLE IF NOT EXISTS posts (
    content VARCHAR(300) NOT NULL,
    date_posted timestamptz NOT NULL default now(),
    user_username VARCHAR(50) NOT NULL,
    game TEXT NOT NULL CHECK (game in ('Why/Because', 'Quote/Person', 'Who/Description')),
    owner_post_date_posted timestamptz,
    owner_post_user_username VARCHAR(50),

    PRIMARY KEY (date_posted, user_username),
    FOREIGN KEY (user_username)
        REFERENCES users (username),
    FOREIGN KEY (owner_post_date_posted, owner_post_user_username)
        REFERENCES posts (date_posted, user_username)
);

CREATE TABLE IF NOT EXISTS interactions (
    user_username VARCHAR(50) NOT NULL,
    post_date_posted TIMESTAMPTZ NOT NULL,
    post_user_username VARCHAR(50) NOT NULL,
    interaction_type TEXT NOT NULL CHECK (interaction_type in ('upvote', 'downvote')),
    
    PRIMARY KEY (user_username, post_date_posted, post_user_username),
    FOREIGN KEY (user_username)
        REFERENCES users (username),
    FOREIGN KEY (post_date_posted, post_user_username)
        REFERENCES posts (date_posted, user_username)
);
