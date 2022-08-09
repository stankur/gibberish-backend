import { DependentPost, Interaction, MainPost, User } from "./types";
import dayjs from "dayjs";
import realPoolClient from "../poolClient";

async function insertMockDataToDatabase(
	users: User[],
	mainPosts: MainPost[],
	dependentPosts: DependentPost[],
	interactions: Interaction[],
	poolClient: typeof realPoolClient
) {
	users.forEach(async (user) => {
		await poolClient.query(`
            INSERT INTO 
                users (username, password)
            VALUES
                ('${user.username}','${user.password}')
            `);
	});

	let insertMainPosts = async function () {
		for (let post of mainPosts) {
			const { rows } = await poolClient.query(`
                            WITH date_posted_rows AS (
                                INSERT INTO 
                                    posts (content, user_username, game)
                                VALUES 
                                    ('${post.content}','${post.user.username}','${post.game}')
                                RETURNING 
                                    date_posted
                            )

                            SELECT * FROM date_posted_rows;
                        `);

			console.log(rows);

			let date_posted = dayjs(rows[0]["date_posted"]).toISOString();

			post.date_posted = date_posted;
		}

		console.log(
			"here is an example: user -> " +
				mainPosts[0].user.username +
				" content -> " +
				mainPosts[0].content +
				" date -> " +
				mainPosts[0].date_posted
		);

		console.log(
			"here is the same thing but he original -> user -> " +
				dependentPosts[0].ownerPost.user.username +
				" content -> " +
				dependentPosts[0].ownerPost.content +
				" date -> " +
				dependentPosts[0].ownerPost.date_posted
		);

		console.log("I completed inserting main posts");
		await insertDependentPosts();
	};

	let insertDependentPosts = async function () {
		for (let post of dependentPosts) {
			const { rows } = await poolClient.query(`
                            WITH date_posted_rows AS (
                                INSERT INTO
                                    posts (content, user_username, game, owner_post_date_posted, owner_post_user_username)
                                VALUES 
                                    ('${post.content}',
                                    '${post.user.username}',
                                    '${post.game}',
                                    '${post.ownerPost.date_posted}',
                                    '${post.ownerPost.user.username}'
                                    )
                                RETURNING 
                                    date_posted
                            )

                            SELECT * FROM date_posted_rows;
                        `);

			let date_posted = dayjs(rows[0]["date_posted"]).toISOString();
			console.log(rows.length);
			console.log("type of date posted: " + typeof date_posted);
			console.log(date_posted);

			post.date_posted = date_posted;
		}

		console.log("I completed inserting dependent posts");
		await insertInteractions();
	};

	let insertInteractions = async function () {
		for (let interaction of interactions) {
			await poolClient.query(`
                            INSERT INTO
                                interactions (user_username,post_date_posted,post_user_username,interaction_type)
                            VALUES
                                ('${interaction.user.username}',
                                '${interaction.post.date_posted}',
                                '${interaction.post.user.username}',
                                '${interaction.type}');
                        `);
			console.log("at least 1 tho :|");
		}

		console.log("I have completed inserting interactions");
	};

	await insertMainPosts();
}

export default { insertMockDataToDatabase };
