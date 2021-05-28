import { Controller, UploadedFile, Post, UseInterceptors, Body, Logger } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { CodeService } from '../code/code.service';

@Controller('upload')
export class UploadController {


  private logger = new Logger('UploadController');

  constructor(private codeService: CodeService) {}

  @Post('code')
  @UseInterceptors(FileInterceptor('code'))
  uploadFile(@Body() body, @UploadedFile() file: Express.Multer.File) {
    this.logger.verbose('Code File upload: ' + file.originalname);
    this.logger.debug(file);

    this.codeService.registerFile(file.filename);


    return {
      name: file.originalname,
      size: file.size
    };
  }
}
