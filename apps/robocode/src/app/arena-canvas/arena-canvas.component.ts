import {
    ChangeDetectionStrategy,
    Component,
    effect,
    ElementRef,
    Signal,
    signal,
    viewChild,
    ViewChild,
    WritableSignal,
} from "@angular/core";
import { ARENA_SIZE, BotsUpdate, BulletsUpdate } from "@robo-code/shared";
import { Observable, withLatestFrom } from "rxjs";
import { BotService } from "../bot.service";
import { DEBUG } from "../settings";
import { CanvasService } from "./canvas.service";
import { AsyncPipe, DecimalPipe } from "@angular/common";
import { BackgroundComponent } from "./arena-background/background.component";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";

@Component({
    selector: "rc-arena-canvas",
    templateUrl: "./arena-canvas.component.html",
    styleUrls: ["./arena-canvas.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [BackgroundComponent, AsyncPipe, DecimalPipe],
})
export class ArenaCanvasComponent {
    canvasRef = viewChild<ElementRef<HTMLCanvasElement>>("arenaCanvas");
    debugCanvasRef = viewChild<ElementRef<HTMLCanvasElement>>("debugCanvas");

    protected readonly DEBUG = DEBUG;
    protected readonly ARENA_SIZE = ARENA_SIZE;

    bots: Signal<BotsUpdate>;
    bullets: Signal<BulletsUpdate>;

    constructor(
        private botService: BotService,
        private canvasService: CanvasService,
    ) {
        this.bots = toSignal(this.botService.bots$, { initialValue: [] });
        this.bullets = toSignal(this.botService.bullets$, { initialValue: [] });

        effect(() => {
            this.renderCanvas(this.bots(), this.bullets());
        });
    }

    onCanvasMouse(evt: MouseEvent, canvas: HTMLCanvasElement) {
        if (!DEBUG.enabled) {
            return;
        }
        const rect = canvas.getBoundingClientRect();

        // translate to 2D Cartesian coordinate system
        DEBUG.mousePosition = {
            x: ((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
            y: ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
        };
    }

    private renderCanvas(bots: BotsUpdate, bullets: BulletsUpdate): void {
        const ctx = this.getCanvasContext();
        this.clearCanvas(ctx);

        if (DEBUG.enabled) {
            this.renderDebugCanvas();
            this.renderMousePosition(ctx);
        }

        this.canvasService.updateBots(bots, ctx);
        this.canvasService.updateBullets(bullets, ctx);
    }

    private renderDebugCanvas(): void {
        if (DEBUG.enabled) {
            const debugCtx = this.getDebugCanvasContext();
            if (DEBUG.gridInit) {
                return;
            }
            this.renderGrid(debugCtx);
        }
    }

    private getCanvasContext(): CanvasRenderingContext2D {
        const ctx = this.canvasRef()?.nativeElement.getContext("2d");
        if (ctx) {
            return ctx;
        }
        throw new Error("Could not get canvas context");
    }

    private getDebugCanvasContext(): CanvasRenderingContext2D {
        const ctx = this.debugCanvasRef()?.nativeElement.getContext("2d");
        if (ctx) {
            return ctx;
        }
        throw new Error("Could not get debug canvas context");
    }

    private renderGrid(ctx: CanvasRenderingContext2D) {
        const GRID_WIDTH = 25;
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;

        ctx.lineWidth = 1;
        ctx.strokeStyle = "#FFF";

        ctx.beginPath();
        for (let step = 0; step < width; step += GRID_WIDTH) {
            ctx.moveTo(step, 0);
            ctx.lineTo(step, height);

            ctx.moveTo(0, step);
            ctx.lineTo(height, step);
        }

        ctx.stroke();
        ctx.closePath();
        DEBUG.gridInit = true;
    }

    private clearCanvas(ctx: CanvasRenderingContext2D, preserveTransform = false) {
        if (preserveTransform) {
            // Store the current transformation matrix
            ctx.save();
            // Use the identity matrix while clearing the canvas
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        if (preserveTransform) {
            // Restore the transform
            ctx.restore();
        }
    }

    private renderMousePosition(ctx: CanvasRenderingContext2D) {
        const mousePos = DEBUG.mousePosition;

        // translate to 2D Cartesian coordinate system
        const x = Math.floor(mousePos.x);
        const y = Math.floor(ctx.canvas.height - mousePos.y);
        const mousePosText = `x: ${x}, y: ${y}`;
        const tooltipOffest = 25;
        ctx.font = "15px serif";
        ctx.fillStyle = "#000000";
        ctx.fillText(mousePosText, mousePos.x, mousePos.y - tooltipOffest);
    }
}
