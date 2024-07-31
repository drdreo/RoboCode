import { CommonModule } from "@angular/common";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { UploadComponent } from "./upload/upload.component";

@NgModule({
    imports: [CommonModule, UploadComponent],
    providers: [provideHttpClient(withInterceptorsFromDi())],
    exports: [UploadComponent],
})
export class UiModule {}
