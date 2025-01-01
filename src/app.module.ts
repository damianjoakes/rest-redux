import { Module } from '@nestjs/common';
import { ApiModule } from "./api/api.module";
import { FrontEndModule } from "./front-end/front-end.module";
import { RouterModule } from "@nestjs/core";
import { V1Module } from "./api/v1/v1.module";

@Module({
    imports: [
        // Registering route prefixes for the API modules.
        ApiModule,
        RouterModule.register([
            {
                path: "api",
                module: ApiModule,
                // Each child of the api path should be reserved for api rewrites and changes.
                children: [
                    {
                        path: "v1",
                        module: V1Module
                    }
                ]
            }
        ]),
        // Import the front end module for serving Angular applications.
        FrontEndModule
    ],
})
export class AppModule {}
