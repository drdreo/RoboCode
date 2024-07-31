import { PhysicsEntity } from "./physics-engine";
import { Vector } from "@robo-code/utils";

const STICKY_THRESHOLD = 0.0004;

export class CollisionResolver {
    // TODO maybe move to a collision solver
    resolveElastic(player: PhysicsEntity, entity: PhysicsEntity) {
        // Find the mid points of the entity and player
        const pMidX = player.getMidX();
        const pMidY = player.getMidY();
        const aMidX = entity.getMidX();
        const aMidY = entity.getMidY();

        // To find the side of entry calculate based on the normalized sides
        const dx = (aMidX - pMidX) / entity.halfWidth;
        const dy = (aMidY - pMidY) / entity.halfHeight;

        // Calculate the absolute change in x and y
        const absDX = Math.abs(dx);
        const absDY = Math.abs(dy);

        // If the distance between the normalized x and y
        // position is less than a small threshold (.1 in this case)
        // then this object is approaching from a corner
        if (Math.abs(absDX - absDY) < 0.1) {
            // If the player is approaching from positive X
            if (dx < 0) {
                // Set the player x to the right side
                player.position.x = entity.right;

                // If the player is approaching from negative X
            } else {
                // Set the player x to the left side
                player.position.x = entity.left - player.width;
            }

            // If the player is approaching from positive Y
            if (dy < 0) {
                // Set the player y to the bottom
                player.position.y = entity.bottom;

                // If the player is approaching from negative Y
            } else {
                // Set the player y to the top
                player.position.y = entity.top - player.height;
            }

            // Randomly select a x/y direction to reflect velocity on
            if (Math.random() < 0.5) {
                // Reflect the velocity at a reduced rate
                player.velocity.x = -player.velocity.x * entity.restitution;

                // If the object's velocity is nearing 0, set it to 0
                // STICKY_THRESHOLD is set to .0004
                if (Math.abs(player.velocity.x) < STICKY_THRESHOLD) {
                    player.velocity.x = 0;
                }
            } else {
                player.velocity.y = -player.velocity.y * entity.restitution;
                if (Math.abs(player.velocity.y) < STICKY_THRESHOLD) {
                    player.velocity.y = 0;
                }
            }

            // If the object is approaching from the sides
        } else if (absDX > absDY) {
            // If the player is approaching from positive X
            if (dx < 0) {
                player.position.x = entity.right;
            } else {
                // If the player is approaching from negative X
                player.position.x = entity.left - player.width;
            }

            // Velocity component
            player.velocity.x = -player.velocity.x * entity.restitution;

            if (Math.abs(player.velocity.x) < STICKY_THRESHOLD) {
                player.velocity.x = 0;
            }

            // If this collision is coming from the top or bottom more
        } else {
            // If the player is approaching from positive Y
            if (dy < 0) {
                player.position.y = entity.bottom;
            } else {
                // If the player is approaching from negative Y
                player.position.y = entity.top - player.height;
            }

            // Velocity component
            player.velocity.y = -player.velocity.y * entity.restitution;
            if (Math.abs(player.velocity.y) < STICKY_THRESHOLD) {
                player.velocity.y = 0;
            }
        }
    }

    resolveGPT(player: PhysicsEntity, entity: PhysicsEntity) {
        // Find the mid points of the entity and player
        const pMidX = player.getMidX();
        const pMidY = player.getMidY();
        const aMidX = entity.getMidX();
        const aMidY = entity.getMidY();

        // Collision normal
        const normal = new Vector(pMidX - aMidX, pMidY - aMidY).normalise();

        // Relative velocity
        const relativeVelocity = player.velocity.clone().sub(entity.velocity);

        // Velocity along the normal
        const velocityAlongNormal = relativeVelocity.dot(normal);

        // If velocities are separating, no need to resolve
        if (velocityAlongNormal > 0) return;

        // Calculate impulse scalar
        const impulseScalar = -(1 + player.restitution) * velocityAlongNormal;

        // Apply impulse to both entities
        const impulse = normal.mult(impulseScalar);

        player.velocity.add(impulse);
        entity.velocity.sub(impulse);

        // Correct positions to avoid sinking
        const penetrationDepth = player.width / 2 + entity.width / 2 - normal.magnitude();
        const correction = normal.mult(penetrationDepth / 2);
        player.position.add(correction);
        entity.position.sub(correction);
    }
}
