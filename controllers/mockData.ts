import { DependentPost, Interaction, MainPost, User } from "./types";

function createUser(
	username: string,
	password: string,
	bio?: string,
	instagram?: string
): User {
	let base = {
		username,
		password,
	};

	if (bio !== undefined) {
		Object.assign(base, { bio });
	}

	if (instagram !== undefined) {
		Object.assign(base, { instagram });
	}

	return base;
}

function createMultipleUsers(
	users: [
		keyName: string,
		username: string,
		password: string,
		bio?: string,
		instagram?: string
	][]
): Record<string, User> {
	let base: Record<string, User> = {};

	for (const [keyName, username, password, bio, instagram] of users) {
		Object.assign(base, {
			[keyName]: createUser(username, password, bio, instagram),
		});
	}

	return base;
}

function createDependentPost(
	content: string,
	user: User,
	game: "Why/Because" | "Quote/Person" | "Who/Description",
	ownerPost: MainPost,
	date_posted?: string
): DependentPost {
	let base = { content, user, game, ownerPost };

	if (date_posted !== undefined) {
		Object.assign(base, { date_posted });
	}

	return base;
}

function createMultipleDependentPosts(
	dependentPosts: [
		keyName: string,
		content: string,
		user: User,
		game: "Why/Because" | "Quote/Person" | "Who/Description",
		ownerPost: MainPost,
		date_posted?: string
	][]
): Record<string, DependentPost> {
	let base: Record<string, DependentPost> = {};

	for (const [
		keyName,
		content,
		user,
		game,
		ownerPost,
		date_posted,
	] of dependentPosts) {
		Object.assign(base, {
			[keyName]: createDependentPost(
				content,
				user,
				game,
				ownerPost,
				date_posted
			),
		});
	}
	return base;
}

function createMainPost(
	content: string,
	user: User,
	game: "Why/Because" | "Quote/Person" | "Who/Description",
	date_posted?: string
): MainPost {
	let base = { content, user, game };

	if (date_posted !== undefined) {
		Object.assign(base, { date_posted });
	}

	return base;
}

function createMultipleMainPosts(
	mainPosts: [
		keyName: string,
		content: string,
		user: User,
		game: "Why/Because" | "Quote/Person" | "Who/Description",
		date_posted?: string
	][]
): Record<string, MainPost> {
	let base: Record<string, MainPost> = {};
	for (const [keyName, content, user, game, date_posted] of mainPosts) {
		Object.assign(base, {
			[keyName]: createMainPost(content, user, game, date_posted),
		});
	}

	return base;
}

function createInteraction(
	user: User,
	post: DependentPost | MainPost,
	type: "upvote" | "downvote"
): Interaction {
	return { user, post, type };
}

function createMultipleInteractions(
	interactions: [
		keyName: string,
		user: User,
		post: DependentPost | MainPost,
		type: "upvote" | "downvote"
	][]
): Record<string, Interaction> {
	let base: Record<string, Interaction> = {};

	for (const [keyName, user, post, type] of interactions) {
		Object.assign(base, { [keyName]: createInteraction(user, post, type) });
	}

	return base;
}

const users = createMultipleUsers([
	["user0", "user0username", "user0password", "user0bio", "user0instagram"],
	["user1", "user1username", "user1password", "user1bio", "user1instagram"],
	["user2", "user2username", "user2password", "user2bio", "user2instagram"],
	["user3", "user3username", "user3password", "user3bio", "user3instagram"],
	["user4", "user4username", "user4password", "user4bio", "user4instagram"],
]);
const mainPosts = createMultipleMainPosts([
	[
		"postWhy0",
		"Why does everything in life seem so far?",
		users.user0,
		"Why/Because",
	],
	["postWhy1", "why question 1", users.user1, "Why/Because"],
	["postWhy2", "why question 2", users.user3, "Why/Because"],
	["postWhy3", "why question 3", users.user4, "Why/Because"],
]);

// dependent posts
//      post why 0 (3 replies)
//      post why 1 (5 replies)
//      post why 2 (3 replies)
//      post why 3 (4 replies)
const dependentPosts = createMultipleDependentPosts([
	[
		"postBecause00",
		"Because you have myopia",
		users.user0,
		"Why/Because",
		mainPosts.postWhy0,
	],
	[
		"postBecause01",
		"Because your name is Jafar, you come from a far, and you have a bomb in your car",
		users.user1,
		"Why/Because",
		mainPosts.postWhy0,
	],
	[
		"postBecause02",
		"Because yo mama so fat, her gravitational fields distort space and time.",
		users.user2,
		"Why/Because",
		mainPosts.postWhy0,
	],
	[
		"postBecause10",
		"becuase post 1 0",
		users.user0,
		"Why/Because",
		mainPosts.postWhy1,
	],
	[
		"postBecause11",
		"because post 1 1",
		users.user1,
		"Why/Because",
		mainPosts.postWhy1,
	],
	[
		"postBecause12",
		"because post 1 2",
		users.user2,
		"Why/Because",
		mainPosts.postWhy1,
	],
	[
		"postBecause13",
		"because post 1 3",
		users.user3,
		"Why/Because",
		mainPosts.postWhy1,
	],
	[
		"postBecause14",
		"because post 1 4",
		users.user4,
		"Why/Because",
		mainPosts.postWhy1,
	],
	[
		"postBecause20",
		"because post 2 0",
		users.user0,
		"Why/Because",
		mainPosts.postWhy2,
	],
	[
		"postBecause21",
		"because post 2 1",
		users.user1,
		"Why/Because",
		mainPosts.postWhy2,
	],
	[
		"postBecause22",
		"because post 2 2",
		users.user3,
		"Why/Because",
		mainPosts.postWhy2,
	],
	[
		"postBecause30",
		"because post 3 0",
		users.user0,
		"Why/Because",
		mainPosts.postWhy3,
	],
	[
		"postBecause31",
		"because post 3 1",
		users.user1,
		"Why/Because",
		mainPosts.postWhy3,
	],
	[
		"postBecause32",
		"because post 3 2",
		users.user3,
		"Why/Because",
		mainPosts.postWhy3,
	],
	[
		"postBecause33",
		"because post 3 3",
		users.user4,
		"Why/Because",
		mainPosts.postWhy3,
	],
]);

// interactions
//      post why 0 interactions (4 upvotes, 1 downvote)
//          post because 00 interactions (2 upvotes, 3 downvotes)
//          post because 01 interactions (3 upvotes, 1 downvote)
//          post because 02 interactions (2 upvotes, 2 downvotes)
//
//      post why 1 interactions (2 upvotes, 3 downvotes)
//          post because 10 interactions (1 upvote)
//          post because 11 interactions (2 upvotes)
//          post because 12 interactions (3 upvotes)
//          post because 13 interactions (1 downvote)
//          post because 14 interactions (3 downvotes)
//
//      post why 2 interactions (5 upvotes)
//          post because 20 interactions (1 upvote, 4 downvotes)
//          post because 21 interactions (2 upvotes, 3 downvotes)
//          post because 22 interactions (4 upvotes, 1 downvote)
//
//      post why 3 interactions (2 upvotes)
//          post because 30 interactions (3 upvotes, 2 downvotes)
//          post because 31 interactions (5 upvotes)
//          post because 32 interactions (1 upvote, 3 downvotes)
//          post because 33 interactions (1 upvote, 2 downvotes)

const interactions = createMultipleInteractions([
	["interaction00", users.user0, mainPosts.postWhy0, "upvote"],
	["interaction01", users.user1, mainPosts.postWhy0, "downvote"],
	["interaction02", users.user2, mainPosts.postWhy0, "upvote"],
	["interaction03", users.user3, mainPosts.postWhy0, "upvote"],
	["interaction04", users.user4, mainPosts.postWhy0, "upvote"],

	["interaction000", users.user0, dependentPosts.postBecause00, "upvote"],
	["interaction001", users.user1, dependentPosts.postBecause00, "upvote"],
	["interaction002", users.user2, dependentPosts.postBecause00, "downvote"],
	["interaction003", users.user3, dependentPosts.postBecause00, "downvote"],
	["interaction004", users.user4, dependentPosts.postBecause00, "downvote"],

	["interaction010", users.user0, dependentPosts.postBecause01, "upvote"],
	["interaction011", users.user1, dependentPosts.postBecause01, "upvote"],
	["interaction012", users.user3, dependentPosts.postBecause01, "upvote"],
	["interaction013", users.user4, dependentPosts.postBecause01, "downvote"],

	["interaction020", users.user1, dependentPosts.postBecause02, "upvote"],
	["interaction021", users.user2, dependentPosts.postBecause02, "downvote"],
	["interaction022", users.user3, dependentPosts.postBecause02, "downvote"],
	["interaction023", users.user4, dependentPosts.postBecause02, "upvote"],

	["interaction10", users.user0, mainPosts.postWhy1, "upvote"],
	["interaction11", users.user1, mainPosts.postWhy1, "upvote"],
	["interaction12", users.user2, mainPosts.postWhy1, "downvote"],
	["interaction13", users.user3, mainPosts.postWhy1, "downvote"],
	["interaction14", users.user4, mainPosts.postWhy1, "downvote"],

	["interaction100", users.user0, dependentPosts.postBecause10, "upvote"],

	["interaction110", users.user0, dependentPosts.postBecause11, "upvote"],
	["interaction111", users.user1, dependentPosts.postBecause11, "upvote"],

	["interaction120", users.user1, dependentPosts.postBecause12, "upvote"],
	["interaction121", users.user3, dependentPosts.postBecause12, "upvote"],
	["interaction122", users.user4, dependentPosts.postBecause12, "upvote"],

	["interaction130", users.user2, dependentPosts.postBecause13, "downvote"],

	["interaction140", users.user1, dependentPosts.postBecause14, "downvote"],
	["interaction141", users.user2, dependentPosts.postBecause14, "downvote"],
	["interaction142", users.user3, dependentPosts.postBecause14, "downvote"],

	["interaction20", users.user0, mainPosts.postWhy2, "upvote"],
	["interaction21", users.user1, mainPosts.postWhy2, "upvote"],
	["interaction22", users.user2, mainPosts.postWhy2, "upvote"],
	["interaction23", users.user3, mainPosts.postWhy2, "upvote"],
	["interaction24", users.user4, mainPosts.postWhy2, "upvote"],

	["interaction200", users.user0, dependentPosts.postBecause20, "downvote"],
	["interaction201", users.user1, dependentPosts.postBecause20, "downvote"],
	["interaction202", users.user2, dependentPosts.postBecause20, "downvote"],
	["interaction203", users.user3, dependentPosts.postBecause20, "upvote"],
	["interaction204", users.user4, dependentPosts.postBecause20, "downvote"],

	["interaction210", users.user0, dependentPosts.postBecause21, "downvote"],
	["interaction211", users.user1, dependentPosts.postBecause21, "upvote"],
	["interaction212", users.user2, dependentPosts.postBecause21, "downvote"],
	["interaction213", users.user3, dependentPosts.postBecause21, "upvote"],
	["interaction214", users.user4, dependentPosts.postBecause21, "downvote"],

	["interaction220", users.user0, dependentPosts.postBecause22, "downvote"],
	["interaction221", users.user1, dependentPosts.postBecause22, "upvote"],
	["interaction222", users.user2, dependentPosts.postBecause22, "upvote"],
	["interaction223", users.user3, dependentPosts.postBecause22, "upvote"],
	["interaction224", users.user4, dependentPosts.postBecause22, "upvote"],

	["interaction30", users.user0, mainPosts.postWhy3, "upvote"],
	["interaction31", users.user1, mainPosts.postWhy3, "upvote"],

	["interaction300", users.user0, dependentPosts.postBecause30, "upvote"],
	["interaction301", users.user1, dependentPosts.postBecause30, "upvote"],
	["interaction302", users.user2, dependentPosts.postBecause30, "upvote"],
	["interaction303", users.user3, dependentPosts.postBecause30, "downvote"],
	["interaction304", users.user4, dependentPosts.postBecause30, "downvote"],

	["interaction310", users.user0, dependentPosts.postBecause31, "upvote"],
	["interaction311", users.user1, dependentPosts.postBecause31, "upvote"],
	["interaction312", users.user2, dependentPosts.postBecause31, "upvote"],
	["interaction313", users.user3, dependentPosts.postBecause31, "upvote"],
	["interaction314", users.user4, dependentPosts.postBecause31, "upvote"],

	["interaction320", users.user0, dependentPosts.postBecause32, "upvote"],
	["interaction321", users.user2, dependentPosts.postBecause32, "downvote"],
	["interaction322", users.user3, dependentPosts.postBecause32, "downvote"],
	["interaction323", users.user4, dependentPosts.postBecause32, "downvote"],

	["interaction330", users.user0, dependentPosts.postBecause33, "upvote"],
	["interaction331", users.user2, dependentPosts.postBecause33, "downvote"],
	["interaction332", users.user4, dependentPosts.postBecause33, "downvote"],
]);

export default {
	...users,
	...mainPosts,
	...dependentPosts,
	...interactions,
} as Record<string, User | MainPost | DependentPost | Interaction>;
