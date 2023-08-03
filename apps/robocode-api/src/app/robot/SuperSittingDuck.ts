// @ts-nocheck
import { Vector } from "@robo-code/utils";

export class SuperSittingDuck {
    enemyHits: number;
    goCryInCorner: boolean;

    targetCorner = new Vector(0,0);
    tick() {
        if (this.goCryInCorner) {
            // todo: implement seeking

        } else {
            this.scan();
        }
    }

    onScannedRobot(scannedRobotEvent) {
        const absBearing = e.getBearing() + this.getHeading();
        const robotForce = 5 * (scannedRobotEvent.getDistance() - 100);
        // If we get hit too much, go cry in the corner.
        if (this.goCryInCorner) {
            this.turn(90 - this.getHeading());
            this.forward((this.getArenaWidth() - this.getX()) - 20);
            this.turn(0 - this.getHeading());
            this.forward((this.getArenaHeight() - this.getY()) - 20);
        } else {
            // Otherwise go towards the other robot and don't fire at him
            this.forward(robotForce);
            this.turn(absBearing - this.getHeading());
        }
    }

    onHit() {
        /*
        *Find out how much the enemy has hit us...
        */
        this.enemyHits++;
        if (this.enemyHits == 4) {
            console.warn("Oh, the shame of losing!");
            this.goCryInCorner = true;
        }
    }
}
