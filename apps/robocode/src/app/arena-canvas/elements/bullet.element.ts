import { BulletData } from "@robo-code/shared";
import { DrawableElement } from "../canvas.types";

export class BulletElement implements DrawableElement {
    public x = 0;
    public y = 0;

    private size = 3;

    update(data: BulletData) {
        this.x = data.position.x;
        this.y = data.position.y;
    }

    draw(context: CanvasRenderingContext2D): void {
        this.drawBody(context);

        // Reset transformation matrix to the identity matrix
        context.setTransform(1, 0, 0, 1, 0, 0);
    }

    private drawBody(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.fillStyle = "#352918";
        const offset = this.size / 2;
        const posX = this.x + offset;
        const posY = context.canvas.height - this.y + offset;
        context.arc(posX, posY, this.size, 0, 2 * Math.PI, false);
        context.fill();

        context.closePath();
    }
}
