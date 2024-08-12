import {
    ChangeDetectionStrategy,
    Component,
    effect,
    ElementRef,
    inject,
    model,
    Signal,
    signal,
    viewChild,
} from "@angular/core";
import { ARENA_SIZE, BotsUpdate, BulletsUpdate, Position } from "@robo-code/shared";
import { BotService } from "../bot.service";
import { DEBUG } from "../settings";
import { CanvasService } from "./canvas.service";
import { AsyncPipe, DecimalPipe, NgOptimizedImage } from "@angular/common";
import { toSignal } from "@angular/core/rxjs-interop";
import { HotkeyService, UiModule } from "@robo-code/ui";

@Component({
    selector: "rc-arena-canvas",
    templateUrl: "./arena-canvas.component.html",
    styleUrls: ["./arena-canvas.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [AsyncPipe, DecimalPipe, NgOptimizedImage, UiModule],
})
export class ArenaCanvasComponent {
    canvasRef = viewChild<ElementRef<HTMLCanvasElement>>("arenaCanvas");
    debugCanvasRef = viewChild<ElementRef<HTMLCanvasElement>>("debugCanvas");
    backgroundImageRef = viewChild<ElementRef<HTMLImageElement>>("backgroundImage");

    bots: Signal<BotsUpdate>;
    bullets: Signal<BulletsUpdate>;

    zoom = model<number>(1);
    protected readonly DEBUG = DEBUG;
    protected readonly ARENA_SIZE = ARENA_SIZE;
    private zoomHotkey = signal(false);
    private mousePosition = signal<Position>({ x: 0, y: 0 });
    private previousMousePosition: Position | undefined;
    private readonly botService = inject(BotService);
    private readonly canvasService = inject(CanvasService);
    private readonly hotkeyService = inject(HotkeyService);

    constructor() {
        this.bots = toSignal(this.botService.bots$, { initialValue: [] });
        this.bullets = toSignal(this.botService.bullets$, { initialValue: [] });

        effect(() => {
            this.canvasService.zoomCanvas(this.zoom(), this.mousePosition());

            this.renderCanvas(this.bots(), this.bullets(), this.mousePosition());
        });
    }

    onCanvasMouse(evt: MouseEvent, canvas: HTMLCanvasElement) {
        const rect = canvas.getBoundingClientRect();

        // translate to 2D Cartesian coordinate system
        this.mousePosition.set({
            x: ((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
            y: ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
        });

        const currentPosition = this.mousePosition();

        // buttons:1 --> left mouse button
        if (evt.buttons === 1 && this.previousMousePosition) {
            const delta = {
                x: currentPosition.x - this.previousMousePosition.x,
                y: currentPosition.y - this.previousMousePosition.y,
            };
            this.canvasService.panCanvas(delta);
        }

        this.previousMousePosition = currentPosition;
    }

    onCanvasWheel(evt: WheelEvent) {
        const hotkeyEnabled = this.zoomHotkey();
        if (hotkeyEnabled) {
            const zoomValue = this.zoom() + -evt.deltaY / 1000;
            if (zoomValue > 0) {
                this.zoom.set(zoomValue);
            }
        }
    }

    onZoomHotkey(evt: Event) {
        evt.preventDefault();
        this.zoomHotkey.set(true);
    }

    onZoomHotkeyUp(evt: Event) {
        evt.preventDefault();
        this.zoomHotkey.set(false);
    }

    onZoomReset() {
        this.zoom.set(1);
        this.canvasService.resetPan();
    }

    private renderCanvas(bots: BotsUpdate, bullets: BulletsUpdate, mousePosition: Position): void {
        const ctx = this.getCanvasContext();
        this.canvasService.clearCanvas(ctx);
        this.canvasService.applyViewportTransformation(ctx);
        this.canvasService.drawBackground(ctx, this.backgroundImageRef()?.nativeElement);

        if (DEBUG.enabled) {
            this.canvasService.drawDebugCanvas(ctx);
        }

        this.canvasService.renderBots(ctx, bots);
        this.canvasService.renderBullets(ctx, bullets);

        if (DEBUG.enabled) {
            this.canvasService.renderMousePosition(ctx, mousePosition);
        }

        ctx.restore();
    }

    private getCanvasContext(): CanvasRenderingContext2D {
        const ctx = this.canvasRef()?.nativeElement.getContext("2d");
        if (ctx) {
            return ctx;
        }
        throw new Error("Could not get canvas context");
    }
}
