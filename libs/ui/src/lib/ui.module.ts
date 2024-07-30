import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { UploadComponent } from './upload/upload.component';

@NgModule({
    exports: [UploadComponent], imports: [CommonModule, UploadComponent], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class UiModule {}
