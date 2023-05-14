import { Injectable } from '@angular/core';
import { BotData, BulletData } from "@robo-code/shared";
import { Logger } from "@robo-code/utils";
import { BotElement } from "./elements/bot.element";
import { BulletElement } from "./elements/bullet.element";

@Injectable()
export class CanvasService {

    private drawableBullet = new BulletElement(); // re-use the same bullet object

    private robots: BotElement[] = [];

    private initialized = false;

    private logger = new Logger('CanvasService');

    constructor() {

    }

    updateBots(bots: BotData[], context: CanvasRenderingContext2D) {
        // init bots on first update
        if (!this.initialized) {
            this.logger.verbose('Initializing bots');
            bots.forEach((bot) => this.addBot(bot.name));
            this.initialized = true;
            return;
        }

        for (let i = 0; i < bots.length; i++) {
            const robot = this.getBot(i);
            robot.update(bots[i]);
            robot.draw(context);
        }

    }

    updateBullets(bullets: BulletData[], context: CanvasRenderingContext2D) {
        for (const bullet of bullets) {
            this.drawableBullet.update(bullet);
            this.drawableBullet.draw(context);
        }
    }

    private addBot(id: string) {
        this.robots.push(new BotElement(id));
    }

    private getBot(id: number): BotElement {
        return this.robots[id];
    }
}
