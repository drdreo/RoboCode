import { Injectable, Logger } from '@nestjs/common';
import { ARENA_SIZE, BotsUpdate, BulletData, ROBOT_HITBOX_HEIGHT, ROBOT_HITBOX_WIDTH } from "@robo-code/shared";
import { Vector } from "@robo-code/utils";
import { timer } from "rxjs";
import { Robot } from "./robot/Robot";

const TICK_RATE = 20;
const BULLET_SPEED = 15;


const NOOP = function () {
};

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

const hasEnergyToShoot = (energy: number) => energy > 20;

@Injectable()
export class SimulationService {

    tick$ = timer(0, TICK_RATE);

    private bots: Robot[] = [];
    private bullets: Bullet[] = new Array<Bullet>(50);
    private logger = new Logger('SimulationService');

    constructor() {
        this.initBulletsPool();

        this.tick$.subscribe(() => {
            this.logger.debug(`${ this.bullets.filter(isActive).length } active bullets`)

            try {
                this.bots.forEach((bot) => bot.tick());
            } catch (e) {
                console.error(e);
                throw new Error('Error during Bot tick!');
            }

            this.bullets.forEach(bullet => this.updateBullet(bullet));
        });
    }

    registerBot(bot: any) {
        const robot = new Robot(bot);
        robot.actualBot.shoot = () => hasEnergyToShoot(robot.getEnergy()) ? this.shootBullet(robot) : NOOP;
        robot.actualBot.forward = (amount) => robot.forward(amount);
        robot.actualBot.backward = (amount) => robot.backward(amount);
        robot.actualBot.turn = (amount) => robot.turn(amount);
        robot.actualBot.getX = () => robot.x;
        robot.actualBot.getY = () => robot.y;

        // event handlers
        robot.actualBot.onCrash = robot.actualBot.onCrash ?? NOOP;
        robot.actualBot.onHit = robot.actualBot.onHit ?? NOOP;
        robot.actualBot.onDeath = robot.actualBot.onDeath ?? NOOP;
        robot.actualBot.onWin = robot.actualBot.onWin ?? NOOP;

        this.bots.push(robot);
    }

    getBotUpdate(): BotsUpdate {
        return this.bots.reduce((prev, bot) => {
            prev.push(bot.getData());
            return prev;
        }, []);
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
        robot.consumeShootingEnergy();
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
        if (bullet.position.x < 0 || bullet.position.x > ARENA_SIZE || bullet.position.y < 0 || bullet.position.y > ARENA_SIZE) {
            this.removeBullet(bullet);
            return;
        }

        bullet.position.add(bullet.velocity);

        this.checkCollision(bullet);
    }

    private checkCollision(bullet: Bullet) {
        // (bx, by) is within the bounding box of the bot if px <= bx <= px + w and py <= by <= py + h.


        for (const bot of this.bots) {
            // check collision with bot hitbox
            if (bullet.position.x >= bot.x && bullet.position.x <= bot.x + ROBOT_HITBOX_WIDTH && bullet.position.y >= bot.y && bullet.position.y <= bot.y + ROBOT_HITBOX_HEIGHT) {
                bot.bulletHit();
                const botHealth = bot.getHealth();
                if (botHealth <= 0) {
                    bot.actualBot.onDeath();
                    this.bots = this.bots.filter(b => b !== bot);
                } else {
                    bot.actualBot.onHit(botHealth);
                }

                this.removeBullet(bullet);
                return;
            }
        }
    }
}
