import { PhysicsEntity } from "./physics-engine";

export type Collision = [ PhysicsEntity, PhysicsEntity ];
export class CollisionDetector {
    collideRect(collider: PhysicsEntity, collidee: PhysicsEntity) {
        // Store the collider and collidee edges
        const l1 = collider.left;
        const t1 = collider.top;
        const r1 = collider.right
        const b1 = collider.bottom;

        const l2 = collidee.left;
        const t2 = collidee.top;
        const r2 = collidee.right;
        const b2 = collidee.bottom;

        // If any of the edges are beyond any of the others,
        // then we know that the box cannot be colliding
        if (b1 < t2 || t1 > b2 || r1 < l2 || l1 > r2) {
            return false;
        }

        // If the algorithm made it here, it had to collide
        return true;
    }

    detectCollisions(collider: PhysicsEntity, collidees: PhysicsEntity[]): PhysicsEntity[] {
        const collisions: PhysicsEntity[] = [];
        for (let i = 0; i < collidees.length; i++) {
            if (this.collideRect(collider, collidees[i])) {
                collisions.push(collidees[i]);
            }
        }
        return collisions;
    }

}