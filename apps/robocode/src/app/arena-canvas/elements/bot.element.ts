import { BotData } from "@robo-code/shared";
import { Logger } from '@robo-code/utils';
import { DrawableElement } from "../canvas.types";

export class BotElement implements DrawableElement {
    public x = 0;
    public y = 0;
    public rotation = 0;

    private height = 50;
    private width = 30;

    private logger = new Logger('BotElement');

    constructor(private id: string) {
        this.logger.verbose(`Created BotElement[${ id }]`);
    }

    update(data: BotData) {
        this.x = data.position.x;
        this.y = data.position.y;
        this.rotation = data.rotation;
    }

    draw(context: CanvasRenderingContext2D): void {
        this.logger.debug(`Bot[${ this.id }] - draw()`);

        context.translate(this.x - this.width / 2, this.y - this.height / 2);
        this.drawTooltip(context);
        context.rotate((this.rotation * Math.PI) / 180);

        this.drawWheels(context);
        this.drawBody(context);
        this.drawGun(context);

        // Reset transformation matrix to the identity matrix
        context.setTransform(1, 0, 0, 1, 0, 0);
    }

    private drawTooltip(context: CanvasRenderingContext2D) {

        const text = `${ this.id } [${ Math.floor(this.x) },${ Math.floor(this.y) }] (${ Math.floor(this.rotation) })`;
        context.font = "20px serif";
        context.fillStyle = "#000000";
        context.fillText(text, -20, -20);
    }

    private drawBody(context: CanvasRenderingContext2D) {
        context.fillStyle = '#5a5a9f';
        context.fillRect(0, 0, this.width, this.height);
    }

    private drawWheels(context: CanvasRenderingContext2D) {
        const radius = this.width / 6;
        context.beginPath();
        context.fillStyle = 'black';
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
        context.fillStyle = '#63a5ef';
        context.arc(this.width / 2, this.height / 2, radius, 0, 2 * Math.PI);
        context.rect(this.width / 2 - gunWidth / 2, -10, gunWidth, gunHeight);
        context.fill();
    }
}
