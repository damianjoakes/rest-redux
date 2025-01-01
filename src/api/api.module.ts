import { Module } from "@nestjs/common";
import { V1Module } from "./v1/v1.module";

/**
 * Module for the application API, imports API version modules, allowing for
 * modularity between rewrites and API additions.
 */
@Module({
    imports: [
        // Import API version modules as needed.
        V1Module
    ],
    controllers: [],
    providers: []
})
export class ApiModule {}