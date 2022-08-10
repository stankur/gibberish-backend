import { RequestHandler } from "express";
import { applyQueries, getDateRange } from "../helper";
import poolClient from "../../poolClient";
import { AcceptableQuery } from "../types";

const createUpvotesTempTableQuery = `
    CREATE TEMP TABLE IF NOT EXISTS post_upvotes AS
    SELECT 
        COUNT(*) AS upvotes,
        post_id
    FROM 
        interactions
    WHERE
        interactions.interaction_type = 'upvote'
    GROUP BY
        post_id;
`;

const createDownvotesTempTableQuery = `
    CREATE TEMP TABLE IF NOT EXISTS post_downvotes AS
    SELECT 
        COUNT(*) AS downvotes,
        post_id
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

    CREATE TEMP TABLE IF NOT EXISTS post_partial_points AS
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
    FROM 
        post_upvotes
    FULL OUTER JOIN 
        post_downvotes
    USING (post_id);

    CREATE TEMP TABLE IF NOT EXISTS post_points AS
    SELECT 
        (CASE
            WHEN
                post_partial_points.points IS NULL THEN 0 
            ELSE post_partial_points.points 
            END
        ) AS points,
        id,
        owner_post_id,
        content,
        user_id,
        date_posted
    FROM post_partial_points
    FULL OUTER JOIN
        posts
    ON post_partial_points.post_id = posts.id;

`;

const createTotalRepliesTempTableQuery = `
    CREATE TEMP TABLE IF NOT EXISTS post_total_replies AS
    SELECT 
        COUNT (*) AS total_replies,
        owner_post_id AS post_id
    FROM
        posts
    WHERE 
        (owner_post_id IS NOT NULL)
    GROUP BY
        owner_post_id;
`;

const createMainPostsTempTableQuery = (urlQuery: AcceptableQuery) => `
    CREATE TEMP TABLE IF NOT EXISTS main_posts AS
    SELECT
        *
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

const createMainPostsNumberedRepliesQuery = (urlQuery: AcceptableQuery) => `
    ${createPointsTempTableQuery}

    ${createTotalRepliesTempTableQuery}

    ${createMainPostsTempTableQuery(urlQuery)}

    CREATE TEMP TABLE IF NOT EXISTS main_posts_numbered_replies AS
    SELECT 
        total_replies,
        post_id,
        content,
        date_posted,
        user_id
    FROM
        main_posts
    LEFT JOIN
        post_total_replies
    ON
        main_posts.id = post_total_replies.post_id;

`;

const createRankedRepliesTempTableQuery = `
    ${createPointsTempTableQuery}

    CREATE TEMP TABLE IF NOT EXISTS ranked_replies AS
    SELECT 
        ROW_NUMBER () OVER (
            PARTITION BY owner_post_id
            ORDER BY points DESC
        ) reply_rank,
        id as post_id,
        date_posted,
        owner_post_id,
        content,
        user_id
    FROM
        post_points
    WHERE
        post_points.owner_post_id IS NOT NULL;
`;

const createLimitedRankedRepliesTempTableQuery = (
	urlQuery: AcceptableQuery
) => `
    ${createMainPostsTempTableQuery(urlQuery)}

    ${createRankedRepliesTempTableQuery}

    CREATE TEMP TABLE IF NOT EXISTS limited_ranked_replies AS
    SELECT
        ranked_replies.*
    FROM   
        ranked_replies
    RIGHT JOIN
        main_posts
    ON
        ranked_replies.owner_post_id = main_posts.id
    WHERE
        reply_rank <= 3;

`; 

const whicheverNotNull = (
	table1Name: string,
	table2Name: string,
	columnName: string
) => `
    (CASE 
        WHEN ${table1Name}.${columnName} IS NULL THEN ${table2Name}.${columnName}
        ELSE  ${table1Name}.${columnName}
    END) AS ${columnName}
`;

const createBaseMainPostsInfoTempTableQuery = (urlQuery: AcceptableQuery) => `
        ${createLimitedRankedRepliesTempTableQuery(urlQuery)}

        ${createMainPostsNumberedRepliesQuery(urlQuery)}

        CREATE TEMP TABLE IF NOT EXISTS base_main_posts_info AS
        SELECT 
            total_replies,
            ${whicheverNotNull(
				"limited_ranked_replies",
				"main_posts_numbered_replies",
				"post_id"
			)},
            ${whicheverNotNull(
				"limited_ranked_replies",
				"main_posts_numbered_replies",
				"user_id"
			)},
            ${whicheverNotNull(
				"limited_ranked_replies",
				"main_posts_numbered_replies",
				"content"
			)},
            ${whicheverNotNull(
				"limited_ranked_replies",
				"main_posts_numbered_replies",
				"date_posted"
			)},
            owner_post_id,
            reply_rank
        FROM 
            limited_ranked_replies
        FULL OUTER JOIN
            main_posts_numbered_replies
        USING (post_id);
`;

const getMainPostsInfo: RequestHandler =async (req, res, next) => {
	let urlQuery = req.query;

    const query: string = `
        ${createBaseMainPostsInfoTempTableQuery(urlQuery)}

        ${createPointsTempTableQuery}

        SELECT
            total_replies,
            post_id,
            ${whicheverNotNull(
				"base_main_posts_info",
				"post_points",
				"content"
			)},
            ${whicheverNotNull(
				"base_main_posts_info",
				"post_points",
				"date_posted"
			)},
            ${whicheverNotNull(
				"base_main_posts_info",
				"post_points",
				"owner_post_id"
			)},
            reply_rank,
            users.username AS user_username,
            points
        FROM
            base_main_posts_info
        LEFT JOIN
            users
            ON
            users.id = base_main_posts_info.user_id
        LEFT JOIN
            post_points
            ON
            post_points.id = base_main_posts_info.post_id;
    `;

	let results = await poolClient.query(query);

	console.log(results);
	return res.json(results);
}


export { getMainPostsInfo };