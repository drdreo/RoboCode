// @ts-nocheck

export class Spinner {
    name = "Spinner";

    lastShot = Date.now();
    shootInterval = 300;

    tick() {
        if (this.lastShot + this.shootInterval < Date.now()) {
            this.shoot();
            this.lastShot = Date.now();
        }
        this.forward(1);
        this.turn(0.1);
    }
}
