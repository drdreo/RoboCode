import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BotService } from '../bot.service';

@Component({
    selector: 'rc-arena-canvas',
    templateUrl: './arena-canvas.component.html',
    styleUrls: ['./arena-canvas.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArenaCanvasComponent implements OnInit {
    constructor(public botService: BotService) {}

    ngOnInit(): void {}
}
