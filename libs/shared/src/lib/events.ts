import { Position } from "./math";

export enum SocketEvents {
    BotsUpdate = "bots:update",
    BulletsUpdate = "bullets:update",

    ManualInput = "manual:input",
}

export type BotsUpdate = BotData[];

export type BotData = {
    id: string;
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

export type ManualInputCommand = "forwards" | "backwards" | "left" | "right" | "shoot";

export type ManualInputData = {
    commands: ManualInputCommand[];
};
