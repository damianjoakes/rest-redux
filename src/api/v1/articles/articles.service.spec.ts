import { ArticlesService } from "./articles.service";
import { v4 as uuidv4 } from "uuid";


describe("the articles service", () => {
    let articlesService: ArticlesService = new ArticlesService({
        ssl: false,
        host: "localhost",
        port: 5432,
        user: "postgres",
        password: "test",
        database: "rest_test"
    });


    // Create an article
    it("should be able to create articles", async () => {
        let result = await articlesService.create({
            article_id: uuidv4(),
            deindex: false,
            popularity: 0,
            title: "test 3",
            description: "",
            submitted_date: new Date()
        });

        expect(result).toBe(null);
    });


    // Create an article without providing a description.
    it("should be able to create an article without a description", async () => {
        let result = await articlesService.create({
            article_id: uuidv4(),
            deindex: false,
            popularity: 0,
            title: "test without description",
            submitted_date: new Date()
        });

        expect(result).toBe(null);
    });


    // Gets all articles.
    it("should be able to read all articles", async () => {
        let queryResult = await articlesService.read();

        console.log(queryResult);

        expect(queryResult).toBeInstanceOf(Array);
    });


    // Gets one article, wrapped in an array.
    it("should be able to read one article", async () => {
        let queryResult = await articlesService.read("0d18f029-008b-4920-a2ad-161624a0af62");

        console.log(queryResult);

        expect(queryResult).toBeInstanceOf(Array);
    });


    // Gets one article, only the object.
    it("should be able to read one article, as an object", async () => {
        let queryResult = await articlesService.readOne("05c92c2f-21de-4bae-aca2-9e59a08f21d0");

        console.log(queryResult);

        expect(queryResult).not.toBe(null);
    });


    // Gets one article, only the object.
    it("should return null when readOne is given a non existent article id", async () => {
        let queryResult = await articlesService.readOne("0d18f029-008b-4920-a2ad-161624a0af62");

        console.log(queryResult);

        expect(queryResult).toBe(null);
    });


    // Updates one field in an article.
    it("should be able to update one field on an article", async () => {
        let updateResult = await articlesService.update("0d18f028-008b-4920-a2ad-161624a0af62", {
           deindex: true
        });

        console.log(updateResult);

        expect(updateResult).toEqual("0d18f028-008b-4920-a2ad-161624a0af62");
    });


    // Updates multiple fields in an article.
    it("should be able to update multiple fields on an article", async () => {
        let updateResult = await articlesService.update("0d18f028-008b-4920-a2ad-161624a0af62", {
            article_id: "0d18f029-008b-4920-a2ad-161624a0af62", // This should be ignored.
            deindex: false,
            popularity: 1
        });

        console.log(updateResult);

        expect(updateResult).not.toBe(null);
        expect(updateResult).not.toBeInstanceOf(Error);
    });


    // Deletes an article.
    it("should be able to delete an article by id", async () => {
        let deleteResult = await articlesService.delete("0d18f028-008b-4920-a2ad-161624a0af62");

        console.log(deleteResult);

        expect(deleteResult).toBe(null);
    });
});