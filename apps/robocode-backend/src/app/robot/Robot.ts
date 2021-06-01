// https://robocode.sourceforge.io/docs/robocode/robocode/Robot.html
import { Logger } from '@nestjs/common';
import { Vector, AbstractVector } from '@robo-code/utils';

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

  turnLeft(degrees: number): void;

  turnRight(degrees: number): void;

  tick(): void;
}

interface IRobotNotifications {
  onCrash?(event: any): void;

  onHit?(event: any): void;

  onDeath?(event: any): void;

  onWin?(event: any): void;
}

export abstract class Bot implements IRobotActions {

  private health = 100;

  getHealth(): number {
    return this.health;
  }

  private position = new Vector(100,150);

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  private velocity = new Vector();
  private acceleration = new Vector();
  private orientation = -90;
  private readonly maxspeed = 10;
  private readonly maxforce = 1;

  private applyForce(force: AbstractVector) {
    Logger.debug('applyForce: ' + force.toString());
    this.acceleration.add(force);
    this.update();
  }

  private update() {
    //health decay
    this.health -= 0.005;

    // update speed and limit
    this.velocity.add(this.acceleration).limit(this.maxspeed);
    // update position
    this.position.add(this.velocity);
    // reset acceleration
    this.acceleration.zero();

    // TODO: detect collisions and solve constraints
  }

  tick(): void {

  }

  forward(amount: number): void {
    this.velocity.zero();

    const position = this.position.clone();
    const desired = new Vector(0, amount);
    desired.setMagnitude(this.maxspeed);
    desired.rotate(this.orientation);

    const steer = desired.subtract(this.velocity);
    steer.limit(this.maxforce);

    this.applyForce(steer);
  }

  backward(amount: number): void {
    this.velocity.zero();

    const position = this.position.clone();
    const desired = new Vector(0, amount);
    desired.setMagnitude(this.maxspeed);
    desired.rotate(this.orientation);

    const steer = desired.subtract(this.velocity);
    steer.limit(this.maxforce).reverse();

    this.applyForce(steer);
  }

  turnLeft(degree: number): void {
    throw new Error('Not Implemented');
  }

  turnRight(degree: number): void {
    throw new Error('Not Implemented');
  }

  /**
   * Return the bot as a formatted string
   */
  toString() {
    return `Robot(pos[${ this.position }], speed[${ this.velocity }])`;
  }
}
