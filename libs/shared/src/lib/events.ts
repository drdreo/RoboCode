import { Position } from "./math";

export enum SocketEvents {
    BotsUpdate = "bots:update",
    BulletsUpdate = "bullets:update",
}

export type BotsUpdate = BotData[];

export type BotData = {
    name: string;
    health: number;
    energy: number;
    position: Position;
    rotation: number;
    velocity: Position;
};

export type BulletsUpdate = BulletData[];

export type BulletData = {
    position: Position;
};
