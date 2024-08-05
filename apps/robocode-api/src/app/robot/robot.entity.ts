// https://robocode.sourceforge.io/docs/robocode/robocode/Robot.html

// https://natureofcode.com/book/chapter-2-forces/

import {
    BotData,
    BULLET_DAMAGE,
    ROBOT_ENERGY_GAIN,
    ROBOT_HEALTH_DECAY,
    ROBOT_HITBOX_HEIGHT,
    ROBOT_HITBOX_WIDTH,
    ROBOT_MAX_SPEED,
    ROBOT_MAX_TURNING_SPEED,
    ROBOT_MOVEMENT_ENERGY_COST,
    ROBOT_SHOOTING_ENERGY_COST,
} from "@robo-code/shared";
import { AbstractVector, randomInteger, toRadian, Vector } from "@robo-code/utils";
import { environment } from "../../environments/environment";
import { PhysicsEntity } from "../engine/physics-engine";
import { IRobotActions, IRobotStats } from "./robot.types";
import { CollisionType } from "../engine/collision-detector";

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

export class RobotEntity extends PhysicsEntity implements IRobotStats, IRobotActions {
    width = ROBOT_HITBOX_WIDTH;
    height = ROBOT_HITBOX_HEIGHT;
    rotation = 0; // in degrees

    // Name of the Robot
    name: string;

    MAX_SPEED = ROBOT_MAX_SPEED;
    MAX_ROTATION = ROBOT_MAX_TURNING_SPEED;

    // this entity collision type upon colliding
    type = CollisionType.DYNAMIC;
    // collision represents the type of collision another object will receive upon colliding
    collision = CollisionType.DYNAMIC;
    // Restitution is the bounciness of the collision
    // 0: Perfectly inelastic collision (no bounce, the entities stick together).
    // 1: Perfectly elastic collision (no energy loss, entities bounce back with the same speed).
    restitution = 0.7;

    private health = 100;
    private energy = 100;
    private dt: number;

    constructor(
        id: string,
        public actualBot: any,
        position?: Vector,
    ) {
        super(id);
        this.name = actualBot.name || "RobotEntity";
        this.position = position || new Vector(randomInteger(100, 900), randomInteger(100, 900));
    }

    getHealth(): number {
        return this.health;
    }

    getEnergy(): number {
        return this.energy;
    }

    public getData(): BotData {
        return {
            id: this.id,
            name: this.name, // TODO: this data should be sent once
            health: this.health,
            energy: +this.energy.toFixed(0),
            position: this.position.toObject(),
            rotation: this.rotation,
            velocity: this.velocity.round(2).toObject(),
        };
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
        const angleInRadians = toRadian(-this.rotation + 90);
        // Calculate the forward vector based on the angle
        const forwardVec = new Vector(Math.cos(angleInRadians), Math.sin(angleInRadians))
            .setMagnitude(forwardForce)
            .limit(this.MAX_SPEED);

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

        this.rotation = (this.rotation + degree * this.dt) % 360;
        if (this.rotation < 0) {
            this.rotation += 360;
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
        this.rotation *= ROBOT_ROTATION_DECAY;
        if (Math.abs(this.rotation) < 0.01) {
            this.rotation = 0;
        }
    }

    private consumeMovementEnergy() {
        this.energy -= this.velocity.magnitude() * ROBOT_MOVEMENT_ENERGY_COST;
    }
}
