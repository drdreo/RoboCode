import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import * as fs from 'fs';
import * as rimraf from 'rimraf';

import { Juker } from '../robot/Juker';
import { SittingDuck } from '../robot/SittingDuck';
import { Spinner } from "../robot/Spinner";
import { SimulationService } from '../simulation.service';
import { Compiler } from './compiler';

const FILE_FOLDER = 'assets/upload/';


@Injectable()
export class CodeService implements OnApplicationBootstrap {
    files: string[] = [];
    code: any[] = [];

    compiler = new Compiler();

    private logger = new Logger('CodeService');

    constructor(private simulationService: SimulationService) {
        // for debaggeri
        this.simulationService.registerBot(new SittingDuck());
        this.simulationService.registerBot(new Spinner());
        // this.simulationService.registerBot(new Juker());
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
            runable = this.compiler.getCode(source);
        } catch (e) {
            this.logger.error(e);
            throw new Error('Could not compile file!');
        }

        if (!runable || !runable.constructor) {
            throw Error('No runable code found. Did you forget to export your class?');
        }


        console.log(runable);
        this.simulationService.registerBot(new runable());
    }

    private clearAllFiles() {
        rimraf.default(FILE_FOLDER + '/*', () => {
            this.logger.log(`Cleared folder ${FILE_FOLDER}!`);
        });
    }
}
