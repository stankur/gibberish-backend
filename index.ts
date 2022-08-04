import express, { ErrorRequestHandler, Express } from "express";
import createError  from "http-errors"
import dotenv from "dotenv";
import poolClient from "./poolClient"

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 80;

app.use(express.json());

app.get("/", (req, res) => {
	res.json({ hey: "wuddup" });
});

app.post("/users", (req, res, next) => {
    try {
		const { username, password } = req.body;

		if (!username || !password) {
			return next(new Error("missing required fields!"));
		}

		if (
			[username, password].some(
				(value) =>
					typeof value !== "string" && typeof value !== "number"
			)
		) {
			return next(
				new Error(
					"either username or password that has been covered up is not text or number!"
				)
			);
		}

		poolClient
			.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
				username,
				password,
			])
			.then(() => {
				res.json({ status: "success" });
			});
	} catch (err) {
		return next(err);
	}
})

app.use(function (req, res, next) {
	next(createError(404));
});


const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
	const status = err.status || 500;
	const message = err.message || "Hmm.. Something seems to not be working";

    return res.json({error: {status, message}});
};

app.use(errorHandler);

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

export default app
