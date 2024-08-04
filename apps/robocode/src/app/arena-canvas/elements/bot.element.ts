import { BotData, ROBOT_HEIGHT, ROBOT_HITBOX_HEIGHT, ROBOT_HITBOX_WIDTH, ROBOT_WIDTH } from "@robo-code/shared";
import { Logger, toRadian } from "@robo-code/utils";
import { CANVAS_FONT, DEBUG } from "../../settings";
import { DrawableElement } from "../canvas.types";

export class BotElement implements DrawableElement {
    private x = 0;
    private y = 0;
    private rotation = 0;
    private health = 100;
    private energy = 100;

    private height = ROBOT_HEIGHT;
    private width = ROBOT_WIDTH;

    private logger = new Logger("BotElement");

    constructor(
        public id: string,
        public name: string,
    ) {
        this.logger.verbose(`Created BotElement[${id}]`);
    }

    update(data: BotData) {
        this.x = data.position.x;
        this.y = data.position.y;
        this.rotation = data.rotation;
        this.health = data.health;
        this.energy = data.energy;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();

        // NOTE: convert to 2D Cartesian system
        // Move to the center of the entity
        ctx.translate(this.x, ctx.canvas.height - this.y);
        // Rotate around the center
        ctx.rotate(toRadian(this.rotation));

        // Move back by half the width and height to draw the entity correctly
        ctx.translate(-this.width / 2, -this.height / 2);

        if (DEBUG.enabled) {
            this.drawTooltip(ctx);
            this.drawHitbox(ctx);
        }

        this.drawWheels(ctx);
        this.drawBody(ctx);
        this.drawGun(ctx);

        if (DEBUG.enabled) {
            // Move back to the center
            ctx.translate(this.width / 2, this.height / 2);
            this.drawOrigin(ctx);
        }

        ctx.restore();
    }

    private drawTooltip(ctx: CanvasRenderingContext2D) {
        const text = `${this.name} ${Math.floor(this.health)}/${this.energy} - [${Math.floor(this.x)},${Math.floor(this.y)}] (${Math.floor(this.rotation)})`;
        ctx.font = `15px ${CANVAS_FONT}`;
        ctx.fillStyle = "#000000";
        ctx.fillText(text, -20, -20);
    }

    private drawHitbox(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "rgba(218,165,32,0.48)";
        ctx.fillRect(0, 0, ROBOT_HITBOX_WIDTH, ROBOT_HITBOX_HEIGHT);
    }

    private drawBody(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "#5a5a9f";
        ctx.fillRect(0, 0, this.width, this.height);
    }

    private drawOrigin(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.arc(0, 0, 3, 0, 2 * Math.PI);
        ctx.fill();
    }

    private drawWheels(ctx: CanvasRenderingContext2D) {
        const radius = this.width / 6;
        ctx.beginPath();
        ctx.fillStyle = "black";
        // top-left
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        // left-area
        ctx.rect(-radius, 0, 2 * radius, this.height);
        // bottom-left
        ctx.arc(0, this.height, radius, 0, 2 * Math.PI);
        ctx.moveTo(this.width, 0);
        // top-right
        ctx.arc(this.width, 0, radius, 0, 2 * Math.PI);
        // right-area
        ctx.rect(this.width - radius, 0, 2 * radius, this.height);
        // bottom-right
        ctx.arc(this.width, this.height, radius, 0, 2 * Math.PI);

        ctx.fill();
    }

    private drawGun(ctx: CanvasRenderingContext2D) {
        const radius = this.width / 4;
        const gunWidth = radius / 2;
        const gunHeight = this.height - 10;

        ctx.beginPath();
        ctx.fillStyle = "#63a5ef";
        ctx.arc(this.width / 2, this.height / 2, radius, 0, 2 * Math.PI);
        ctx.rect(this.width / 2 - gunWidth / 2, -10, gunWidth, gunHeight);
        ctx.fill();
    }
}
