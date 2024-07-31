import { PhysicsEntity } from "./physics-engine";
export enum CollisionType {
    // KINEMATIC entities are not affected by gravity, and will not allow the solver to solve these elements. Basically static entities.
    KINEMATIC,
    // DYNAMIC entities will be completely changing and are ffected by all aspects of the physics system
    DYNAMIC,
    // DISPLACE resolution will only move an entity outside of the space of the other and zero the velocity in that direction
    DISPLACE,
    // The elastic resolution will displace and also bounce the colliding entity off by reducing the velocity by its restituion coefficient
    ELASTIC,
}

export class CollisionDetector {
    collideRect(collider: PhysicsEntity, collidee: PhysicsEntity) {
        // Store the collider and collidee edges
        const l1 = collider.left;
        const t1 = collider.top;
        const r1 = collider.right;
        const b1 = collider.bottom;

        const l2 = collidee.left;
        const t2 = collidee.top;
        const r2 = collidee.right;
        const b2 = collidee.bottom;

        // If any of the edges are beyond any of the others,
        // then we know that the box cannot be colliding
        if (t1 < b2 || b1 > t2 || r1 < l2 || l1 > r2) {
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
