// https://robocode.sourceforge.io/docs/robocode/robocode/Robot.html

// https://natureofcode.com/book/chapter-2-forces/

import { Logger } from '@nestjs/common';
import {
    BotData,
    BULLET_DAMAGE,
    ROBOT_ENERGY_GAIN,
    ROBOT_HEALTH_DECAY,
    ROBOT_HITBOX_HEIGHT,
    ROBOT_HITBOX_WIDTH,
    ROBOT_MAX_SPEED,
    ROBOT_SHOOTING_ENERGY_COST
} from "@robo-code/shared";
import { AbstractVector, randomInteger, Vector } from '@robo-code/utils';
import { PhysicsEntity } from "../engine/physics-engine";
import { IRobotActions, IRobotStats } from "./robot.types";


/**
 The basic robot class that you will extend to create your own robots.
 Please note the following standards will be used:
 heading - absolute angle in degrees with 0 facing up the screen, positive clockwise. 0 <= heading < 360.
 // bearing - relative angle to some object from your robot's heading, positive clockwise. -180 < bearing <= 180
 All coordinates are expressed as (x,y).
 All coordinates are positive.
 The origin (0,0) is at the top left of the screen.
 Positive x is right.
 Positive y is down.
 */

    // Player controls

// const MAX_MOVEMENT_SPEED = 0.01;
const MAX_TURNING_SPEED = 0.075;

export class Robot extends PhysicsEntity implements IRobotStats, IRobotActions {
    name;

    width = ROBOT_HITBOX_WIDTH;
    height = ROBOT_HITBOX_HEIGHT;

    MAX_SPEED = ROBOT_MAX_SPEED;

    private health = 100;
    private energy = 100;
    private _rotation = 0;
    private readonly maxforce = 0.0001;
    private dt: number;

    getHealth(): number {
        return this.health;
    }

    getEnergy(): number {
        return this.energy;
    }

    constructor(id: string, public actualBot: any, position?: Vector) {
        super(id);
        this.position = position || new Vector(randomInteger(100, 900), randomInteger(100, 900));
    }

    public getData(): BotData {
        return {
            name: this.actualBot.name || 'Robot', // TODO: this data should be sent once
            health: this.health,
            energy: +this.energy.toFixed(3),
            position: this.position.toObject(),
            rotation: this.rotation,
            velocity: this.velocity.round(2).toObject(),
        };
    }

    get rotation(): number {
        return this._rotation;
    }

    get heading(): number {
        return this._rotation;
    }

    bulletHit(): void {
        this.health -= BULLET_DAMAGE;
        this.checkDeath();
    }

    decayHealth(): void {
        this.health -= ROBOT_HEALTH_DECAY;
        this.checkDeath();
    }

    tick(dt: number): void {
        this.dt = dt;
        // console.log(this.toString());
        // this.acceleration.zero();

        this.decayHealth();
        this.gainEnergy();
        this.actualBot.tick();
    }

    forward(amount: number): void {
        // TODO: validate input
        let forwardForce = amount;

        // forwardForce = Math.max(forwardForce, 0);
        // console.log('forward - ' + amount + this.toString());

        // Assuming this.rotation represents the current rotation angle of the entity
        const angleInRadians = (this.rotation - 90) * (Math.PI / 180);
        const forwardVec = new Vector(Math.cos(angleInRadians), Math.sin(angleInRadians))
            .setMagnitude(forwardForce)
        // scale to maxspeed


        // Steering = Desired minus Velocity
        // const steer = forwardVec.subtract(this.velocity);
        // forwardVec.limit(this.maxforce);

        this.applyForce(forwardVec);

        // Apply forward acceleration in the direction the player is facing
        // const angleInRadians = (this.rotation - 90) * (Math.PI / 180);
        // const accelerationX = Math.cos(angleInRadians) * forwardForce;
        // const accelerationY = Math.sin(angleInRadians) * forwardForce;
        //
        // this.acceleration.setX(accelerationX);
        // this.acceleration.setY(accelerationY);
        // this.acceleration.limit(this.maxforce);


        // this.update()
    }

    backward(amount: number): void {
        let force = amount;

        // console.log('backward - ' + amount + this.toString());
        this.forward(-force);
    }

    turn(deg: number): void {
        let degree = Math.min(deg, MAX_TURNING_SPEED);
        degree = Math.max(degree, -MAX_TURNING_SPEED);

        this._rotation += degree * this.dt;
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

    gainEnergy() {
        if (this.energy < 100) {
            this.energy = Math.min(ROBOT_ENERGY_GAIN + this.energy, 100);
        }
    }

    consumeShootingEnergy() {
        this.energy -= ROBOT_SHOOTING_ENERGY_COST;
    }

    private applyForce(force: AbstractVector) {
        Logger.debug('applyForce: ' + force.toString());
        this.acceleration.add(force);
        this.update();
    }

    private update() {
        this.consumeMovementEnergy();
    }

    private checkDeath(): void {
        if (this.health <= 0) {
            this.actualBot.onDeath();
        }
    }

    private consumeMovementEnergy() {
        this.energy -= this.velocity.magnitude() * 0.01;
    }
}
