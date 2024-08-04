import { PhysicsEntity } from "./physics-engine";
import { AbstractVector, toRadian, Vector } from "@robo-code/utils";

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

    // https://dyn4j.org/2010/01/sat/
    collideSAT(collider: PhysicsEntity, collidee: PhysicsEntity): boolean {
        return overlaps(collider, collidee);
    }

    detectCollisions(collider: PhysicsEntity, collidees: PhysicsEntity[]): PhysicsEntity[] {
        const collisions: PhysicsEntity[] = [];
        for (let i = 0; i < collidees.length; i++) {
            if (this.collideSAT(collider, collidees[i])) {
                collisions.push(collidees[i]);
            }
        }
        return collisions;
    }
}

function getVerticesOfEntity(entity: PhysicsEntity): AbstractVector[] {
    const hw = entity.width / 2;
    const hh = entity.height / 2;

    const rot = toRadian(-entity.rotation);
    const cos = Math.cos(rot);
    const sin = Math.sin(rot);

    const vertices = [
        new Vector(entity.position.x + cos * -hw - sin * -hh, entity.position.y + sin * -hw + cos * -hh),
        new Vector(entity.position.x + cos * hw - sin * -hh, entity.position.y + sin * hw + cos * -hh),
        new Vector(entity.position.x + cos * hw - sin * hh, entity.position.y + sin * hw + cos * hh),
        new Vector(entity.position.x + cos * -hw - sin * hh, entity.position.y + sin * -hw + cos * hh),
    ];

    // if (entity.rotation !== 0) {
    //     console.log(
    //         "Vertices:",
    //         vertices.map((v) => v.toString()),
    //     );
    // }
    return vertices;
}

function getAxesOfEntity(entity: PhysicsEntity): AbstractVector[] {
    const vertices = getVerticesOfEntity(entity);
    const axes: AbstractVector[] = [];
    for (let i = 0; i < vertices.length; i++) {
        const p1 = vertices[i];
        const p2 = vertices[(i + 1) % vertices.length];
        const edge = p1.subtract(p2);
        axes.push(edge.perpendicular().normalise());
    }
    return axes;
}

function project(axis: AbstractVector, vertices: AbstractVector[]): [number, number] {
    let min = axis.dot(vertices[0]);
    let max = min;

    for (let i = 1; i < vertices.length; i++) {
        const projection = axis.dot(vertices[i]);
        if (projection < min) {
            min = projection;
        } else if (projection > max) {
            max = projection;
        }
    }
    return [min, max];
}

function overlaps(collider: PhysicsEntity, collidee: PhysicsEntity): boolean {
    const axes = getAxesOfEntity(collider).concat(getAxesOfEntity(collidee));

    for (let i = 0; i < axes.length; i++) {
        const axis = axes[i];
        const [min1, max1] = project(axis, getVerticesOfEntity(collider));
        const [min2, max2] = project(axis, getVerticesOfEntity(collidee));

        if (max1 < min2 || max2 < min1) {
            return false;
        }
    }

    return true;
}
