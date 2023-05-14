import { AbstractVector } from "./AbstractVector"

/**
 * A vector representation that stores the axes as part of the instance itself
 *
 * ```ts
 * const v = new Vec2D.Vector(2, 5)
 * ```
 */
export class Vector extends AbstractVector {
    constructor(x = 0, y = 0) {
        super(Vector)
        this._x = x
        this._y = y
    }

    protected _x: number

    get x(): number {
        return this._x
    }

    set x(x: number) {
        this._x = x
    }

    protected _y: number

    get y(): number {
        return this._y
    }

    set y(y: number) {
        this._y = y
    }

    clone(): Vector {
        return new Vector(this.x, this.y);
    }
}
