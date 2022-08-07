interface AcceptableQuery {
	sort?: "new" | "points";
	limit?: string;
	offset?: string;
	time_range?: "current";
	start_time?: string;
	end_time?: string;
}

export { AcceptableQuery };
