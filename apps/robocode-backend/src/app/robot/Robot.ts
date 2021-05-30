// https://robocode.sourceforge.io/docs/robocode/robocode/Robot.html
import { Vector } from '@robo-code/utils';
import { AbstractVector } from '../../../../../libs/utils/src/lib/math/AbstractVector';

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

  private velocity = new Vector(0, -2);
  private acceleration = new Vector();
  private readonly maxspeed = 10;
  private readonly maxforce = 0.33;

  private applyForce(force: AbstractVector) {
    this.acceleration.add(force);
    this.update();
  }

  private update() {
    //health decay
    this.health -= 0.005;

    // update speed
    this.velocity.add(this.acceleration);
    // limit speed
    this.velocity.limit(this.maxspeed);
    // reset acceleration
    this.acceleration.zero();

    this.position.add(this.velocity);
  }

  tick(): void {

  }

  forward(amount: number): void {
    const position = this.position.clone()
    const desired = position.add(new Vector(amount, 0));
    desired.setMagnitude(this.maxspeed);

    // const steer = desired.subtract(this.velocity);
    // steer.limit(this.maxforce);

    this.applyForce(desired);
  }

  backward(amount: number): void {
    const position = this.position.clone()
    const desired = position.add(new Vector(-amount,  0));
    desired.setMagnitude(this.maxspeed);

    const steer = desired.subtract(this.velocity);
    steer.limit(this.maxforce);

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
