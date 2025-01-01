import { Injectable } from "@nestjs/common";
import { Client, ClientConfig } from "pg";
import { Article } from "./articles.dto";

/**
 * Articles service. Handles CRUD operations of articles in the SQL database.
 * Also allows for searching through articles in Elasticsearch.
 */
@Injectable()
export class ArticlesService {
    client: Client;

    /**
     * Creates a new ArticlesService instance.
     * This service will connect to the database by default. If `disconnect()` is called, then the
     * `connect()` method must be called to resume database operations.
     *
     * This will throw an error if the SQL client is not reachable.
     * @param config
     */
    constructor(config: ClientConfig) {
        this.client = new Client(config);
        this.client.connect((err) => {
            if(err) throw err;
        });
    }


    /**
     * Creates an article using a transaction. This function will return either an error if
     * there was an error creating the article. Otherwise, it will return null.
     * @param article
     */
    async create(article: Article): Promise<Error | null> {
        // Attempt to create a new article.
        try {
            await this.client.query("BEGIN");
            await this.client.query(
                "INSERT INTO articles" + // inserting into the articles table.
                "(article_id, title, popularity, submitted_date, description, deindex)" + // specify the columns.
                "VALUES ($1, $2, $3, $4, $5, $6)", // use placeholders, as pg.Client can't cast dates by templating.
                [
                    article.article_id,
                    article.title,
                    article.popularity,
                    article.submitted_date,
                    article.description,
                    article.deindex
                ]
            );

            // Commit the transaction.
            await this.client.query("COMMIT;");
            return null;
        } catch (e) {
            // An error occurred. Rollback the transaction.
            await this.client.query("ROLLBACK;");
            return e as Error;
        }
    }


    /**
     * Gets all articles from the database.
     */
    async read(): Promise<Article[]>;

    /**
     * Gets an article that matches the provided articleId. Returns an array for consistency.
     *
     * To get one `Article` back, instead use `readOne()`.
     * @param articleId
     */
    async read(articleId: string): Promise<Article[]>;

    /**
     * Gets an article, or articles, from the server, based on whether an articleId is provided or not.
     *
     * For consistency between calls, this will always return an array of articles. To explicitly get one record, use
     * `readOne`.
     * @param articleId
     */
    async read(articleId?: string): Promise<Article[]> {
        if (articleId) {
            // An articleId was provided. Get an article that matches the articleId.
            let queryResult = await this.client
                .query<Article>(`SELECT * FROM articles WHERE article_id = '${articleId}'::uuid;`);

            return queryResult.rows;
        } else {
            // No articleId was provided. Get all available articles from the database.
            let queryResult = await this.client
                .query<Article>("SELECT * FROM articles;");

            return queryResult.rows;
        }
    }


    /**
     * Gets one article, returning either an `Article` object, or `null`.
     * @param articleId
     */
    async readOne(articleId: string): Promise<Article | null> {
        let queryResult = await this.client
            .query<Article>(`SELECT * FROM articles WHERE article_id = '${articleId}'::uuid;`);

        // If the number of rows we've located is greater than 0, then return the first row.
        return (queryResult.rows.length > 0) ? queryResult.rows[0] : null;
    }


    /**
     * Attempts to update an article, using a partially provided article.
     *
     * Returns the provided articleId if the operation was successful.
     *
     * **This will _not_ allow updating the article_id. If an article_id is provided, it will be disregarded.
     * If only an article_id is provided, then this will return null and no operation will be performed.**
     * @param articleId
     * @param article
     */
    async update(articleId: string, article: Partial<Article>): Promise<string | null | Error> {
        let articleKeysLength = Object.keys(article).length;

        if(article.article_id) {
            if(articleKeysLength <= 1) return null;

            // We need to subtract one from the key length, as we're going to be using this for building the query.
            articleKeysLength -= 1;
        }

        let new_article = structuredClone(article);
        delete new_article.article_id;

        // Build the "SET" line.
        let setString = "SET ";
        let index = 1;

        for(let key in new_article) {
            setString += `${key} = $${index}`;
            if(index < articleKeysLength) {
                setString += ", ";
            }

            index = index + 1;
        }

        // Attempt the database update.
        try {
            const query = "UPDATE articles " +
                setString + " " +
                `WHERE article_id = '${articleId}'::uuid`;

            console.debug(query);

            await this.client.query<Article>("BEGIN");
            await this.client.query<Article>(
                query,
                Object.values(new_article)
            );

            await this.client.query<Article>("COMMIT;");

            return articleId;
        } catch (e) {
            await this.client.query<Article>("ROLLBACK;");

            return e as Error;
        }
    }


    /**
     * Attempts to delete an article using an articleId, via a transaction.
     *
     * This will return null if the operation was completed successfully, and will return an error if the
     * operation failed and the transaction was rolled back.
     * @param articleId
     */
    async delete(articleId: string) {
        try {
            await this.client.query<Article>("BEGIN");
            await this.client.query<Article>(`DELETE FROM articles WHERE article_id = '${articleId}'::uuid;`);
            await this.client.query<Article>("COMMIT;");
            return null;
        } catch (e) {
            await this.client.query<Article>("ROLLBACK;");
            return e as Error;
        }

    }
}