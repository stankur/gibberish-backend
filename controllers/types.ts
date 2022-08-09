interface AcceptableQuery {
	sort?: "new" | "points";
	limit?: string;
	offset?: string;
	time_range?: "current";
	start_time?: string;
	end_time?: string;
}

type User = {
    id?: string;
	username: string;
	password: string;
	bio?: string;
	instagram?: string;
};

type MainPost = {
	id?: string;
	content: string;
	user: User;
	game: "Why/Because" | "Quote/Person" | "Who/Description";
};

type DependentPost = {
	id?: string;
	content: string;
	user: User;
	game: "Why/Because" | "Quote/Person" | "Who/Description";
	ownerPost: MainPost;
};

type Interaction = {
	id?: string;
	user: User;
	post: DependentPost | MainPost;
	type: "upvote" | "downvote";
};

export { AcceptableQuery, User, MainPost, DependentPost, Interaction };
