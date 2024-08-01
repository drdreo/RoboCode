import { DrawableElement } from "../../canvas.types";
import { Viewport } from "@robo-code/shared";

export class DebugGridElement implements DrawableElement {
    constructor(private viewport: Viewport) {}

    draw(ctx: CanvasRenderingContext2D) {
        const GRID_WIDTH = 25;
        const { width, height } = ctx.canvas;

        ctx.lineWidth = 1;
        ctx.strokeStyle = "#FFF";

        ctx.beginPath();
        for (let step = 0; step < width; step += GRID_WIDTH) {
            ctx.moveTo(step, 0);
            ctx.lineTo(step, width);

            ctx.moveTo(0, step);
            ctx.lineTo(width, step);
        }

        ctx.stroke();
        ctx.closePath();
    }
}
