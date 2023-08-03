// @ts-nocheck
export class Juker {
    name = 'Juker';

    origPos;
    forwards = true;

    tick() {
        if (!this.origPos) {
            this.origPos = this.getX();
        }

        if (this.origPos + 10 < this.getX()) {
            this.forwards = true;
            this.shoot();
        } else if (this.origPos - 10 > this.getX()) {
            this.forwards = false;
            this.shoot();
        }
        if (this.forwards) {
            this.forward(10);
            this.turn(10);
        } else {
            this.backward(10);
            this.turn(-10);
        }
    }
}
