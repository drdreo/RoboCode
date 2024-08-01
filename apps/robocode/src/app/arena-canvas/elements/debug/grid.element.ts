import { DrawableElement } from "../../canvas.types";
import { ARENA_SIZE, Viewport } from "@robo-code/shared";

export class DebugGridElement implements DrawableElement {
    constructor(private viewport: Viewport) {}

    draw(ctx: CanvasRenderingContext2D) {
        const GRID_WIDTH = 25;

        ctx.lineWidth = 1;
        ctx.strokeStyle = "#FFF";

        ctx.beginPath();
        for (let step = 0; step < ARENA_SIZE; step += GRID_WIDTH) {
            ctx.moveTo(step, 0);
            ctx.lineTo(step, ARENA_SIZE);

            ctx.moveTo(0, step);
            ctx.lineTo(ARENA_SIZE, step);
        }

        ctx.stroke();
        ctx.closePath();
    }
}
