import { ChangeDetectionStrategy, Component, HostListener, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ManualControlService } from "./manual-control.service";

@Component({
    selector: "rc-manual-controls",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./manual-controls.component.html",
    styleUrl: "./manual-controls.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManualControlsComponent {
    private readonly manualControlService = inject(ManualControlService);
    private keys: { [key: string]: boolean } = {};

    spawnManualRobot() {
        this.manualControlService.spawnManualRobot();
    }

    @HostListener("window:keydown", ["$event"])
    onKeyDown(event: KeyboardEvent) {
        console.log(event);
        this.keys[event.key.toLowerCase()] = true;
        this.updateCommands();
    }

    @HostListener("window:keyup", ["$event"])
    onKeyUp(event: KeyboardEvent) {
        console.log(event);
        this.keys[event.key.toLowerCase()] = false;
        this.updateCommands();
    }

    @HostListener("window:keyup.space", ["$event"])
    private onSpaceRelease(e: Event) {
        e.preventDefault();
        this.manualControlService.addCommand("shoot");
    }

    private updateCommands() {
        if (this.keys["w"]) {
            this.manualControlService.addCommand("forwards");
        } else {
            this.manualControlService.removeCommand("forwards");
        }

        if (this.keys["s"]) {
            this.manualControlService.addCommand("backwards");
        } else {
            this.manualControlService.removeCommand("backwards");
        }

        if (this.keys["d"]) {
            this.manualControlService.addCommand("right");
        } else {
            this.manualControlService.removeCommand("right");
        }

        if (this.keys["a"]) {
            this.manualControlService.addCommand("left");
        } else {
            this.manualControlService.removeCommand("left");
        }

        if (this.keys[" "]) {
            this.manualControlService.addCommand("shoot");
        } else {
            this.manualControlService.removeCommand("shoot");
        }

        console.log(this.keys);
    }
}
