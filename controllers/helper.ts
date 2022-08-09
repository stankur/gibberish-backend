import { AcceptableQuery } from "./types";
import dayjs from "dayjs";

import dotenv from "dotenv";
dotenv.config();

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

function applyQueries(
	query: AcceptableQuery,
	dateTable?: string,
	dateColumn?: string,
	pointsTable?: string,
	pointsColumn?: string
): string {
	let combinedQuery = "";

	let sort = query.sort;
	if (sort) {
		if (sort === "new") {
			if (!(dateTable && dateColumn)) {
				throw new Error(
					"date table or date column not specified when they are needed!"
				);
			}

			combinedQuery += ` ORDER BY ${dateTable}.${dateColumn} DESC `;
		}

		if (sort === "points") {
			if (!pointsTable && pointsColumn) {
				throw new Error(
					"points table or points column not specified when they are needed!"
				);
			}
			combinedQuery += ` ORDER BY  ${pointsTable}.${pointsColumn} DESC `;
		}
	}
	if (query.limit && query.offset) {
		if (
			Number.parseInt(query.limit) > 0 &&
			Number.parseInt(query.offset) >= 0 &&
			Number.parseInt(query.limit).toString() === query.limit &&
			Number.parseInt(query.offset).toString() === query.offset
		) {
			combinedQuery += ` LIMIT ${query.limit} OFFSET ${query.offset}; `;
		}
	}

	return combinedQuery;
}

function getDateRange(
	query: AcceptableQuery,
	dateTable: string,
	dateColumn: string
): string {
	if (query.time_range && query.time_range === "current") {
		return ` ${dateTable}.${dateColumn} >= ${dayjs()
			.tz(process.env.TIMEZONE)
			.utc()
			.startOf("week")
			.format()} 
                AND
                ${dateTable}.${dateColumn} <= ${dayjs()
			.tz(process.env.TIMEZONE)
			.utc()
			.endOf("week")
			.format()}`;
	}

	if (
		query.start_time &&
		query.end_time &&
		dayjs(query.start_time).isValid() &&
		dayjs(query.end_time).isValid()
	) {
		return ` ${dateTable}.${dateColumn} >= ${dayjs(query.start_time)
			.utc()
			.format()}
                AND
                 ${dateTable}.${dateColumn} <= ${dayjs(query.end_time)
			.utc()
			.format()}
            `;
	}
	return "";
}

export { applyQueries, getDateRange };
