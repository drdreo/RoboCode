import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { ManualInputCommand, ManualInputData, SocketEvents } from "@robo-code/shared";
import { Socket } from "ngx-socket-io";

@Injectable({ providedIn: "root" })
export class ManualControlService {
    activeCommands: Set<ManualInputCommand> = new Set();
    private readonly http = inject(HttpClient);
    private readonly socket = inject(Socket);

    spawnManualRobot() {
        return firstValueFrom(this.http.post<void>("/api/bot/spawn", {}));
    }

    addCommand(cmd: ManualInputCommand) {
        this.activeCommands.add(cmd);
        this.sendManualInputCommands();
    }

    removeCommand(cmd: ManualInputCommand) {
        this.activeCommands.delete(cmd);
        this.sendManualInputCommands();
    }

    private sendManualInputCommands() {
        this.socket.emit(SocketEvents.ManualInput, { commands: [...this.activeCommands] } as ManualInputData);
        this.activeCommands.clear();
    }
}
