import { AbstractVector } from "@robo-code/utils";

export interface IRobotActions {
    forward(amount: number): void;

    backward(amount: number): void;

    turn(degrees: number): void;

    // shoot(): void;

    tick(dt?: number): void;
}

export interface IRobotHitEvent {
    health: number;
}

export interface IRobotScanEven {
    position: AbstractVector;
}

export interface IRobotNotifications {
    onCrash?(event: any): void;

    onHit?(event: IRobotHitEvent): void;

    onDeath?(event: any): void;

    onWin?(event: any): void;

    onScan?(event: IRobotScanEven): void;
}

export interface IRobotStats {
    name?: string;
}
