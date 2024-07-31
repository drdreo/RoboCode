// @ts-nocheck

export class SittingDuck {
    name = "SittingDuck";

    lastShot = Date.now();
    shootInterval = 3000;

    lastRot = 0;

    tick() {
        this.lastRot = this.getHeading();
        if (this.lastRot < 45) {
            this.turn(10);
        }

        if (this.lastShot + this.shootInterval < Date.now()) {
            this.shoot();
            this.lastShot = Date.now();
        }

        // this.turn(0.11);
    }

    onHit() {
        console.warn("OUUUUUUUUCH I GOT HIT");
    }

    onDeath() {
        console.error("I DIED");
    }
}
