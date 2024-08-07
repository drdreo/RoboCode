import { HttpClient, HttpEventType } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, Input, signal } from "@angular/core";
import { Subject } from "rxjs";
import { finalize, takeUntil } from "rxjs/operators";

@Component({
    selector: "ui-upload",
    templateUrl: "./upload.component.html",
    styleUrls: ["./upload.component.scss"],
    standalone: true,
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadComponent {
    @Input() requiredFileType?: string;

    fileName = signal("");
    uploadProgress = signal<number | undefined>(undefined);

    private unsubscribe$ = new Subject<void>();

    constructor(private http: HttpClient) {}

    onFileSelected(event: any) {
        const file: File = event.target?.files[0];
        if (file) {
            this.fileName.set(file.name);
            const formData = new FormData();
            formData.append("code", file);

            const upload$ = this.http
                .post("/api/upload/code", formData, {
                    reportProgress: true,
                    observe: "events",
                })
                .pipe(finalize(() => this.reset()));

            upload$.pipe(takeUntil(this.unsubscribe$)).subscribe((event) => {
                console.log(event);
                if (event.type == HttpEventType.UploadProgress) {
                    if (event.total) {
                        this.uploadProgress.set(Math.round(100 * (event.loaded / event.total)));
                    } else {
                        console.warn("No total size");
                    }
                }
            });
        }
    }

    cancelUpload() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
        this.reset();
    }

    reset() {
        this.uploadProgress.set(undefined);
    }
}
