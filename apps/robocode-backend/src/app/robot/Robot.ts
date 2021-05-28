// https://robocode.sourceforge.io/docs/robocode/robocode/Robot.html
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
  forward(): void;

  backward(): void;

  turnLeft(degrees: number): void;

  turnRight(degrees: number): void;
}

interface IRobotNotifications {
  onCrash(event: any): void;

  onHit(event: any): void;

  onDeath(event: any): void;

  onWin(event: any): void;
}

export class Bot implements Partial<IRobotActions>, Partial<IRobotNotifications> {
  health = 100;
}
