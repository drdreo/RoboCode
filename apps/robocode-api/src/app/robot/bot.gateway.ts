import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CodeService } from '../code/code.service';

@WebSocketGateway()
export class BotGateway {
    @WebSocketServer() server: Server;

    private logger = new Logger('BotGateway');

    constructor(private codeService: CodeService) {
        setInterval(() => {
            this.sendBotsUpdate();
        }, 30);
    }

    public sendToAll(event: string, data?: any) {
        this.server.emit(event, data);
    }

    public sendBotsUpdate() {
        this.logger.debug('bots:update');
        this.sendToAll('bots:update', this.codeService.getBotUpdate());
    }

    @SubscribeMessage('message')
    handleMessage(client: any, payload: any): string {
        return 'Hello world!';
    }
}
