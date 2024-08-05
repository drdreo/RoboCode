import { RobotEntity } from "./robot.entity";
import { Vector } from "@robo-code/utils";
import { ManualInputCommand } from "@robo-code/shared";

export class ManualRobotEntity extends RobotEntity {
    activeCommands: ManualInputCommand[] = [];

    constructor(id: string, position?: Vector) {
        super(id, { name: "ManualBot" }, position);
    }

    override tick() {
        for (const command of this.activeCommands) {
            switch (command) {
                case "forwards":
                    this.forward(1);
                    break;
                case "backwards":
                    this.backward(1);
                    break;
                case "left":
                    this.turn(-10);
                    break;
                case "right":
                    this.turn(10);
                    break;
                case "shoot":
                    // not worth to change the event flow for this. Shooting is intercepted outside
                    break;
                default:
                    console.error("WTF is this command?", command);
                    break;
            }
        }

        this.activeCommands = [];
    }
}
