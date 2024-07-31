import { BotData, ROBOT_HEIGHT, ROBOT_HITBOX_HEIGHT, ROBOT_HITBOX_WIDTH, ROBOT_WIDTH } from "@robo-code/shared";
import { Logger } from "@robo-code/utils";
import { DEBUG } from "../../settings";
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

    draw(context: CanvasRenderingContext2D): void {
        this.logger.debug(`Bot[${this.id}] - draw()`);

        // use canvas height to match the 2D Cartesian system
        context.translate(this.x - this.width / 2, context.canvas.height - (this.y - this.height / 2));
        if (DEBUG.enabled) {
            this.drawTooltip(context);
        }

        this.drawOrigin(context);

        context.rotate(this.rotation * (Math.PI / 180));

        if (DEBUG.enabled) {
            this.drawHitbox(context);
        }

        this.drawWheels(context);
        this.drawBody(context);
        this.drawGun(context);

        // Reset transformation matrix to the identity matrix
        context.setTransform(1, 0, 0, 1, 0, 0);
    }

    private drawTooltip(context: CanvasRenderingContext2D) {
        const text = `${this.id} ${Math.floor(this.health)}/${this.energy} - [${Math.floor(this.x)},${Math.floor(this.y)}] (${Math.floor(this.rotation)})`;
        context.font = "20px serif";
        context.fillStyle = "#000000";
        context.fillText(text, -20, -20);
    }

    private drawHitbox(context: CanvasRenderingContext2D) {
        context.font = "20px serif";
        context.fillStyle = "rgba(218,165,32,0.48)";
        context.fillRect(0, 0, ROBOT_HITBOX_WIDTH, ROBOT_HITBOX_HEIGHT);
    }

    private drawBody(context: CanvasRenderingContext2D) {
        context.fillStyle = "#5a5a9f";
        context.fillRect(0, 0, this.width, this.height);
    }

    private drawOrigin(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.fillStyle = "red";
        context.fillStyle = "red";
        context.arc(0, 0, 7, 0, 2 * Math.PI);
        context.fill();
    }

    private drawWheels(context: CanvasRenderingContext2D) {
        const radius = this.width / 6;
        context.beginPath();
        context.fillStyle = "black";
        // top-left
        context.arc(0, 0, radius, 0, 2 * Math.PI);
        // left-area
        context.rect(-radius, 0, 2 * radius, this.height);
        // bottom-left
        context.arc(0, this.height, radius, 0, 2 * Math.PI);
        context.moveTo(this.width, 0);
        // top-right
        context.arc(this.width, 0, radius, 0, 2 * Math.PI);
        // right-area
        context.rect(this.width - radius, 0, 2 * radius, this.height);
        // bottom-right
        context.arc(this.width, this.height, radius, 0, 2 * Math.PI);

        context.fill();
    }

    private drawGun(context: CanvasRenderingContext2D) {
        const radius = this.width / 4;
        const gunWidth = radius / 2;
        const gunHeight = this.height - 10;

        context.beginPath();
        context.fillStyle = "#63a5ef";
        context.arc(this.width / 2, this.height / 2, radius, 0, 2 * Math.PI);
        context.rect(this.width / 2 - gunWidth / 2, -10, gunWidth, gunHeight);
        context.fill();
    }
}
