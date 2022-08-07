import express, { Express } from "express";

import Pool from "pg-pool";
import poolClient from "../../../poolClient";
import request from "supertest";
import { expect } from "chai";

import testHelper from "../../testHelper";

import dayjs from "dayjs";

import mockData, {
	User,
	DependentPost,
	MainPost,
	Interaction,
} from "../../mockData";

import { getPointsOfPost } from "../postController";

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
		mockData.user0 as User,
		mockData.user1 as User,
		mockData.user2 as User,
		mockData.user3 as User,
		mockData.user4 as User,
	];

	let mainPosts: MainPost[] = [
		mockData.postWhy0 as MainPost,
		mockData.postWhy1 as MainPost,
		mockData.postWhy2 as MainPost,
		mockData.postWhy3 as MainPost,
	];

	let dependentPosts: DependentPost[] = [
		mockData.postBecause00 as DependentPost,
		mockData.postBecause01 as DependentPost,
		mockData.postBecause02 as DependentPost,
		mockData.postBecause10 as DependentPost,
		mockData.postBecause11 as DependentPost,
		mockData.postBecause12 as DependentPost,
		mockData.postBecause13 as DependentPost,
		mockData.postBecause14 as DependentPost,
		mockData.postBecause20 as DependentPost,
		mockData.postBecause21 as DependentPost,
		mockData.postBecause22 as DependentPost,
		mockData.postBecause30 as DependentPost,
		mockData.postBecause31 as DependentPost,
		mockData.postBecause32 as DependentPost,
		mockData.postBecause33 as DependentPost,
	];

	let interactions: Interaction[] = [
		mockData.interaction00 as Interaction,
		mockData.interaction01 as Interaction,
		mockData.interaction02 as Interaction,
		mockData.interaction03 as Interaction,
		mockData.interaction04 as Interaction,

		mockData.interaction000 as Interaction,
		mockData.interaction001 as Interaction,
		mockData.interaction002 as Interaction,
		mockData.interaction003 as Interaction,
		mockData.interaction004 as Interaction,
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

		await testHelper.insertMockDataToDatabase(
			users,
			mainPosts,
			dependentPosts,
			interactions,
			poolClient
		);
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
