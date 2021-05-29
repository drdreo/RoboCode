import { Injectable, Logger } from '@nestjs/common';

import { CodeService } from './code/code.service';
import { BotGateway } from './robot/bot.gateway';

@Injectable()
export class AppService {

  private logger = new Logger('AppService');

  constructor(private codeService: CodeService) {}

  async fetchFiles() {
    this.logger.log('Fetching files...');
    // this.codeService.files.forEach(async fileName => {
    //   this.logger.log('Loading - ' + fileName);
    //   const source = await fs.promises.readFile('assets/upload/' + fileName, 'utf-8');
    //   const code = typescript.transpile(source);
    //   const runable = eval(code);
    //
    //   this.codeService.registerCode(new runable());
    // });


    this.codeService.code.forEach(code => {
      code.run();
    });
  }
}
