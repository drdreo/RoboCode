import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { ArenaCanvasComponent } from "./arena-canvas/arena-canvas.component";
import { UploadComponent } from "../../../../libs/ui/src/lib/upload/upload.component";

@Component({
    selector: "rc-root",
    templateUrl: "./app.component.html",
    standalone: true,
    imports: [UploadComponent, ArenaCanvasComponent],
})
export class AppComponent {
    constructor(private http: HttpClient) {}

    async test() {
        console.log("test");
        await this.http.get("/api").toPromise();
    }
}
