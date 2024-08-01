import { DrawableElement } from "../../canvas.types";
import { Position, Size, Viewport } from "@robo-code/shared";
import { CANVAS_FONT } from "../../../settings";

const tooltipOffset = 15;

export class DebugMouseElement implements DrawableElement {
    public x = 0;
    public y = 0;

    constructor(private viewport: Viewport) {}

    update(position: Position) {
        // Apply the inverse of the current pan and zoom transformations to the mouse position
        const transformedX = (position.x - this.viewport.pan.x) / this.viewport.zoom;
        const transformedY = (position.y - this.viewport.pan.y) / this.viewport.zoom;

        this.x = Math.floor(transformedX);
        this.y = Math.floor(transformedY);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const mousePosText = `x: ${this.x}, y: ${this.y}`;
        const fontSize = 15 / this.viewport.zoom;
        ctx.font = `${fontSize}px ${CANVAS_FONT}`;
        ctx.fillStyle = "#000000";
        ctx.fillText(mousePosText, this.x, this.y - tooltipOffset);
    }
}
