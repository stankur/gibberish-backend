import { Express } from "express";

import Pool from "pg-pool";
import poolClient from "./poolClient";
import request from "supertest";
import { expect } from "chai";

describe("sample test of inserting a new user", () => {
	let app: Express;

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

	app = require("./index").default;

	beforeEach("create temporary tables", async function () {
		await poolClient.query(
			"CREATE TEMPORARY TABLE users (LIKE users INCLUDING ALL)"
		);
	});

	afterEach("Drop temporary tables", async function () {
		await poolClient.query("DROP TABLE IF EXISTS pg_temp.users");
	});

	it("add user test", (done) => {
		request(app)
			.post("/users")
			.send({ username: "stankur", password: "somehashedpassword" })
			.expect("Content-Type", /json/)
			.expect(200)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				poolClient
					.query("SELECT * FROM users")
					.then((result) => {
						expect(result.rows.length).to.equal(1);
						done();
					})
					.catch((err) => {
						return done(err);
					});
			});
	});
});
