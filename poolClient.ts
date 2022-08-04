import Pool from "pg-pool";

const pool = new Pool({
	database: "postgres",
	user: "postgres",
	password: "example",
	port: 5432,
	max: 10, // Pool max size
	idleTimeoutMillis: 1000, // Close idle clients after 1 second
});

type EmbeddableValue = string | number;

const query = (text: string, values?: EmbeddableValue[]) => {
	return pool.query(text, values);
};

export default {query}
