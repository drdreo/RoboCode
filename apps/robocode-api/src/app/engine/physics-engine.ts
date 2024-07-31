import { Logger } from "@nestjs/common";
import { ROBOT_MAX_TURNING_SPEED, TICKS_PER_SECOND } from "@robo-code/shared";
import { Vector } from "@robo-code/utils";

//https://developer.ibm.com/tutorials/wa-build2dphysicsengine/

// Coordinate System Explanation - https://robowiki.net/w/images/3/36/RobocodeCoordinates.gif
// The coordinate system used in Robocode is a little different from the one you may be used to.
// The origin (0,0) is at the bottom left corner of the battlefield.
// The positive x-axis points right, and the positive y-axis points up.
// Angles are measured clockwise from the positive x-axis.

export class PhysicsEntity {
    // Position (x, y) - the current position of the entity.
    // Velocity (vx, vy) - the current velocity of the entity.
    // Acceleration (ax, ay) - the acceleration vector provided by the external control.

    position = new Vector();
    velocity = new Vector();
    acceleration = new Vector();

    width: number;
    height: number;
    MAX_SPEED: number;
    MAX_ROTATION: number;

    constructor(public id: string) {}

    get x() {
        return this.position.x;
    }

    get y() {
        return this.position.y;
    }

    get top() {
        return this.y;
    }

    get left() {
        return this.x;
    }

    get right() {
        return this.x + this.width;
    }

    get bottom() {
        return this.y + this.height;
    }
}

// TODO: Create tests and test step accuracy
export class Engine {
    private entities: PhysicsEntity[] = [];

    private logger = new Logger("Engine");

    /**
     * Convert them from units per frame to units per second.
     * This way, I can have a better sense of how the values correspond to real-world units.
     * This accounts for the relationship between the time step (dt) and the frame rate
     *
     * frameToSecondFactor = 1 / dt / frameRate
     */
    private frameToSecondFactor = 0;

    step(dt = 1) {
        this.frameToSecondFactor = TICKS_PER_SECOND / dt;
        // this.frameToSecondFactor = 1;

        // console.log(this.frameToSecondFactor);
        for (const entity of this.entities) {
            // adjust vectors to be in units / frame rather than units / s
            entity.velocity.add(entity.acceleration.mult(this.frameToSecondFactor)).limit(entity.MAX_SPEED);

            // update position
            entity.position.add(entity.velocity.clone().mult(this.frameToSecondFactor));
            // reset steering force
            // entity.acceleration.zero();

            this.logger.debug(`${entity.id}: ` + entity.position);
        }

        // let collisions = this.collider.detectCollisions(
        //     this.player,
        //     this.collidables
        // );
        //
        // if (collisions != null) {
        //     this.solver.resolve(this.player, collisions);
        // }
    }

    addEntity(entity: PhysicsEntity) {
        this.logger.debug(`Adding entity ${entity.id}`);
        this.entities.push(entity);
    }

    removeEntity(entity: PhysicsEntity) {
        this.logger.debug(`Removing entity ${entity.id}`);

        const idx = this.entities.indexOf(entity);
        if (idx >= 0) {
            this.entities.splice(idx, 1);
        }
    }
}
