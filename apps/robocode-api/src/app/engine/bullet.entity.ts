import { BULLET_SIZE, BULLET_SPEED } from "@robo-code/shared";
import { PhysicsEntity } from "./physics-engine";

export class Bullet extends PhysicsEntity {

    isActive = false;

    width = BULLET_SIZE;
    height = BULLET_SIZE;

    MAX_SPEED = BULLET_SPEED;

    init(x: number, y: number, heading: number): void {
        this.position.setAxes(x, y);
        // Convert the heading of the robot to a vector for the velocity of the bullet
        // const velocityX = BULLET_SPEED * Math.cos(heading * (Math.PI / 180));
        // const velocityY = BULLET_SPEED * Math.sin(heading * (Math.PI / 180));

        this.velocity.setAxes(0, -1).rotate(heading).mult(BULLET_SPEED);
    }
}