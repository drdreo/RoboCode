// https://robocode.sourceforge.io/docs/robocode/robocode/Robot.html

// https://natureofcode.com/book/chapter-2-forces/

import { Logger } from '@nestjs/common';
import { BotData } from "@robo-code/shared";
import { AbstractVector, randomInteger, Vector } from '@robo-code/utils';

/**
 The basic robot class that you will extend to create your own robots.
 Please note the following standards will be used:
 heading - absolute angle in degrees with 0 facing up the screen, positive clockwise. 0 <= heading < 360.
 bearing - relative angle to some object from your robot's heading, positive clockwise. -180 < bearing <= 180
 All coordinates are expressed as (x,y).
 All coordinates are positive.
 The origin (0,0) is at the bottom left of the screen.
 Positive x is right.
 Positive y is up.
 */
interface IRobotActions {
    forward(amount: number): void;

    backward(amount: number): void;

    turn(degrees: number): void;

    shoot(): void;

    tick(): void;
}

interface IRobotNotifications {
    onCrash?(event: any): void;

    onHit?(event: any): void;

    onDeath?(event: any): void;

    onWin?(event: any): void;
}

interface IRobotStats {
    name?: string;
}

export class Robot implements IRobotStats, IRobotActions {
    public name;

    private health = 100;

    getHealth(): number {
        return this.health;
    }

    private position = new Vector(randomInteger(200, 500), randomInteger(200, 500));

    get x() {
        return this.position.x;
    }

    get y() {
        return this.position.y;
    }

    private velocity = new Vector(1, 0);
    private readonly maxspeed = 4;

    constructor(public actualBot: any) {
    }

    private acceleration = new Vector();

    private _rotation = this.velocity.heading();
    private readonly maxforce = 2;

    get rotation(): number {
        return this._rotation;
    }

    get heading(): number {
        return this._rotation;
    }

    private applyForce(force: AbstractVector) {
        Logger.debug('applyForce: ' + force.toString());
        this.acceleration.add(force);
        this.update();
    }

    public getData(): BotData {
        return {
            name: this.actualBot.name || 'Robot', // TODO: this should be done once
            health: this.health,
            position: this.position.toObject(),
            rotation: this.rotation,
        };
    }

    private update() {
        //health decay
        this.health -= 0.005;

        // update speed and limit
        this.velocity.add(this.acceleration).limit(this.maxspeed);
        // update position
        this.position.add(this.velocity);
        this.position.round(1);
        // reset acceleration
        this.acceleration.zero();

        // TODO: detect collisions and solve constraints
    }

    tick(): void {
        console.log(this.toString());
        this.actualBot.tick();
    }

    forward(amount: number): void {
        // console.log('forward - ' + amount + this.toString());

        const forwardVec = new Vector(0, -1).rotate(this.rotation);
        // scale to maxspeed
        forwardVec.setMagnitude(amount).limit(this.maxspeed);
        // desired.rotate(this.velocity.heading());

        // Steering = Desired minus Velocity
        const steer = forwardVec.subtract(this.velocity);
        steer.limit(this.maxforce);

        this.applyForce(steer);
    }

    backward(amount: number): void {
        // console.log('backward - ' + amount + this.toString());
        this.forward(-amount);
    }

    turn(deg: number): void {
        let degree = Math.min(deg, 10);
        degree = Math.max(degree, -10);

        this._rotation += degree;
        if (this.heading > 360) {
            this._rotation -= 360;
        } else if (this.heading < 0) {
            this._rotation += 360;
        }
    }

    smoothTurn(deg: number) {
        const degree = Math.min(deg, 10);

        const desired = this.velocity.clone().rotate(degree);
        const dot = this.velocity.dot(desired);
        // Calculate the angle between the current velocity and the desired velocity
        let angle = Math.acos(dot / (this.velocity.magnitude() * desired.magnitude()));
        // Determine the direction of the rotation
        const cross = this.velocity.cross(desired);
        if (cross < 0) {
            angle = -angle;
        }
        // Apply the rotation to the robot
        this.turn(angle * (180 / Math.PI));
    }

    /*
     * Fire a bullet from the robot
     * @deprecated, should not be needed any longer due to simulation service
     */
    shoot(): void {
        console.log('pew pew pew');
    }

    /**
     * Return the bot as a formatted string
     */
    toString() {
        return `${ this.constructor.name }[pos${ this.position }, speed${ this.velocity }, rot(${ this.rotation })]`;
    }
}
