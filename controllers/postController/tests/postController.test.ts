import express, { Express } from "express";

import Pool from "pg-pool";
import poolClient from "../../../poolClient";
import request from "supertest";
import { expect } from "chai";

import async, { waterfall } from "async";
import dayjs from "dayjs";

import mockData, {
	User,
	DependentPost,
	MainPost,
	Interaction,
} from "../../mockData";

import { getPointsOfPost } from "../postController";

type DatedMainPost = MainPost & {
	date_posted?: any;
};

type DatedDependentPost = DependentPost & {
	date_posted?: any;
};

describe("sample test", () => {
	const pool = new Pool({
		database: "postgres",
		user: "postgres",
		password: "example",
		port: 5432,
		max: 1,
	});

	poolClient.query = (text, values) => {
		return pool.query(text, values);
	};

	let users: User[] = [
		mockData.user0,
		mockData.user1,
		mockData.user2,
		mockData.user3,
		mockData.user4,
	];

	let mainPosts: DatedMainPost[] = [mockData.postWhy0];

	let dependentPosts: DatedDependentPost[] = [
		mockData.postBecause00,
		mockData.postBecause01,
		mockData.postBecause02,
	];

	let interactions: Interaction[] = [
		mockData.interaction00,
		mockData.interaction01,
		mockData.interaction02,
		mockData.interaction03,
		mockData.interaction04,

		mockData.interaction000,
		mockData.interaction001,
		mockData.interaction002,
		mockData.interaction003,
		mockData.interaction004,
	];

	const app: Express = express();
	app.use(express.json());
	app.get("/test", getPointsOfPost);

	beforeEach("create temporary tables", async function () {
		await poolClient.query(
			`
            CREATE TEMPORARY TABLE 
                users (LIKE users INCLUDING ALL);

            CREATE TEMPORARY TABLE
                posts (LIKE posts INCLUDING ALL);

            CREATE TEMPORARY TABLE
                interactions (LIKE interactions INCLUDING ALL);
            `
		);

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

				Object.assign(post, { date_posted });
			}

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
                                    '${
										mainPosts.find((mainPost) => {
											return (
												post.ownerPost.content ===
												mainPost.content
											);
										})?.date_posted
									}',
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
                                '${
									[...mainPosts, ...dependentPosts].find(
										(post) => {
											console.log(post.date_posted);
											return (
												post.content ===
												interaction.post.content
											);
										}
									)?.date_posted
								}',
                                '${interaction.post.user.username}',
                                '${interaction.type}');
                        `);
                console.log("at least 1 tho :|")
			}

			console.log("I have completed inserting interactions");
		};

		await insertMainPosts();
	});

	afterEach("Drop temporary tables", async function () {
		await poolClient.query("DROP TABLE IF EXISTS pg_temp.users");
	});

	it("test if could get all posts points correctly", (done) => {
		request(app)
			.get("/test")
			.expect("Content-Type", /json/)
			.expect(200)
			.end((err, response) => {
				if (err) {
					return done(err);
				}

				console.log(
					"this must be the json guy: " +
						JSON.stringify(response.text)
				);
				return done();
			});
	});
});
