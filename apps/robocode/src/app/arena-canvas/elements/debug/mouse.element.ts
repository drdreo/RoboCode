import { DrawableElement } from "../../canvas.types";
import { ARENA_SIZE, Position, Viewport } from "@robo-code/shared";
import { CANVAS_FONT } from "../../../settings";
import { Vector } from "@robo-code/utils";

const tooltipOffset = 15;

export class DebugMouseElement implements DrawableElement {
    private renderPosition: Vector = new Vector();
    private viewportPosition: Vector = new Vector();

    constructor(private viewport: Viewport) {}

    update(mousePos: Position) {
        this.viewportPosition.x = (mousePos.x - this.viewport.pan.x * this.viewport.zoom) / this.viewport.zoom;
        this.viewportPosition.y = (mousePos.y - this.viewport.pan.y * this.viewport.zoom) / this.viewport.zoom;
        this.renderPosition = this.convertToCartesian(this.viewportPosition);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const mousePosText = `x: ${this.renderPosition.x}, y: ${this.renderPosition.y}`;
        const fontSize = 15 / this.viewport.zoom;
        ctx.font = `${fontSize}px ${CANVAS_FONT}`;
        ctx.fillStyle = "#000000";
        ctx.fillText(mousePosText, this.viewportPosition.x, this.viewportPosition.y - tooltipOffset);
    }

    private convertToCartesian(position: Vector): Vector {
        // convert to 2D Cartesian coordinate system
        return position
            .clone()
            .setY(ARENA_SIZE - position.y)
            .round(0);
    }
}
