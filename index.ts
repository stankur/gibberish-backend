import express, { ErrorRequestHandler, Express } from "express";
import createError  from "http-errors"
import dotenv from "dotenv";

import apiRouter from "./routes/api"


dotenv.config();

const app: Express = express();
const port = process.env.PORT || 80;

app.use(express.json());

app.use("/api", apiRouter);

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
