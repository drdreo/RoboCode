import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class BotService {

  bots$: Observable<any>;

  constructor(private socket: Socket) {
    this.bots$ = this.botsUpdate$().pipe(tap(console.log));
  }


  botsUpdate$() {
    return this.socket.fromEvent<any>('bots:update');
  }
}
