import { RequestHandler } from "express";
import poolClient from "../../poolClient";

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

export { getPointsOfPost }