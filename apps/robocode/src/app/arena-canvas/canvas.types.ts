export interface DrawableElement {
    draw(context: CanvasRenderingContext2D, time?: number): void
}