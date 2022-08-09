interface AcceptableQuery {
	sort?: "new" | "points";
	limit?: string;
	offset?: string;
	time_range?: "current";
	start_time?: string;
	end_time?: string;
}

type User = {
	username: string;
	password: string;
	bio?: string;
	instagram?: string;
};

type MainPost = {
	content: string;
	user: User;
	game: "Why/Because" | "Quote/Person" | "Who/Description";
	date_posted?: string;
};

type DependentPost = {
	content: string;
	user: User;
	game: "Why/Because" | "Quote/Person" | "Who/Description";
	ownerPost: MainPost;
	date_posted?: string;
};


type Interaction = {
	user: User;
	post: DependentPost | MainPost;
	type: "upvote" | "downvote";
};

export { AcceptableQuery, User, MainPost, DependentPost, Interaction };
