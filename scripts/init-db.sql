SET TIMEZONE = 'America/Vancouver';

CREATE TABLE IF NOT EXISTS users (
    id INT GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    bio VARCHAR(200),
    instagram VARCHAR(30),
    date_joined timestamptz default now(),

    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS posts (
    id INT GENERATED ALWAYS AS IDENTITY,
    content VARCHAR(300) NOT NULL,
    date_posted timestamptz default now(),
    user_id INT NOT NULL,
    game TEXT NOT NULL CHECK (game in ('Why/Because', 'Quote/Person', 'Who/Description')),
    owner_post_id INT,

    PRIMARY KEY (id),

    FOREIGN KEY (user_id) 
        REFERENCES users (id),

    FOREIGN KEY (owner_post_id)
        REFERENCES users (id)
);


CREATE TABLE IF NOT EXISTS interactions (
    id INT GENERATED ALWAYS AS IDENTITY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    interaction_type TEXT NOT NULL CHECK (interaction_type in ('upvote', 'downvote')),
    
    PRIMARY KEY (id),

    FOREIGN KEY (user_id)
        REFERENCES users (id),
    FOREIGN KEY (post_id)
        REFERENCES posts (id)
);
