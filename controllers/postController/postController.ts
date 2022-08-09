import { RequestHandler } from "express";
import { applyQueries, getDateRange } from "../helper";
import poolClient from "../../poolClient";
import { AcceptableQuery } from "../types";

const createUpvotesTempTableQuery = `
    SELECT 
        COUNT(*) AS upvotes,
        post_date_posted, 
        post_user_username
    INTO TEMP TABLE 
        post_upvotes
    FROM 
        interactions
    WHERE
        interactions.interaction_type = 'upvote'
    GROUP BY
        post_date_posted, post_user_username;
`;

const createDownvotesTempTableQuery = `
    SELECT 
        COUNT(*) AS downvotes,
        post_date_posted, 
        post_user_username
    INTO TEMP TABLE 
        post_downvotes
    FROM 
        interactions
    WHERE
        interactions.interaction_type = 'downvote'
    GROUP BY
        post_date_posted, post_user_username;
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
        post_date_posted, 
        post_user_username
    INTO TEMP TABLE
        post_points
    FROM 
        post_upvotes
    FULL OUTER JOIN 
        post_downvotes
    USING (post_date_posted, post_user_username);
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
        owner_post_date_posted AS date_posted,
        owner_post_user_username AS user_username
    INTO TEMP TABLE
        post_replies
    FROM
        posts
    WHERE 
        (owner_post_date_posted IS NOT NULL)
        AND 
        (owner_post_user_username IS NOT NULL)
    GROUP BY
        owner_post_date_posted,
        owner_post_user_username;
`;

const createMainPostsTempTable = (urlQuery: AcceptableQuery) => `
    SELECT
        *
    INTO TEMP TABLE
        main_posts
    FROM
        posts
    WHERE
        owner_post_date_posted IS NULL AND
        owner_post_user_username IS NULL
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

    SELECT * FROM post_replies;
    SELECT * FROM main_posts;

    SELECT 
        main_posts.date_posted AS mp_date_posted,
        main_posts.user_username AS mp_user_username,
        post_replies.date_posted AS pr_date_posted,
        post_replies.user_username AS pr_user_username,
        total_replies
    FROM
        main_posts
    FULL OUTER JOIN
        post_replies
    ON
        (main_posts.date_posted = post_replies.date_posted) AND
        (main_posts.user_username = post_replies.user_username);

    `;

	let results = await poolClient.query(query);

	console.log(results);
	return res.json(results);
};

export { getPointsOfPost, getMainPosts };