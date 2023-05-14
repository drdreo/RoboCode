import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { SocketEvents } from "@robo-code/shared";
import { Server } from 'socket.io';
import { CodeService } from '../code/code.service';
import { SimulationService } from "../simulation.service";


@WebSocketGateway()
export class BotGateway {
    @WebSocketServer() server: Server;

    private logger = new Logger('BotGateway');

    constructor(private codeService: CodeService, private simulationService: SimulationService) {
        this.simulationService.tick$.subscribe(() => {
            this.sendBotsUpdate();
            this.sendBulletsUpdate();
        });
    }

    public sendToAll(event: string, data?: any) {
        this.logger.debug(event);
        this.server.emit(event, data);
    }

    public sendBotsUpdate() {
        this.sendToAll(SocketEvents.BotsUpdate, this.codeService.getBotUpdate());
    }

    public sendBulletsUpdate() {
        this.sendToAll(SocketEvents.BulletsUpdate, this.simulationService.getActiveBullets());
    }

    @SubscribeMessage('message')
    handleMessage(client: any, payload: any): string {
        return 'Hello world!';
    }
}
