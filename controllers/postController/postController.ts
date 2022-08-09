import { RequestHandler } from "express";
import { applyQueries, getDateRange } from "../helper";
import poolClient from "../../poolClient";
import { AcceptableQuery } from "../types";

const createUpvotesTempTableQuery = `
    SELECT 
        COUNT(*) AS upvotes,
        post_id
    INTO TEMP TABLE 
        post_upvotes
    FROM 
        interactions
    WHERE
        interactions.interaction_type = 'upvote'
    GROUP BY
        post_id;
`;

const createDownvotesTempTableQuery = `
    SELECT 
        COUNT(*) AS downvotes,
        post_id
    INTO TEMP TABLE 
        post_downvotes
    FROM 
        interactions
    WHERE
        interactions.interaction_type = 'downvote'
    GROUP BY
        post_id;
`;

const createPointsTempTableQuery = `
    ${createUpvotesTempTableQuery}

    ${createDownvotesTempTableQuery}

    SELECT 
        ((CASE
            WHEN
                post_upvotes.upvotes IS NULL THEN 0
            ELSE post_upvotes.upvotes
            END
        ) - 
        (CASE
            WHEN
                post_downvotes.downvotes IS NULL THEN 0
            ELSE post_downvotes.downvotes
            END
        )) AS points,
        post_id
    INTO TEMP TABLE
        post_points
    FROM 
        post_upvotes
    FULL OUTER JOIN 
        post_downvotes
    USING (post_id);
`;

const getPointsOfPost: RequestHandler = async (req, res, next) => {
    const query: string = `
        ${createPointsTempTableQuery}

        SELECT * FROM post_points;
    `;

    const result = await poolClient.query(query);

    console.log(result);
    return res.json(result);
}

const createTotalRepliesTempTable = `
    SELECT 
        COUNT (*) AS total_replies,
        owner_post_id AS post_id
    INTO TEMP TABLE
        post_replies
    FROM
        posts
    WHERE 
        (owner_post_id IS NOT NULL)
    GROUP BY
        owner_post_id;
`;

const createMainPostsTempTable = (urlQuery: AcceptableQuery) => `
    SELECT
        *
    INTO TEMP TABLE
        main_posts
    FROM
        posts
    WHERE
        owner_post_id IS NULL
        ${
			getDateRange(urlQuery, "posts", "date_posted") === ""
				? ""
				: ` AND ${getDateRange(urlQuery, "posts", "date_posted")}`
		}
    ${applyQueries(urlQuery, "posts", "date_posted")};
`;

const getMainPosts: RequestHandler = async (req, res, next) => {
	let urlQuery = req.query;

	const query: string = `
    ${createTotalRepliesTempTable}

    ${createMainPostsTempTable(urlQuery)}


    SELECT 
        post_id,
        total_replies
    FROM
        main_posts
    LEFT JOIN
        post_replies
    ON
        main_posts.id = post_replies.post_id;

    `;

	let results = await poolClient.query(query);

	console.log(results);
	return res.json(results);
};

export { getPointsOfPost, getMainPosts };