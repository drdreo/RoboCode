import { Injectable } from "@angular/core";
import { BotData, BulletData, Position } from "@robo-code/shared";
import { Logger } from "@robo-code/utils";
import { BotElement } from "./elements/bot.element";
import { BulletElement } from "./elements/bullet.element";
import { DEBUG } from "../settings";
import { DebugMouseElement } from "./elements/debug/mouse.element";
import { DebugGridElement } from "./elements/debug/grid.element";

@Injectable({ providedIn: "root" })
export class CanvasService {
    private drawableBullet = new BulletElement(); // re-use the same bullet object for drawing
    private mouseElement = new DebugMouseElement();
    private gridElement = new DebugGridElement();
    private robots: BotElement[] = [];

    private logger = new Logger("CanvasService");

    renderBots(ctx: CanvasRenderingContext2D, bots: BotData[]) {
        for (const bot of bots) {
            if (!this.hasBot(bot.id)) {
                // if we got new bots, initialize them
                this.addBot(bot.id);
            }
            const robot = this.getBot(bot.id);
            if (!robot) {
                this.logger.error(`Bot[${bot.id}] not found`);
                continue;
            }
            robot.update(bot);
            robot.draw(ctx);
        }
    }

    renderBullets(ctx: CanvasRenderingContext2D, bullets: BulletData[]) {
        for (const bullet of bullets) {
            this.drawableBullet.update(bullet);
            this.drawableBullet.draw(ctx);
        }
    }

    renderMousePosition(ctx: CanvasRenderingContext2D, mousePos: Position) {
        this.mouseElement.update(mousePos);
        this.mouseElement.draw(ctx);
    }

    drawBackground(ctx: CanvasRenderingContext2D, image?: HTMLImageElement) {
        if (!image) {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            return;
        }
        ctx.drawImage(image, 0, 0);
    }

    drawGrid(ctx: CanvasRenderingContext2D) {
        this.gridElement.draw(ctx);
    }

    drawDebugCanvas(ctx: CanvasRenderingContext2D) {
        this.drawGrid(ctx);
    }

    clearCanvas(ctx: CanvasRenderingContext2D, preserveTransform = false) {
        if (preserveTransform) {
            // Store the current transformation matrix
            ctx.save();
            // Use the identity matrix while clearing the canvas
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        if (preserveTransform) {
            // Restore the transform
            ctx.restore();
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
