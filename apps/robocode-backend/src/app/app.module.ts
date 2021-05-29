import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CodeService } from './code/code.service';
import { BotGateway } from './robot/bot.gateway';
import { UploadController } from './upload/upload.controller';


@Module({
  imports: [
    MulterModule.register({
      dest: 'assets/upload'
    })
  ],
  controllers: [AppController, UploadController],
  providers: [AppService, CodeService, BotGateway]
})
export class AppModule {}
