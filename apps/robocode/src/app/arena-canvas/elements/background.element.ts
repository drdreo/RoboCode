import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Logger } from '@robo-code/utils';

@Component({
    selector: 'rc-background',
    templateUrl: './background.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgroundElement {
    private logger = new Logger('BackgroundElement');
}
