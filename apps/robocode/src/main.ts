import { enableProdMode, importProvidersFrom, provideExperimentalZonelessChangeDetection } from "@angular/core";
import { Logger, LogLevel } from "@robo-code/utils";

import { environment } from "./environments/environment";
import { AppComponent } from "./app/app.component";
import { UiModule } from "@robo-code/ui";
import { SocketIoConfig, SocketIoModule } from "ngx-socket-io";
import { bootstrapApplication } from "@angular/platform-browser";

const config: SocketIoConfig = { url: "http://localhost:3333", options: {} };

Logger.setLogLevel(LogLevel.DEBUG);

if (environment.production) {
    Logger.setLogLevel(LogLevel.WARN);
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        provideExperimentalZonelessChangeDetection(),
        importProvidersFrom(SocketIoModule.forRoot(config), UiModule),
    ],
}).catch((err) => console.error(err));
