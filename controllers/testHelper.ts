import { DependentPost, Interaction, MainPost, User } from "./types";
import realPoolClient from "../poolClient";

async function insertMockDataToDatabase(
	users: User[],
	mainPosts: MainPost[],
	dependentPosts: DependentPost[],
	interactions: Interaction[],
	poolClient: typeof realPoolClient
) {
	for (let user of users) {
		const { rows } = await poolClient.query(`
            WITH id_posted_rows AS (
                INSERT INTO 
                    users (username, password)
                VALUES
                    ('${user.username}','${user.password}')
                RETURNING 
                    id
            )

            SELECT * FROM id_posted_rows;
            `);

		let id = rows[0]["id"];
		user.id = id;
	}

	for (let post of mainPosts) {
		const { rows } = await poolClient.query(`
            WITH id_posted_rows AS (
                INSERT INTO 
                    posts (content, user_id, game)
                VALUES 
                    ('${post.content}','${post.user.id}','${post.game}')
                RETURNING 
                    id
            )

            SELECT * FROM id_posted_rows;
        `);

		console.log(rows);
		let id = rows[0]["id"];

		post.id = id;
	}

	for (let post of dependentPosts) {
		const { rows } = await poolClient.query(`
            WITH id_posted_rows AS (
                INSERT INTO
                    posts (content, user_id, game, owner_post_id)
                VALUES 
                    ('${post.content}',
                    '${post.user.id}',
                    '${post.game}',
                    '${post.ownerPost.id}')
                RETURNING 
                    id
            )

            SELECT * FROM id_posted_rows;
        `);

		let id = rows[0]["id"];

		post.id = id;
	}

	for (let interaction of interactions) {
		const { rows } = await poolClient.query(`
            WITH id_posted_rows AS (
                INSERT INTO
                    interactions (user_id,post_id,interaction_type)
                VALUES
                    ('${interaction.user.id}',
                    '${interaction.post.id}',
                    '${interaction.type}')
                RETURNING
                    id
            )

            SELECT * FROM id_posted_rows;
        `);

		let id = rows[0]["id"];
		interaction.id = id;

		console.log("at least 1 tho :|");
	}

	console.log("I have completed inserting interactions");
}

export default { insertMockDataToDatabase };
