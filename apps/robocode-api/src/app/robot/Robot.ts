// https://robocode.sourceforge.io/docs/robocode/robocode/Robot.html

// https://natureofcode.com/book/chapter-2-forces/

import { Logger } from '@nestjs/common';
import { Vector, AbstractVector, randomInteger } from '@robo-code/utils';

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

    private position = new Vector(randomInteger(0, 400), randomInteger(0, 400));

    get x() {
        return this.position.x;
    }

    get y() {
        return this.position.y;
    }

    private velocity = new Vector(0, -1);
    private orientation = this.velocity.heading();
    private acceleration = new Vector();
    private readonly maxspeed = 10;
    private readonly maxforce = 2;

    constructor(public actualBot: any) {}

    private applyForce(force: AbstractVector) {
        Logger.debug('applyForce: ' + force.toString());
        this.acceleration.add(force);
        this.update();
    }

    public getData(): any {
        return {
            health: this.health,
            position: this.position,
            orientation: this.orientation,
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
        this.actualBot.tick();
    }

    forward(amount: number): void {
        console.log('forward - ' + amount + this.toString());

        const desired = new Vector(1, 0);
        // scale to maxspeed
        desired.setMagnitude(amount).limit(this.maxspeed);
        // desired.rotate(this.velocity.heading());

        // Steering = Desired minus Velocity
        const steer = desired.subtract(this.velocity);
        steer.limit(this.maxforce);

        this.applyForce(steer);
    }

    backward(amount: number): void {
        console.log('backward - ' + amount + this.toString());

        const desired = new Vector(-1, 0);
        desired.setMagnitude(amount).limit(this.maxspeed);
        // desired.rotate(this.orientation);

        // Steering = Desired minus Velocity
        const steer = desired.subtract(this.velocity);
        steer.limit(this.maxforce);

        this.applyForce(steer);
    }

    turn(degree: number): void {
        this.orientation += degree;
    }

    shoot(): void {
        console.log('pew pew pew');
    }

    /**
     * Return the bot as a formatted string
     */
    toString() {
        return `${this.constructor.name}(pos[${this.position}], speed[${this.velocity}])`;
    }
}
