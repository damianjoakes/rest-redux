import { createSqlConnection } from "./sql.service";

describe("sqlClient", () => {
    it("should get rows", async () => {
        const client = await createSqlConnection({
            ssl: false,
            host: "localhost",
            port: 5432,
            user: "postgres",
            password: "test",
            database: "rest_test"
        });

        let queryResult = await client.query("SELECT * FROM articles");
        expect(queryResult).toBeDefined();
    });
});