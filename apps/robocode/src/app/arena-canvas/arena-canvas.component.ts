import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ARENA_SIZE, BotsUpdate, BulletsUpdate } from "@robo-code/shared";
import { Subject, takeUntil, withLatestFrom } from "rxjs";
import { BotService } from '../bot.service';
import { CanvasService } from './canvas.service';


@Component({
    selector: 'rc-arena-canvas',
    templateUrl: './arena-canvas.component.html',
    styleUrls: [ './arena-canvas.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArenaCanvasComponent implements AfterViewInit, OnDestroy {

    @ViewChild('arenaCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
    @ViewChild('debugCanvas') debugCanvasRef!: ElementRef<HTMLCanvasElement>;
    DEBUG = {
        enabled: true,
        gridInit: false,
        mousePosition: {
            x: 0,
            y: 0
        }
    };

    protected readonly ARENA_SIZE = ARENA_SIZE;
    private unsubscribe$ = new Subject<void>();

    constructor(public botService: BotService, private canvasService: CanvasService) {

    }

    ngAfterViewInit(): void {
        this.botService.bots$
            .pipe(
                withLatestFrom(this.botService.bullets$),
                takeUntil(this.unsubscribe$))
            .subscribe(([ bots, bullets ]) => {
                this.renderCanvas(bots, bullets);
            });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    onCanvasMouse(evt: MouseEvent, canvas: HTMLCanvasElement) {
        if (!this.DEBUG.enabled) {
            return;
        }
        const rect = canvas.getBoundingClientRect();
        this.DEBUG.mousePosition = {
            x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
            y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
        };
    }

    private renderCanvas(bots: BotsUpdate, bullets: BulletsUpdate): void {
        const ctx = this.getCanvasContext();
        this.clearCanvas(ctx);

        if (this.DEBUG.enabled) {
            this.renderDebugCanvas();
            this.renderPosition(ctx);
        }

        this.canvasService.updateBots(bots, ctx);
        this.canvasService.updateBullets(bullets, ctx);
    }

    private renderDebugCanvas(): void {
        if (this.DEBUG.enabled) {
            const debugCtx = this.getDebugCanvasContext();
            if (this.DEBUG.gridInit) {
                return;
            }
            this.renderGrid(debugCtx);
        }
    }

    private getCanvasContext(): CanvasRenderingContext2D {
        const ctx = this.canvasRef.nativeElement.getContext('2d');
        if (ctx) {
            return ctx;
        }
        throw new Error('Could not get canvas context')
    }

    private getDebugCanvasContext(): CanvasRenderingContext2D {
        const ctx = this.debugCanvasRef.nativeElement.getContext('2d');
        if (ctx) {
            return ctx;
        }
        throw new Error('Could not get debug canvas context')
    }

    private renderGrid(ctx: CanvasRenderingContext2D) {
        const GRID_WIDTH = 25;
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;

        ctx.lineWidth = 1;
        ctx.strokeStyle = "#FFF";

        ctx.beginPath();
        for (let x = 0; x < width; x += GRID_WIDTH) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);

            ctx.moveTo(0, x);
            ctx.lineTo(height, x);
        }

        ctx.stroke();
        ctx.closePath();
        this.DEBUG.gridInit = true;
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

    private renderPosition(ctx: CanvasRenderingContext2D) {
        const mousePos = this.DEBUG.mousePosition;
        const mousePosText = `x: ${ Math.floor(mousePos.x) }, y: ${ Math.floor(mousePos.y) }`;
        const tooltipOffest = 25;
        ctx.font = "15px serif";
        ctx.fillStyle = "#000000";
        ctx.fillText(mousePosText, mousePos.x, mousePos.y - tooltipOffest);
    }

}
