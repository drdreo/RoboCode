import { Injectable, Logger } from '@nestjs/common';
import { BulletData, ARENA_SIZE } from "@robo-code/shared";
import { Vector } from "@robo-code/utils";
import { timer } from "rxjs";
import { Robot } from "./robot/Robot";

const TICK_RATE = 20;
const BULLET_SPEED = 15;


class Bullet {
    position = new Vector();
    velocity = new Vector();
    isActive = false;

    init(x: number, y: number, heading: number): void {
        this.position.setAxes(x, y);
        // Convert the heading of the robot to a vector for the velocity of the bullet
        // const velocityX = BULLET_SPEED * Math.cos(heading * (Math.PI / 180));
        // const velocityY = BULLET_SPEED * Math.sin(heading * (Math.PI / 180));

        this.velocity.setAxes(0, -1).rotate(heading).mult(BULLET_SPEED);
    }
}

const isActive = (bullet: { isActive: boolean }) => bullet.isActive;

@Injectable()
export class SimulationService {

    tick$ = timer(0, TICK_RATE);

    private bullets: Bullet[] = new Array<Bullet>(50);
    private logger = new Logger('SimulationService');

    constructor() {
        this.initBulletsPool();

        this.tick$.subscribe(() => {
            this.logger.debug(`${ this.bullets.filter(isActive).length } active bullets`)
            this.bullets.forEach(bullet => this.updateBullet(bullet));
        });
    }


    shootBullet(robot: Robot) {
        this.logger.verbose(robot + ' shooting bullet!');

        const availableBulletIndex = this.bullets.findIndex(b => !b.isActive);
        if (availableBulletIndex === -1) {
            // No available bullet slots
            this.logger.warn('No available bullet slots');
            return;
        }

        const bullet = this.bullets[availableBulletIndex];
        bullet.isActive = true;
        bullet.init(robot.x, robot.y, robot.rotation);
    }

    getActiveBullets(): BulletData[] {
        return this.bullets.filter(b => b.isActive).map(b => ({ position: b.position.toObject() }));
    }

    private removeBullet(bullet: Bullet) {
        bullet.isActive = false;
    }

    private initBulletsPool(): void {
        this.logger.verbose('Initializing bullets pool');
        for (let i = 0; i < this.bullets.length; i++) {
            this.bullets[i] = new Bullet();
        }
    }

    // todo: think about dt, a parameter representing the time elapsed since the last update.
    private updateBullet(bullet: Bullet) {
        if (!isActive(bullet)) {
            return;
        }

        this.logger.debug('bullet: ' + Math.floor(bullet.position.x) + ', ' + Math.floor(bullet.position.y));
        // check bullet constraints: hits, out of bounds, etc
        if (bullet.position.x < 0 || bullet.position.x > ARENA_SIZE || bullet.position.y < 0 || bullet.position.y > ARENA_SIZE) {
            this.removeBullet(bullet);
            return;
        }

        bullet.position.add(bullet.velocity);
    }
}

