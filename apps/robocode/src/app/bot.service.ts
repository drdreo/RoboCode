import { Injectable } from "@angular/core";
import { BotsUpdate, BulletsUpdate, SocketEvents } from "@robo-code/shared";
import { Socket } from "ngx-socket-io";
import { distinctUntilChanged, Observable, of } from "rxjs";
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

        this.bots$ = this.onBotsUpdate().pipe(distinctUntilChanged(botUpdateChanged));
        this.bullets$ = this.onBulletsUpdate().pipe(distinctUntilChanged(bulletUpdateChanged));
    }

    private onBotsUpdate() {
        return this.socket.fromEvent<BotsUpdate>(SocketEvents.BotsUpdate);
    }

    private onBulletsUpdate() {
        return this.socket.fromEvent<BulletsUpdate>(SocketEvents.BulletsUpdate);
    }
}

function botUpdateChanged(prev: BotsUpdate, curr: BotsUpdate): boolean {
    if (prev.length !== curr.length) {
        return false;
    }

    for (let i = 0; i < prev.length; i++) {
        const prevBot = prev[i];
        const currBot = curr[i];

        if (prevBot.id !== currBot.id) {
            return false;
        }

        if (prevBot.health !== currBot.health) {
            return false;
        }

        if (prevBot.energy !== currBot.energy) {
            return false;
        }

        if (prevBot.position.x !== currBot.position.x || prevBot.position.y !== currBot.position.y) {
            return false;
        }

        if (prevBot.rotation !== currBot.rotation) {
            return false;
        }

        if (prevBot.velocity.x !== currBot.velocity.x || prevBot.velocity.y !== currBot.velocity.y) {
            return false;
        }
    }

    return true;
}

function bulletUpdateChanged(prev: BulletsUpdate, curr: BulletsUpdate): boolean {
    if (prev.length !== curr.length) {
        return false;
    }

    for (let i = 0; i < prev.length; i++) {
        const prevBullet = prev[i];
        const currBullet = curr[i];

        if (prevBullet.position.x !== currBullet.position.x || prevBullet.position.y !== currBullet.position.y) {
            return false;
        }
    }

    return true;
}
