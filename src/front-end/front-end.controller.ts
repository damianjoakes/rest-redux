import { Controller, Get } from "@nestjs/common";

/**
 * Controller which handles acquisition of front-end files.
 * Note that this is a **catch-all controller**. This should be loaded after
 * all other controllers.
 */
@Controller("*")
export class FrontEndController {
    @Get()
    async getFrontEndFiles(): Promise<string> {
        return "Hello, world!";
    }
}