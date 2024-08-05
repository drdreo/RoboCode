import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CodeService } from "./code/code.service";
import { BotGateway } from "./robot/bot.gateway";
import { SimulationService } from "./engine/simulation.service";
import { UploadController } from "./upload/upload.controller";
import { BotController } from "./robot/bot.controller";

@Module({
    imports: [
        MulterModule.register({
            dest: "assets/upload",
        }),
    ],
    controllers: [AppController, UploadController, BotController],
    providers: [AppService, CodeService, SimulationService, BotGateway],
})
export class AppModule {}
