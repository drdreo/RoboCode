import { BULLET_OFFSET, BULLET_SIZE, BULLET_SPEED } from "@robo-code/shared";
import { Vector } from "@robo-code/utils";
import { PhysicsEntity } from "./physics-engine";

export class Bullet extends PhysicsEntity {

    isActive = false;

    width = BULLET_SIZE;
    height = BULLET_SIZE;

    MAX_SPEED = BULLET_SPEED;

    init(x: number, y: number, heading: number, velocity: Vector): void {
        // calculate offset based on the object's heading (rotation)
        const offset = new Vector(0, -BULLET_OFFSET);
        offset.rotate(heading);
        this.position.setAxes(x + offset.x, y + offset.y);
        const headingInRadians = heading * (Math.PI / 180) - Math.PI / 2; // Rotate 90 degrees anticlockwise

        const speedX  = this.MAX_SPEED * Math.cos(headingInRadians);
        const speedY  = this.MAX_SPEED * Math.sin(headingInRadians);

        this.velocity.setAxes(speedX, speedY);
    }
}
