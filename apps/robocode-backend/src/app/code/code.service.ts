import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import * as fs from 'fs';
import * as rimraf from 'rimraf';
import * as typescript from 'typescript';
import { Bot } from '../robot/Robot';
import { SittingDuck } from '../robot/SittingDuck';

const FILE_FOLDER = 'assets/upload/';

@Injectable()
export class CodeService implements OnApplicationBootstrap {

  files: string[] = [];
  code: any[] = [];
  bots: Bot[] = [];

  private logger = new Logger('CodeService');

  constructor() {

    this.bots = [
      new SittingDuck(),
      new SittingDuck(),
      new SittingDuck()
    ];

    setInterval(() => {
      this.bots[0].forward(100);
    }, 50);

  }

  onApplicationBootstrap() {
    this.clearAllFiles();
  }

  async registerFile(fileName: string) {
    this.files.push(fileName);
    this.logger.log('Loading - ' + fileName);

    let source;
    try {
      source = await fs.promises.readFile(FILE_FOLDER + fileName, 'utf-8');
    } catch (e) {
      this.logger.error(e);
      throw new Error('Could not read file!');
    }

    await this.registerCode(source);
  }

  async registerCode(source: string) {
    this.logger.log('Registering code!');

    let runable;
    try {
      const base = await fs.promises.readFile('apps/robocode-backend/src/app/robot/Robot.ts', 'utf-8');
      const code = typescript.transpile(base + source);
      this.logger.debug(code);
      runable = eval(code);
    } catch (e) {
      this.logger.error(e);
      throw new Error('Could not read file!');
    }

    if (!runable) {
      throw Error('No runable code found. Did you forget to export your class?');
    }

    this.code.push(new runable());
  }

  private clearAllFiles() {
    rimraf(FILE_FOLDER + '/*', () => { this.logger.log(`Cleared folder ${ FILE_FOLDER }!`); });
  }

}
