import { Injectable, Logger } from "@nestjs/common";
import { ARENA_SIZE, BotsUpdate, BulletData, TICKS_PER_SECOND } from "@robo-code/shared";
import { Vector } from "@robo-code/utils";
import { timer } from "rxjs";
import { Robot } from "../robot/Robot";
import { IRobotHitEvent, IRobotScanEven } from "../robot/robot.types";
import { Bullet } from "./bullet.entity";
import { CollisionDetector } from "./collision-detector";
import { Engine } from "./physics-engine";
import { hasEnergyToShoot, isActive, isInactive, NOOP } from "./sim.utils";

let ENTITY_COUNTER = 0;

@Injectable()
export class SimulationService {
    tick$ = timer(0, TICKS_PER_SECOND);

    private bots: Robot[] = [];
    private bullets: Bullet[] = new Array<Bullet>(50);

    private engine = new Engine();
    private collisionDetector = new CollisionDetector();

    private lastStepTime = performance.now();
    private measureTime;

    private logger = new Logger("SimulationService");

    constructor() {
        this.initBulletsPool();

        /**
         * Physics loop step
         * 1 User Interaction
         * 2 Positional Logic
         * 3 Detect Collisions
         * 4 Resolve Collisions
         */
        this.tick$.subscribe(() => {
            const newTime = performance.now();
            const frameTime = newTime - this.lastStepTime;

            // TODO: Measure distance accuracy
            this.measureBotDistanceAccuracy(newTime);

            this.tickBots(frameTime);

            this.engine.step(frameTime);

            this.detectAndResolveCollisions();

            this.lastStepTime = newTime;
        });
    }

    registerBot(bot: any): Robot {
        const randomY = Math.floor(Math.random() * 700);
        const robot = new Robot("robot_" + ENTITY_COUNTER++, bot, new Vector(500, randomY));
        // robot actions
        robot.actualBot.scan = () => this.scan(robot);
        robot.actualBot.shoot = () => (hasEnergyToShoot(robot.getEnergy()) ? this.shootBullet(robot) : NOOP);
        robot.actualBot.forward = (amount) => robot.forward(amount);
        robot.actualBot.backward = (amount) => robot.backward(amount);
        robot.actualBot.turn = (amount) => robot.turn(amount);

        // robot info
        robot.actualBot.getX = () => robot.x;
        robot.actualBot.getY = () => robot.y;
        robot.actualBot.getHeading = () => robot.heading;

        // arena info
        robot.actualBot.getArenaWidth = () => ARENA_SIZE;
        robot.actualBot.getArenaHeight = () => ARENA_SIZE;

        // robot event handlers
        robot.actualBot.onCrash = robot.actualBot.onCrash ?? NOOP;
        robot.actualBot.onHit = robot.actualBot.onHit ?? NOOP;
        robot.actualBot.onDeath = robot.actualBot.onDeath ?? NOOP;
        robot.actualBot.onWin = robot.actualBot.onWin ?? NOOP;
        robot.actualBot.onScannedRobot = robot.actualBot.onScannedRobot ?? NOOP;

        this.bots.push(robot);
        this.engine.addEntity(robot);
        return robot;
    }

    scan(robot: Robot) {
        this.logger.verbose(robot + " scanning!");

        const otherBot = this.bots.find((b) => b !== robot);
        let scanData: IRobotScanEven | undefined;
        if (otherBot) {
            scanData = {
                position: otherBot.position,
            };
        }

        if (scanData) {
            robot.actualBot.onScan(scanData);
        }
    }

    shootBullet(robot: Robot) {
        this.logger.verbose(robot + " shooting bullet!");

        const availableBullet = this.bullets.find(isInactive);
        if (!availableBullet) {
            // No available bullet slots
            this.logger.warn("No available bullet slots");
            return;
        }

        this.spawnBulletAtRobot(availableBullet, robot);
        robot.consumeShootingEnergy();
    }

    getBotUpdate(): BotsUpdate {
        return this.bots.reduce((prev, bot) => {
            prev.push(bot.getData());
            return prev;
        }, []);
    }

    getActiveBullets(): BulletData[] {
        return this.bullets.filter(isActive).map((b) => ({ position: b.position.toObject() }));
    }

    private measureBotDistanceAccuracy(timestamp: number) {
        // TODO: remove this, just for debug
        if (!this.measureTime) {
            this.measureTime = timestamp;
        }
        // TODO: remove this, just for debug
        if (this.bots[0]?.position.y < 500 && this.measureTime > 0) {
            //1 26204
            //2 37188
            //3 24136
            //4 33472
            //5 35233
            //6 40395
            //7 29181.

            this.logger.error(`Bot made it after ${timestamp - this.measureTime}!`);
            this.measureTime = -1;
        }
    }

    private killBot(robot: Robot) {
        this.logger.verbose(robot + " died!");
        robot.actualBot.onDeath();
        this.bots = this.bots.filter((b) => b !== robot);
    }

    private tickBots(dt: number) {
        try {
            this.bots.forEach((bot) => {
                bot.gainEnergy();
                bot.decayHealth();
                const died = bot.isDead();
                if (died) {
                    this.killBot(bot);
                    return;
                }

                bot.tick(dt);
            });
        } catch (e) {
            console.error(e);
            throw new Error("Error during Bot tick!");
        }
    }

    private spawnBulletAtRobot(bullet: Bullet, robot: Robot) {
        bullet.isActive = true;
        const { x, y, rotation } = robot;
        bullet.init(x, y, rotation);
        this.engine.addEntity(bullet);
    }

    private removeBullet(bullet: Bullet) {
        bullet.isActive = false;
        this.engine.removeEntity(bullet);
    }

    private initBulletsPool(): void {
        this.logger.verbose("Initializing bullets pool");

        for (let i = 0; i < this.bullets.length; i++) {
            this.bullets[i] = new Bullet("bullet_" + ENTITY_COUNTER++);
        }
    }

    private resolveBotCollision(robot: Robot) {
        robot.bulletHit();
        const died = robot.isDead();
        if (died) {
            this.killBot(robot);
            return;
        }

        const hitData: IRobotHitEvent = {
            health: robot.getHealth(),
        };
        robot.actualBot.onHit(hitData);
    }

    private resolveBulletCollision(bullet: Bullet) {
        this.removeBullet(bullet);
    }

    private detectAndResolveCollisions() {
        const activeBullets = this.bullets.filter(isActive);

        // for (const bot of this.bots) {
        //     const bulletHits = this.collisionDetector.detectCollisions(bot, activeBullets) as Bullet[];
        //     for (const bullet of bulletHits) {
        //         this.resolveBotCollision(bot);
        //         this.resolveBulletCollision(bullet);
        //     }
        // }

        // check if bullet is out of bounds and remove it
        for (const bullet of activeBullets) {
            if (bullet.x < 0 || bullet.x > ARENA_SIZE || bullet.y < 0 || bullet.y > ARENA_SIZE) {
                this.removeBullet(bullet);
            }
        }

        // todo: check if bot is out of bounds
        // todo: refactor to make it generic for all entities
    }
}
