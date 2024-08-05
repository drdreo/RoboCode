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
    SPEED_DECAY = 1; // no bullet decay
    MAX_ROTATION = BULLET_ROTATION;

    type = CollisionType.KINEMATIC;
    collision = CollisionType.DISPLACE;
    restitution = 0.2;

    // TODO: I dont trust this rotation initialization
    init(position: Vector, heading: number, owner: string): void {
        this.owner = owner; // who shot the bullet
        const headingInRadians = toRadian(-heading + 90);

        // Calculate offset based on the tank's heading
        const offsetX = BULLET_OFFSET_X * Math.cos(headingInRadians);
        const offsetY = BULLET_OFFSET_Y * Math.sin(headingInRadians);
        this.position.setAxes(position.x + offsetX, position.y + offsetY);

        const speedX = this.MAX_SPEED * Math.cos(headingInRadians);
        const speedY = this.MAX_SPEED * Math.sin(headingInRadians);
        this.velocity.setAxes(speedX, speedY);
    }

    reset() {
        this.isActive = false;
        this.position.zero();
        this.velocity.zero();
    }
}
