// https://robocode.sourceforge.io/docs/robocode/robocode/Robot.html

// https://natureofcode.com/book/chapter-2-forces/

import { Logger } from "@nestjs/common";
import {
    BotData,
    BULLET_DAMAGE,
    ROBOT_ENERGY_GAIN,
    ROBOT_HEALTH_DECAY,
    ROBOT_HITBOX_HEIGHT,
    ROBOT_HITBOX_WIDTH,
    ROBOT_MAX_TURNING_SPEED,
    ROBOT_MAX_SPEED,
    ROBOT_SHOOTING_ENERGY_COST,
} from "@robo-code/shared";
import { AbstractVector, randomInteger, Vector } from "@robo-code/utils";
import { environment } from "../../environments/environment";
import { PhysicsEntity } from "../engine/physics-engine";
import { IRobotActions, IRobotStats } from "./robot.types";

const ROBOT_ROTATION_DECAY = 0.9; // in percentage.. 0.9=10%
/**
 The basic robot class that you will extend to create your own robots.
 Please note the following standards will be used:
 heading - absolute angle in degrees with 0 facing up the screen, positive clockwise. 0 <= heading < 360.
 // bearing - relative angle to some object from your robot's heading, positive clockwise. -180 < bearing <= 180
 All coordinates are expressed as (x,y).
 All coordinates are positive.
 The origin (0,0) is at the bottom left of the screen.
 Positive x is right.
 Positive y is up.
 */

export class Robot extends PhysicsEntity implements IRobotStats, IRobotActions {
    get name(): string {
        return this.actualBot.name;
    }

    width = ROBOT_HITBOX_WIDTH;
    height = ROBOT_HITBOX_HEIGHT;

    MAX_SPEED = ROBOT_MAX_SPEED;
    MAX_ROTATION = ROBOT_MAX_TURNING_SPEED;

    private health = 100;
    private energy = 100;
    private _rotation = 0;
    private dt: number;

    getHealth(): number {
        return this.health;
    }

    getEnergy(): number {
        return this.energy;
    }

    constructor(
        id: string,
        public actualBot: any,
        position?: Vector,
    ) {
        super(id);
        this.position = position || new Vector(randomInteger(100, 900), randomInteger(100, 900));
    }

    public getData(): BotData {
        return {
            name: this.actualBot.name || "Robot", // TODO: this data should be sent once
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

    isDead(): boolean {
        return this.health <= 0;
    }

    bulletHit(): void {
        this.health -= BULLET_DAMAGE;
    }

    decayHealth(): void {
        if (!environment.config.decayHealth) {
            return;
        }

        this.health -= ROBOT_HEALTH_DECAY;
    }

    tick(dt: number): void {
        this.dt = dt;
        // console.log(this.toString());
        // this.acceleration.zero();

        // trying to do it in the sim instead
        // this.decayHealth();
        // this.gainEnergy();
        // this.applyRotationDecay();
        this.actualBot.tick();
    }

    forward(amount: number): void {
        // TODO: validate input
        const forwardForce = amount;

        // forwardForce = Math.max(forwardForce, 0);
        // console.log('forward - ' + amount + this.toString());

        // Calculate the angle in radians based on the current rotation
        const angleInRadians = (-this.rotation + 90) * (Math.PI / 180);
        // Calculate the forward vector based on the angle
        const forwardVec = new Vector(Math.cos(angleInRadians), Math.sin(angleInRadians)).setMagnitude(forwardForce);

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
        const force = amount;

        // console.log('backward - ' + amount + this.toString());
        this.forward(-force);
    }

    turn(angle: number): void {
        const degree = Math.max(-ROBOT_MAX_TURNING_SPEED, Math.min(angle, ROBOT_MAX_TURNING_SPEED));

        this._rotation = (this._rotation + degree * this.dt) % 360;
        if (this._rotation < 0) {
            this._rotation += 360;
        }
    }

    /**
     * Return the bot as a formatted string
     */
    toString() {
        return `${this.name}[pos${this.position}, speed${this.velocity}, rot(${Math.round(this.rotation)})]`;
    }

    gainEnergy() {
        if (!environment.config.gainEnergy) {
            return;
        }

        if (this.energy < 100) {
            this.energy = Math.min(ROBOT_ENERGY_GAIN + this.energy, 100);
        }
    }

    consumeShootingEnergy() {
        if (!environment.config.shootingCostsEnergy) {
            return;
        }
        this.energy -= ROBOT_SHOOTING_ENERGY_COST;
    }

    private applyForce(force: AbstractVector) {
        this.acceleration.add(force);
        this.updateCosts();
    }

    private updateCosts() {
        this.consumeMovementEnergy();
    }

    private applyRotationDecay(): void {
        this._rotation *= ROBOT_ROTATION_DECAY;
        if (Math.abs(this._rotation) < 0.01) {
            this._rotation = 0;
        }
    }

    private consumeMovementEnergy() {
        this.energy -= this.velocity.magnitude() * 0.01;
    }
}
