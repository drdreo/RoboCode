import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { UiModule } from '@robo-code/ui';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

import { AppComponent } from './app.component';
import { BackgroundComponent } from "./arena-canvas/arena-background/background.component";
import { ArenaCanvasComponent } from './arena-canvas/arena-canvas.component';
import { CanvasService } from "./arena-canvas/canvas.service";
import { BotService } from './bot.service';

const config: SocketIoConfig = { url: 'http://localhost:3333', options: {} };

@NgModule({
    declarations: [ AppComponent, ArenaCanvasComponent, BackgroundComponent ],
    imports: [ BrowserModule, SocketIoModule.forRoot(config), UiModule ],
    providers: [ BotService, CanvasService ],
    bootstrap: [ AppComponent ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class AppModule {}
