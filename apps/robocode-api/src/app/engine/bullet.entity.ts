import { BULLET_OFFSET_X, BULLET_OFFSET_Y, BULLET_ROTATION, BULLET_SIZE, BULLET_SPEED } from "@robo-code/shared";
import { toRadian, Vector } from "@robo-code/utils";
import { PhysicsEntity } from "./physics-engine";
import { CollisionType } from "./collision-detector";

export class Bullet extends PhysicsEntity {
    isActive = false;
    owner = "";

    width = BULLET_SIZE;
    height = BULLET_SIZE;

    MAX_SPEED = BULLET_SPEED;
    MAX_ROTATION = BULLET_ROTATION;

    type = CollisionType.KINEMATIC;
    collision = CollisionType.DISPLACE;
    restitution = 0.2;

    init(x: number, y: number, heading: number, owner: string): void {
        this.owner = owner; // who shot the bullet

        const headingInRadians = toRadian(heading);

        const offset = new Vector(BULLET_OFFSET_X, BULLET_OFFSET_Y);
        offset.rotate(-heading);
        this.position.setAxes(x, y).add(offset);

        const speedX = this.MAX_SPEED * Math.cos(headingInRadians);
        const speedY = this.MAX_SPEED * Math.sin(headingInRadians);
        this.velocity.setAxes(speedX, speedY);
    }

    reset() {
        this.isActive = false;
        this.position.setAxes(0, 0);
        this.velocity.setAxes(0, 0);
    }
}
