import { Injectable } from "@angular/core";
import { BotData, BulletData, Position, Viewport } from "@robo-code/shared";
import { Logger } from "@robo-code/utils";
import { BotElement } from "./elements/bot.element";
import { BulletElement } from "./elements/bullet.element";
import { DebugMouseElement } from "./elements/debug/mouse.element";
import { DebugGridElement } from "./elements/debug/grid.element";

@Injectable({ providedIn: "root" })
export class CanvasService {
    private viewport: Viewport = {
        zoom: 1,
        pan: {
            x: 0,
            y: 0,
        },
    };

    private drawableBullet = new BulletElement(this.viewport); // re-use the same bullet object for drawing
    private mouseElement = new DebugMouseElement(this.viewport);
    private gridElement = new DebugGridElement(this.viewport);
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
        } else {
            ctx.drawImage(image, 0, 0);
        }
    }

    drawGrid(ctx: CanvasRenderingContext2D) {
        this.gridElement.draw(ctx);
    }

    drawDebugCanvas(ctx: CanvasRenderingContext2D) {
        this.drawGrid(ctx);
    }

    clearCanvas(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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

    panCanvas(ctx: CanvasRenderingContext2D, position: Position) {
        const { x, y } = position;
        const canvas = ctx.canvas;
        const panSpeed = 10;
        const panMargin = 50;

        if (x < panMargin) {
            this.viewport.pan.x += panSpeed;
        }
        if (x > canvas.width - panMargin) {
            this.viewport.pan.x -= panSpeed;
        }
        if (y < panMargin) {
            this.viewport.pan.y += panSpeed;
        }
        if (y > canvas.height - panMargin) {
            this.viewport.pan.y -= panSpeed;
        }
    }

    zoomCanvas(delta: number) {
        this.viewport.zoom = delta;
        if (this.viewport.zoom < 0.1) {
            this.viewport.zoom = 0.1;
        }
    }

    applyViewportTransformation(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.scale(this.viewport.zoom, this.viewport.zoom);
        ctx.translate(this.viewport.pan.x, this.viewport.pan.y);
        // ctx.setTransform(this.viewport.zoom, 0, 0, this.viewport.zoom, this.viewport.pan.x, this.viewport.pan.y);
    }
}
