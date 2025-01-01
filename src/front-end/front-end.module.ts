import { Module } from "@nestjs/common";
import { FrontEndController } from "./front-end.controller";

/**
 * Module which allows modularity around front-end application serving.
 */
@Module({
    imports: [],
    controllers: [FrontEndController],
    providers: []
})
export class FrontEndModule {}