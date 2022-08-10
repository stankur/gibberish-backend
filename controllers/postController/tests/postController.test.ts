import express, { Express, response } from "express";

import Pool from "pg-pool";
import poolClient from "../../../poolClient";
import request from "supertest";
import { expect } from "chai";

import testHelper from "../../testHelper";

import dayjs from "dayjs";

import mockData from "../../mockData";
import { User, DependentPost, MainPost, Interaction } from "../../types";

import {
    getMainPostsInfo
} from "../postController";

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

		mockData.interaction010 as Interaction,
		mockData.interaction011 as Interaction,
		mockData.interaction012 as Interaction,
		mockData.interaction013 as Interaction,

		mockData.interaction020 as Interaction,
		mockData.interaction021 as Interaction,
		mockData.interaction022 as Interaction,
		mockData.interaction023 as Interaction,

		mockData.interaction10 as Interaction,
		mockData.interaction11 as Interaction,
		mockData.interaction12 as Interaction,
		mockData.interaction13 as Interaction,
		mockData.interaction14 as Interaction,

		mockData.interaction100 as Interaction,

		mockData.interaction110 as Interaction,
		mockData.interaction111 as Interaction,

		mockData.interaction120 as Interaction,
		mockData.interaction121 as Interaction,
		mockData.interaction122 as Interaction,

		mockData.interaction130 as Interaction,

		mockData.interaction140 as Interaction,
		mockData.interaction141 as Interaction,
		mockData.interaction142 as Interaction,

		mockData.interaction20 as Interaction,
		mockData.interaction21 as Interaction,
		mockData.interaction22 as Interaction,
		mockData.interaction23 as Interaction,
		mockData.interaction24 as Interaction,

		mockData.interaction200 as Interaction,
		mockData.interaction201 as Interaction,
		mockData.interaction202 as Interaction,
		mockData.interaction203 as Interaction,
		mockData.interaction204 as Interaction,

		mockData.interaction210 as Interaction,
		mockData.interaction211 as Interaction,
		mockData.interaction212 as Interaction,
		mockData.interaction213 as Interaction,
		mockData.interaction214 as Interaction,

		mockData.interaction220 as Interaction,
		mockData.interaction221 as Interaction,
		mockData.interaction222 as Interaction,
		mockData.interaction223 as Interaction,
		mockData.interaction224 as Interaction,

		mockData.interaction30 as Interaction,
		mockData.interaction31 as Interaction,

		mockData.interaction300 as Interaction,
		mockData.interaction301 as Interaction,
		mockData.interaction302 as Interaction,
		mockData.interaction303 as Interaction,
		mockData.interaction304 as Interaction,

		mockData.interaction310 as Interaction,
		mockData.interaction311 as Interaction,
		mockData.interaction312 as Interaction,
		mockData.interaction313 as Interaction,
		mockData.interaction314 as Interaction,

		mockData.interaction320 as Interaction,
		mockData.interaction321 as Interaction,
		mockData.interaction322 as Interaction,
		mockData.interaction323 as Interaction,

		mockData.interaction330 as Interaction,
		mockData.interaction331 as Interaction,
		mockData.interaction332 as Interaction,
	];

	const app: Express = express();
	app.use(express.json());
	app.get("/main-info", getMainPostsInfo);

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
		await poolClient.query(`
        DROP TABLE IF EXISTS pg_temp.users;
        DROP TABLE IF EXISTS pg_temp.posts;
        DROP TABLE IF EXISTS pg_temp.interactions;

        DROP TABLE IF EXISTS pg_temp.post_upvotes;
        DROP TABLE IF EXISTS pg_temp.post_downvotes;
        DROP TABLE IF EXISTS pg_temp.post_partial_points;
        DROP TABLE IF EXISTS pg_temp.post_points;
        DROP TABLE IF EXISTS pg_temp.post_total_replies;
        DROP TABLE IF EXISTS pg_temp.main_posts;
        DROP TABLE IF EXISTS pg_temp.ranked_replies;
        DROP TABLE IF EXISTS pg_temp.limited_ranked_replies;
        DROP TABLE IF EXISTS pg_temp.base_main_posts_info;
        DROP TABLE IF EXISTS pg_temp.main_posts_numbered_replies;
        `);
	});

	it("could get main posts info", (done) => {
		request(app)
			.get("/main-info")
			.expect("Content-Type", /json/)
			.expect(200)
			.end((err, response) => {
                if (err) {
                    return done(err);
                }

				console.log(
					"this must be main posts info : " +
						JSON.stringify(response.text)
				);
				return done();

            });
	});
});
