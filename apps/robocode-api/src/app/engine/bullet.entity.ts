import { BULLET_OFFSET_X, BULLET_OFFSET_Y, BULLET_SIZE, BULLET_SPEED } from "@robo-code/shared";
import { Vector } from "@robo-code/utils";
import { PhysicsEntity } from "./physics-engine";

export class Bullet extends PhysicsEntity {

    isActive = false;

    width = BULLET_SIZE;
    height = BULLET_SIZE;

    MAX_SPEED = BULLET_SPEED;

    init(x: number, y: number, heading: number): void {
        // calculate offset based on the object's heading (rotation)
        const newHead = -heading + 90;
        const headingInRadians = newHead * (Math.PI / 180);

        const offset = new Vector(BULLET_OFFSET_X, 10);
        offset.rotate(-heading);
        this.position.setAxes(x, y).add(offset);

        const speedX  = this.MAX_SPEED * Math.cos(headingInRadians);
        const speedY  = this.MAX_SPEED * Math.sin(headingInRadians);
        this.velocity.setAxes(speedX, speedY);
    }
}
