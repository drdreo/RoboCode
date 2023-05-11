import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class BotService {
    bots$: Observable<any>;

    constructor(private socket: Socket) {
        this.bots$ = this.botsUpdate$();

        // <rc-bot [x]='bot.position._x' [y]='bot.position._y' [rotation]='bot.orientation'
        // *ngFor='let bot of botService.bots$ | async'></rc-bot>
    }

    botsUpdate$() {
        return this.socket.fromEvent<any>('bots:update');
    }
}
