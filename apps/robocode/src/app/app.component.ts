import { ChangeDetectionStrategy, Component, model } from "@angular/core";
import { ArenaCanvasComponent } from "./arena-canvas/arena-canvas.component";
import { CodeUploadComponent } from "./code-upload/code-upload.component";
import { FormsModule } from "@angular/forms";

@Component({
    selector: "rc-root",
    templateUrl: "./app.component.html",
    standalone: true,
    imports: [CodeUploadComponent, ArenaCanvasComponent, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
        `
            :host {
                display: grid;
                grid-template-areas:
                    "title title"
                    "arena upload";
            }

            .title {
                grid-area: title;
            }

            rc-arena-canvas {
                grid-area: arena;
            }

            rc-code-upload {
                grid-area: upload;
            }
        `,
    ],
})
export class AppComponent {
    zoom = model<number>(1);
}
