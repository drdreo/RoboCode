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

    spawnManualRobot() {
        this.manualControlService.spawnManualRobot();
    }

    @HostListener("window:keydown.w")
    private onWPress() {
        this.manualControlService.addCommand("forwards");
    }

    @HostListener("window:keyup.w")
    private onWRelease() {
        this.manualControlService.removeCommand("forwards");
    }

    @HostListener("window:keydown.d", ["$event"])
    private onDPress(e: Event) {
        this.manualControlService.addCommand("right");
    }

    @HostListener("window:keyup.d")
    private onDRelease() {
        this.manualControlService.removeCommand("right");
    }

    @HostListener("window:keydown.a")
    private onAPress() {
        this.manualControlService.addCommand("left");
    }

    @HostListener("window:keyup.a")
    private onARelease() {
        this.manualControlService.removeCommand("left");
    }

    @HostListener("window:keydown.s")
    private onSPress() {
        this.manualControlService.addCommand("backwards");
    }

    @HostListener("window:keyup.a")
    private onSRelease() {
        this.manualControlService.removeCommand("backwards");
    }

    @HostListener("window:keyup.space", ["$event"])
    private onSpaceRelease(e: Event) {
        e.preventDefault();
        this.manualControlService.addCommand("shoot");
    }
}
