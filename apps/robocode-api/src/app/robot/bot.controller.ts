import { Controller, Post } from "@nestjs/common";
import { SimulationService } from "../engine/simulation.service";

@Controller("bot")
export class BotController {
    constructor(private readonly simulationService: SimulationService) {}

    @Post("spawn")
    spawnBot() {
        this.simulationService.registerManualBot();
    }
}
