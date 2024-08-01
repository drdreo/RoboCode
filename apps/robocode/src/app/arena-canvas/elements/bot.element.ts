import { BotData, ROBOT_HEIGHT, ROBOT_HITBOX_HEIGHT, ROBOT_HITBOX_WIDTH, ROBOT_WIDTH } from "@robo-code/shared";
import { Logger } from "@robo-code/utils";
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

    constructor(public id: string) {
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
        // use canvas height to match the 2D Cartesian system
        ctx.translate(this.x - this.width / 2, ctx.canvas.height - (this.y - this.height / 2));
        if (DEBUG.enabled) {
            this.drawTooltip(ctx);
        }

        this.drawOrigin(ctx);

        ctx.rotate(this.rotation * (Math.PI / 180));

        if (DEBUG.enabled) {
            this.drawHitbox(ctx);
        }

        this.drawWheels(ctx);
        this.drawBody(ctx);
        this.drawGun(ctx);

        // Reset transformation matrix to the identity matrix
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    private drawTooltip(ctx: CanvasRenderingContext2D) {
        const text = `${this.id} ${Math.floor(this.health)}/${this.energy} - [${Math.floor(this.x)},${Math.floor(this.y)}] (${Math.floor(this.rotation)})`;
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
        ctx.fillStyle = "red";
        ctx.arc(0, 0, 7, 0, 2 * Math.PI);
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
