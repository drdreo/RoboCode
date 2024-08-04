import { Injectable } from "@angular/core";
import { BotsUpdate, BulletsUpdate, SocketEvents } from "@robo-code/shared";
import { Socket } from "ngx-socket-io";
import { Observable, of } from "rxjs";
import { DEBUG } from "./settings";

const debugBots: BotsUpdate = [
    {
        id: "1",
        name: "UpAndDown",
        health: 100,
        energy: 99.959,
        position: { x: 500, y: 500 },
        rotation: 0,
        velocity: { x: 0, y: 10 },
    },
    {
        id: "2",
        name: "SittingDuck",
        health: 100,
        energy: 100,
        position: { x: 300, y: 300 },
        rotation: 45,
        velocity: { x: 0, y: 0 },
    },
    {
        id: "3",
        name: "Spinner",
        health: 100,
        energy: 99.922,
        position: { x: 999, y: 525 },
        rotation: 189,
        velocity: { x: 1.47, y: -8.45 },
    },
];

@Injectable({ providedIn: "root" })
export class BotService {
    bots$: Observable<BotsUpdate>;
    bullets$: Observable<BulletsUpdate>;

    constructor(private socket: Socket) {
        if (DEBUG.fakeBots) {
            this.bots$ = of(debugBots);
            this.bullets$ = of([]);
            return;
        }

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
