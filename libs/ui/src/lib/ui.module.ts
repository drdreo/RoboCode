import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { UploadComponent } from './upload/upload.component';

@NgModule({ declarations: [
        UploadComponent
    ],
    exports: [UploadComponent], imports: [CommonModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class UiModule {}
