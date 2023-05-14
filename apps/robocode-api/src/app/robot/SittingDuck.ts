// @ts-nocheck

export class SittingDuck {
    name = 'SittingDuck';

    lastShot = Date.now();
    shootInterval = 3000;

    tick() {

        if (this.lastShot + this.shootInterval < Date.now()) {
            this.shoot();
            this.lastShot = Date.now();
        }

    }

    onHit() {
        console.warn('OUUUUUUUUCH I GOT HIT');
    }

    onDeath() {
        console.error('I DIED');
    }
}
