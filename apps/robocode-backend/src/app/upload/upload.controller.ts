import { Controller, UploadedFile, Post, UseInterceptors, Body, Logger } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { CodeService } from '../code/code.service';


class Helper {
  static customFileName(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    let fileExtension = "";
    if(file.mimetype.indexOf("ts") > -1){
      fileExtension = "ts"
    }else if(file.mimetype.indexOf("js") > -1){
      fileExtension = "js";
    }
    const originalName = file.originalname.split(".")[0];
    cb(null, originalName + '-' + uniqueSuffix+"."+fileExtension);
  }

  static destinationPath(req, file, cb) {
    cb(null, 'assets/upload')
  }
}


@Controller('upload')
export class UploadController {


  private logger = new Logger('UploadController');

  constructor(private codeService: CodeService) {}

  @Post('code')
  @UseInterceptors(
    FileInterceptor('code', {
      storage: diskStorage({
        destination: Helper.destinationPath,
        filename: Helper.customFileName,
      }),
    }),
  )
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
