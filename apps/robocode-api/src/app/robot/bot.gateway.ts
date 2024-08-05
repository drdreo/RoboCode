import { Logger } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { ManualInputData, SocketEvents } from "@robo-code/shared";
import { Server } from "socket.io";
import { CodeService } from "../code/code.service";
import { SimulationService } from "../engine/simulation.service";

@WebSocketGateway()
export class BotGateway {
    @WebSocketServer() server: Server;

    private logger = new Logger("BotGateway");

    constructor(
        private codeService: CodeService,
        private simulationService: SimulationService,
    ) {
        this.simulationService.tick$.subscribe(() => {
            this.sendBotsUpdate();
            this.sendBulletsUpdate();
        });
    }

    public sendToAll(event: string, data?: any) {
        // this.logger.debug(event);
        this.server.emit(event, data);
    }

    public sendBotsUpdate() {
        this.sendToAll(SocketEvents.BotsUpdate, this.simulationService.getBotUpdate());
    }

    public sendBulletsUpdate() {
        this.sendToAll(SocketEvents.BulletsUpdate, this.simulationService.getActiveBullets());
    }

    @SubscribeMessage(SocketEvents.ManualInput)
    handleMessage(client: any, { commands }: ManualInputData) {
        if (!this.simulationService.manualBot) {
            return;
        }
        this.simulationService.manualBot.activeCommands = commands;
    }
}
