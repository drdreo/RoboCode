import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CodeService } from '../code/code.service';

@WebSocketGateway()
export class BotGateway {
  @WebSocketServer() server: Server;

  constructor(private codeService: CodeService) {
    setInterval(() => {
      console.log('sending to all!');
      this.sendToAll('bots:update', this.codeService.bots);
    }, 16);
  }

  public sendToAll(event: string, data?: any) {
    this.server.emit(event, data);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
