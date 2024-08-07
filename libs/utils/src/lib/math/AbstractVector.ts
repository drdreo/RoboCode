import { Position } from "@robo-code/shared";
import { toDegrees, toRadian } from "./utils";
import { Vector } from "./Vector";

/**
 * These values are used by the `AbstractVector.round` method to increase
 * performance vs. using  Number.toFixed.
 */
const precision = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000, 10000000000];

export interface VectorConstructable<T> {
    new (x: number, y: number): T;
}

/**
 * The class that all other vector representations are derived from.
 *
 * Contains the core implementation for all methods that will be exposed by
 * vector instances.
 *
 * Example of creating a custom implementation:
 *
 * ```ts
 * import { AbstractVector } from "./AbstractVector"
 *
 * export class MyCustomVector extends AbstractVector {
 *  constructor (x: number, y: number) {
 *    super(CustomVectorType)
 *  }
 * }
 * ```
 */
export abstract class AbstractVector implements Position {
    constructor(protected ctor: VectorConstructable<AbstractVector>) {}

    abstract get x(): number;

    abstract set x(x: number);

    abstract get y(): number;

    abstract set y(y: number);

    /**
     * Set both x and y axis value
     * @param x   New x val
     * @param y   New y val
     */
    setAxes(x: number, y: number) {
        this.x = x;
        this.y = y;
        return this;
    }

    /**
     * Getter for x the axis value
     */
    getX() {
        return this.x;
    }

    /**
     * Setter for x axis value
     */
    setX(x: number) {
        this.x = x;

        return this;
    }

    /**
     * Getter for y axis value
     */
    getY() {
        return this.y;
    }

    /**
     * Setter for y axis.
     */
    setY(y: number) {
        this.y = y;

        return this;
    }

    /**
     * Return the vector as a formatted string, e.g "(0, 4)"
     */
    toString(round = true) {
        if (round) {
            return `(${Math.round(this.x)}, ${Math.round(this.y)})`;
        }
        return `(${this.x}, ${this.y})`;
    }

    /**
     * Return an Array containing the vector axes, e.g [0, 4]
     */
    toArray() {
        return [this.x, this.y];
    }

    /**
     * Return an Object containing the vector axes, e.g { x: 0, y: 4 }
     */
    toObject() {
        return {
            x: this.x,
            y: this.y,
        };
    }

    /**
     * Add the provided vector to this one
     */
    add(vec: AbstractVector) {
        this.x += vec.x;
        this.y += vec.y;

        return this;
    }

    /**
     * Add both x and y axis value
     */
    addAxis(dx: number, dy: number) {
        this.x += dx;
        this.y += dy;

        return this;
    }

    /**
     * Subtract the provided vector from this one
     */
    subtract(vec: AbstractVector) {
        this.x -= vec.x;
        this.y -= vec.y;

        return this;
    }

    sub(vec: AbstractVector) {
        return this.subtract(vec);
    }

    /**
     * Check if the provided vector equal to this one
     */
    equals(vec: AbstractVector) {
        return vec.x === this.x && vec.y === this.y;
    }

    /**
     * Multiply this vector by the provided vector
     */
    multiplyByVector(vec: AbstractVector) {
        this.x *= vec.x;
        this.y *= vec.y;

        return this;
    }

    /**
     * Multiply this vector by the provided vector
     */
    mulV(vec: AbstractVector) {
        return this.multiplyByVector(vec);
    }

    /**
     * Divide this vector by the provided vector
     */
    divideByVector(vec: AbstractVector) {
        this.x /= vec.x;
        this.y /= vec.y;
        return this;
    }

    /**
     * Divide this vector by the provided vector
     */
    divV(v: AbstractVector) {
        return this.divideByVector(v);
    }

    /**
     * Multiply this vector by the provided number
     */
    multiplyByScalar(n: number) {
        this.x *= n;
        this.y *= n;

        return this;
    }

    /**
     * Multiply this vector by the provided number
     */
    mult(n: number) {
        return this.multiplyByScalar(n);
    }

    /**
     * Divive this vector by the provided number
     */
    divideByScalar(n: number) {
        this.x /= n;
        this.y /= n;
        return this;
    }

    /**
     * Divive this vector by the provided number
     */
    divS(n: number) {
        return this.divideByScalar(n);
    }

    /**
     * Normalise this vector
     */
    normalise() {
        const m = this.magnitude();

        if (m > 0) {
            this.divS(m);
        }
        return this;
    }

    /**
     * Set the magnitude of this vector to the value used for the len parameter.
     **/
    setMagnitude(len: number) {
        return this.normalise().multiplyByScalar(len);
    }

    /**
     * Returns the squared magnitude of the vector
     */
    magnitudeSquared() {
        const x = this.x;
        const y = this.y;
        return x * x + y * y;
    }

    /**
     * Returns the magnitude (length) of this vector
     */
    magnitude() {
        return Math.sqrt(this.magnitudeSquared());
    }

    /**
     * Returns the magnitude (length) of this vector
     */
    length() {
        return this.magnitude();
    }

    /**
     * Returns the squared length of this vector
     */
    lengthSq() {
        const x = this.x;
        const y = this.y;

        return x * x + y * y;
    }

    /**
     * Returns the dot product of this vector by another
     */
    dot(vec: AbstractVector) {
        return vec.x * this.x + vec.y * this.y;
    }

    /**
     * Returns the cross product of this vector by another.
     */
    cross(vec: AbstractVector) {
        return this.x * vec.y - this.y * vec.x;
    }

    /**
     * Reverses this vector i.e multiplies it by -1
     */
    reverse() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    /**
     * Set the vector axes values to absolute values
     */
    abs() {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);

        return this;
    }

    /**
     * Zeroes the vector i.e sets all axes to 0
     */
    zero() {
        this.x = this.y = 0;

        return this;
    }

    /**
     * Returns the distance between this vector and another
     */
    distance(v: AbstractVector) {
        const x = this.x - v.x;
        const y = this.y - v.y;

        return Math.sqrt(x * x + y * y);
    }

    /**
     * Rotates the vector by provided degrees
     */
    rotate(degrees: number) {
        const rads = toRadian(degrees);
        const cos = Math.cos(rads);
        const sin = Math.sin(rads);

        this.x = this.x * cos - this.y * sin;
        this.y = this.x * sin + this.y * cos;

        return this;
    }

    /**
     * the 2D heading of a vector expressed as an angle
     */
    heading(): number {
        const h = Math.atan2(this.y, this.x);
        return toDegrees(h);
    }

    /**
     * Rounds this vector to n decimal places
     */
    round(n = 2) {
        const p = precision[n];

        // This performs waaay better than toFixed and give Float32 the edge again.
        // http://www.dynamicguru.com/javascript/round-numbers-with-precision/
        this.x = ((0.5 + this.x * p) << 0) / p;
        this.y = ((0.5 + this.y * p) << 0) / p;

        return this;
    }

    limit(max: number) {
        const mSq = this.magnitude();
        if (mSq > max * max) {
            this.normalise().multiplyByScalar(max);
        }
        return this;
    }

    /**
     * Returns a copy of this vector
     */
    clone() {
        return new this.ctor(this.x, this.y);
    }

    perpendicular(): AbstractVector {
        return new Vector(-this.y, this.x);
    }
}
