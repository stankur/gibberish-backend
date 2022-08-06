type User = {
    username: string,
    password: string,
    bio?: string,
    instagram?: string
}

type DependentPost = {
	content: string,
	user: User,
	game: "Why/Because" | "Quote/Person" | "Who/Description",
	ownerPost: MainPost
};

type MainPost = {
	content: string,
	user: User,
	game: "Why/Because" | "Quote/Person" | "Who/Description",
};

type Interaction = {
    user: User,
    post: DependentPost | MainPost,
    type: "upvote" | "downvote"
}

// users

const user0: User = {
    username: "user0username",
    password: "user0password",
    bio: "user0bio",
    instagram: "user0instagram"
}

const user1: User = {
    username: "user1username",
    password: "user1password",
    bio: "user1bio",
    instagram: "user1instagram"
}

const user2: User = {
	username: "user2username",
	password: "user2password",
	bio: "user2bio",
	instagram: "user2instagram",
};

const user3: User = {
	username: "user3username",
	password: "user3password",
	bio: "user3bio",
	instagram: "user3instagram",
};

const user4: User = {
	username: "user4username",
	password: "user4password",
	bio: "user4bio",
	instagram: "user4instagram",
};

// posts

const postWhy0: MainPost = {
    content: "Why does everything in life seem so far?",
    user: user0,
    game: "Why/Because",
}

const postBecause00: DependentPost = {
	content: "Because you have myopia",
	user: user0,
	game: "Why/Because",
    ownerPost: postWhy0
};

const postBecause01: DependentPost = {
	content: "Because your name is Jafar, you come from a far, and you have a bomb in your car",
	user: user1,
	game: "Why/Because",
	ownerPost: postWhy0,
};

const postBecause02: DependentPost = {
	content:
		"Because yo mama so fat, her gravitational fields distort space and time.",
	user: user2,
	game: "Why/Because",
	ownerPost: postWhy0,
};

// interactions

//      post why 0 interactions (4 upvotes, 1 downvote)
const interaction00: Interaction = {
    user: user0,
    post: postWhy0,
    type: "upvote"
}

const interaction01: Interaction = {
    user: user1,
    post: postWhy0,
    type: "downvote"
}

const interaction02: Interaction = {
    user: user2,
    post: postWhy0,
    type: "upvote"
}

const interaction03: Interaction = {
    user: user3,
    post: postWhy0,
    type: "upvote"
}


const interaction04: Interaction = {
    user: user4,
    post: postWhy0,
    type: "upvote"
}

//      post because 00 interactions (2 upvotes, 3 downvotes)

const interaction000: Interaction = {
    user: user0,
    post: postBecause00,
    type: "upvote"
}

const interaction001: Interaction = {
    user: user1,
    post: postBecause00,
    type: "upvote"
}

const interaction002: Interaction = {
	user: user2,
	post: postBecause00,
	type: "downvote",
};

const interaction003: Interaction = {
	user: user3,
	post: postBecause00,
	type: "downvote",
};

const interaction004: Interaction = {
	user: user4,
	post: postBecause00,
	type: "downvote",
};

export { User, MainPost, DependentPost, Interaction };

export default {
	user0,
	user1,
	user2,
	user3,
	user4,
	postWhy0,
	postBecause00,
	postBecause01,
	postBecause02,
	interaction00,
	interaction01,
	interaction02,
	interaction03,
	interaction04,
	interaction000,
	interaction001,
	interaction002,
	interaction003,
	interaction004,    
};
