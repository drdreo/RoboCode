import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { UiModule } from "@robo-code/ui";

@Component({
    selector: "rc-code-upload",
    standalone: true,
    imports: [CommonModule, UiModule],
    templateUrl: "./code-upload.component.html",
    styleUrl: "./code-upload.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeUploadComponent {
    private http = inject(HttpClient);

    async test() {
        console.log("test");
        await this.http.get("/api").toPromise();
    }
}
