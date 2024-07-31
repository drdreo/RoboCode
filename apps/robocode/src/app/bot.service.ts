import { Injectable } from "@angular/core";
import { BotsUpdate, BulletsUpdate, SocketEvents } from "@robo-code/shared";
import { Socket } from "ngx-socket-io";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class BotService {
    bots$: Observable<BotsUpdate>;
    bullets$: Observable<BulletsUpdate>;

    constructor(private socket: Socket) {
        this.bots$ = this.onBotsUpdate();
        this.bullets$ = this.onBulletsUpdate();
    }

    private onBotsUpdate() {
        return this.socket.fromEvent<BotsUpdate>(SocketEvents.BotsUpdate);
    }

    private onBulletsUpdate() {
        return this.socket.fromEvent<BulletsUpdate>(SocketEvents.BulletsUpdate);
    }
}
