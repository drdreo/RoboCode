import { enableProdMode, importProvidersFrom } from "@angular/core";
import { Logger, LogLevel } from "@robo-code/utils";

import { environment } from "./environments/environment";
import { AppComponent } from "./app/app.component";
import { UiModule } from "@robo-code/ui";
import { SocketIoConfig, SocketIoModule } from "ngx-socket-io";
import { bootstrapApplication, BrowserModule } from "@angular/platform-browser";
import { CanvasService } from "./app/arena-canvas/canvas.service";
import { BotService } from "./app/bot.service";

const config: SocketIoConfig = { url: "http://localhost:3333", options: {} };

Logger.setLogLevel(LogLevel.DEBUG);

if (environment.production) {
    Logger.setLogLevel(LogLevel.WARN);
    Logger.setLogLevel(LogLevel.WARN);
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, SocketIoModule.forRoot(config), UiModule),
        BotService,
        CanvasService,
    ],
}).catch((err) => console.error(err));
