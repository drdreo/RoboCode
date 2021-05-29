import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { UiModule } from '@robo-code/ui';



import { CanvasDomModule } from 'angular-canvas';

import { AppComponent } from './app.component';
import { ArenaCanvasComponent } from './arena-canvas/arena-canvas.component';
import { BackgroundElement } from './arena-canvas/elements/background.element';
import { BotElement } from './arena-canvas/elements/bot.element';
import { BotService } from './bot.service';

const config: SocketIoConfig = { url: 'http://localhost:3333', options: {} };


@NgModule({
  declarations: [AppComponent, ArenaCanvasComponent],
  imports: [
    BrowserModule,
    SocketIoModule.forRoot(config),
    UiModule,
    CanvasDomModule.forRoot(
      [
        BotElement,
        BackgroundElement
      ])],
  providers: [BotService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
