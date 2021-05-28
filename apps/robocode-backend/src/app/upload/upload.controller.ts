import { Controller, UploadedFile, Post, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('upload')
export class UploadController {

  @Post('code')
  @UseInterceptors(FileInterceptor('code'))
  uploadFile(@Body() body, @UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return {
      body,
      file
    };
  }
}
