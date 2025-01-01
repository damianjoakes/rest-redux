import { Client, ClientConfig } from "pg";

/**
 * Creates a new SQL client that has been connected to the SQL database.
 * @param config
 */
export async function createSqlConnection(config: ClientConfig): Promise<Client> {
    const sqlClient = new Client(config);

    await sqlClient.connect();
    return sqlClient;
}
