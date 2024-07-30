import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Logger } from "@robo-code/utils";

@Component({
    selector: "rc-background",
    templateUrl: "./background.component.html",
    styles: [
        `
            :host {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }

            img {
                width: 100%;
                height: 100%;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class BackgroundComponent {
    private logger = new Logger("BackgroundElement");
}
