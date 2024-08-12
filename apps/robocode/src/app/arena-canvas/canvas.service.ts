import { Injectable } from "@angular/core";
import { ARENA_SIZE, BotData, BulletData, Position, Viewport } from "@robo-code/shared";
import { Logger } from "@robo-code/utils";
import { BotElement } from "./elements/bot.element";
import { BulletElement } from "./elements/bullet.element";
import { DebugMouseElement } from "./elements/debug/mouse.element";
import { DebugGridElement } from "./elements/debug/grid.element";
import { DEBUG } from "../settings";

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
                this.addBot(bot.id, bot.name);
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
            ctx.drawImage(image, 0, 0, ARENA_SIZE, ARENA_SIZE);
        }
    }

    drawGrid(ctx: CanvasRenderingContext2D) {
        this.gridElement.draw(ctx);
    }

    drawDebugCanvas(ctx: CanvasRenderingContext2D) {
        if (DEBUG.grid) {
            this.drawGrid(ctx);
        }
    }

    clearCanvas(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    panCanvas(delta: Position) {
        const { x, y } = delta;
        const panSpeed = 1 / this.viewport.zoom;

        this.viewport.pan.x += x * panSpeed;
        this.viewport.pan.y += y * panSpeed;
    }

    resetPan() {
        this.viewport.pan.x = 0;
        this.viewport.pan.y = 0;
    }

    zoomCanvas(newZoom: number, mousePos: Position) {
        const zoomChange = newZoom - this.viewport.zoom;
        if (newZoom < 0 || zoomChange === 0) {
            return;
        }

        const offsetX = -mousePos.x * zoomChange;
        const offsetY = -mousePos.y * zoomChange;

        // Apply the zoom
        this.viewport.zoom = newZoom;

        this.panCanvas({ x: offsetX, y: offsetY });
    }

    applyViewportTransformation(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.scale(this.viewport.zoom, this.viewport.zoom);
        ctx.translate(this.viewport.pan.x, this.viewport.pan.y);
        // ctx.setTransform(this.viewport.zoom, 0, 0, this.viewport.zoom, this.viewport.pan.x, this.viewport.pan.y);
    }

    focusBot(bots: BotData[]) {
        const player = bots.find((bot) => bot.id === "manual_robot");
        if (player) {
            const viewportCenterX = ARENA_SIZE / 2;
            const viewportCenterY = ARENA_SIZE / 2;

            // Calculate the difference between player's position and the center of the viewport
            const panX = viewportCenterX - player.position.x;
            const panY = player.position.y - viewportCenterY;

            // Pan the canvas to center the player
            this.viewport.pan.x = panX;
            this.viewport.pan.y = panY;
        }
    }

    private addBot(id: string, name: string) {
        this.robots.push(new BotElement(id, name));
    }

    private getBot(id: string): BotElement | undefined {
        return this.robots.find((bot) => bot.id === id);
    }

    private hasBot(id: string): boolean {
        return this.robots.some((bot) => bot.id === id);
    }
}
