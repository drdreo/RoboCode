import { Injectable } from "@angular/core";
import { BotData, BulletData } from "@robo-code/shared";
import { Logger } from "@robo-code/utils";
import { BotElement } from "./elements/bot.element";
import { BulletElement } from "./elements/bullet.element";

@Injectable({ providedIn: "root" })
export class CanvasService {
    private drawableBullet = new BulletElement(); // re-use the same bullet object

    private robots: BotElement[] = [];

    private initialized = false;

    private logger = new Logger("CanvasService");

    constructor() {}

    updateBots(bots: BotData[], context: CanvasRenderingContext2D) {
        for (const bot of bots) {
            const botId = bot.name; // TODO: change name id to real ID
            if (!this.hasBot(botId)) {
                // if we got new bots, initialize them
                this.addBot(botId);
            }
            const robot = this.getBot(botId);
            if (!robot) {
                this.logger.error(`Bot[${botId}] not found`);
                continue;
            }
            robot.update(bot);
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

    private getBot(id: string): BotElement | undefined {
        return this.robots.find((bot) => bot.id === id);
    }

    private hasBot(id: string): boolean {
        return this.robots.some((bot) => bot.id === id);
    }
}
