// @ts-nocheck
export class UpAndDown {
    name = 'UpAndDown';

    origPos;
    forwards = true;

    tick() {
        if (!this.origPos) {
            this.origPos = this.getY();
        }

        const currentPos = this.getY();

        if (currentPos < this.origPos - 200) {
            this.forwards = false;
            // this.shoot();
        } else if (currentPos > this.origPos) {
            this.forwards = true;
            this.shoot();
        }


        if (this.forwards) {
            this.forward(10);
        } else {
            this.backward(10);
        }
    }
}
