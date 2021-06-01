import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class BotService {

  bots$: Observable<any>;

  constructor(private socket: Socket) {
    this.bots$ = this.botsUpdate$();
  }

  botsUpdate$() {
    return this.socket.fromEvent<any>('bots:update');
  }
}
