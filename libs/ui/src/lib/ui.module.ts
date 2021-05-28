import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { UploadComponent } from './upload/upload.component';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  declarations: [
    UploadComponent
  ],
  exports: [UploadComponent]
})
export class UiModule {}
