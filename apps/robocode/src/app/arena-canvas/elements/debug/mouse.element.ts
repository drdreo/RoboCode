import { DrawableElement } from "../../canvas.types";
import { Position, Size } from "@robo-code/shared";
import { CANVAS_FONT } from "../../../settings";

const tooltipOffset = 25;

export class DebugMouseElement implements DrawableElement {
    public x = 0;
    public y = 0;

    update(position: Position) {
        // translate to 2D Cartesian coordinate system
        const x = Math.floor(position.x);
        const y = Math.floor(position.y);
        this.x = x;
        this.y = y;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const mousePosText = `x: ${this.x}, y: ${this.y}`;
        ctx.font = `15px ${CANVAS_FONT}`;
        ctx.fillStyle = "#000000";
        ctx.fillText(mousePosText, this.x, this.y - tooltipOffset);
    }
}
