import { ARENA_SIZE, BULLET_SIZE, BulletData, Viewport } from "@robo-code/shared";
import { DrawableElement } from "../canvas.types";

export class BulletElement implements DrawableElement {
    public x = 0;
    public y = 0;

    private size = BULLET_SIZE;

    constructor(private viewport: Viewport) {}

    update(data: BulletData) {
        this.x = data.position.x;
        this.y = data.position.y;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.drawBody(ctx);
    }

    private drawBody(ctx: CanvasRenderingContext2D) {
        ctx.save();
        const offset = this.size / 2;
        const posX = this.x + offset;
        const posY = ARENA_SIZE - this.y + offset;

        ctx.translate(posX, posY);

        ctx.beginPath();
        ctx.fillStyle = "#352918";

        ctx.arc(0, 0, this.size, 0, 2 * Math.PI, false);
        ctx.fill();

        ctx.closePath();
        ctx.restore();
    }
}
