import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { BotsUpdate } from "@robo-code/shared";
import * as fs from 'fs';
import * as rimraf from 'rimraf';

import { Juker } from '../robot/Juker';
import { Robot } from '../robot/Robot';
import { SittingDuck } from '../robot/SittingDuck';
import { Spinner } from "../robot/Spinner";
import { SimulationService } from '../simulation.service';
import { Compiler } from './compiler';

const FILE_FOLDER = 'assets/upload/';


@Injectable()
export class CodeService implements OnApplicationBootstrap {
    files: string[] = [];
    code: any[] = [];
    bots: Robot[] = [];

    compiler = new Compiler();

    private logger = new Logger('CodeService');

    constructor(private simulationService: SimulationService) {
        this.bots = [];
        this.registerBot(new SittingDuck());
        this.registerBot(new Spinner());
        this.registerBot(new Juker());

        this.simulationService.tick$.subscribe(() => {
            try {
                this.bots.forEach((bot) => bot.tick());
            } catch (e) {
                console.error(e);
                throw new Error('Error during Bot tick!');
            }
        });
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
        this.registerBot(new runable());
    }

    registerBot(bot: any) {
        const robot = new Robot(bot);
        robot.actualBot.shoot = () => this.simulationService.shootBullet(robot);
        robot.actualBot.forward = (amount) => robot.forward(amount);
        robot.actualBot.backward = (amount) => robot.backward(amount);
        robot.actualBot.turn = (amount) => robot.turn(amount);
        robot.actualBot.getX = () => robot.x;
        robot.actualBot.getY = () => robot.y;

        this.bots.push(robot);
    }

    private clearAllFiles() {
        rimraf.default(FILE_FOLDER + '/*', () => {
            this.logger.log(`Cleared folder ${FILE_FOLDER}!`);
        });
    }

    getBotUpdate(): BotsUpdate {
        return this.bots.reduce((prev, bot) => {
            prev.push(bot.getData());
            return prev;
        }, []);
    }
}
