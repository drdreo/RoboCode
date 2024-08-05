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

    @HostListener("document:keydown.w")
    private onWPress() {
        this.manualControlService.addCommand("forwards");
    }

    @HostListener("document:keyup.w")
    private onWRelease() {
        this.manualControlService.removeCommand("forwards");
    }

    @HostListener("document:keydown.d")
    private onDPress() {
        this.manualControlService.addCommand("right");
    }

    @HostListener("document:keyup.d")
    private onDRelease() {
        this.manualControlService.removeCommand("right");
    }

    @HostListener("document:keydown.a")
    private onAPress() {
        this.manualControlService.addCommand("left");
    }

    @HostListener("document:keyup.a")
    private onARelease() {
        this.manualControlService.removeCommand("left");
    }

    @HostListener("document:keydown.s")
    private onSPress() {
        this.manualControlService.addCommand("backwards");
    }

    @HostListener("document:keyup.a")
    private onSRelease() {
        this.manualControlService.removeCommand("backwards");
    }

    @HostListener("document:keyup.space")
    private onSpaceRelease() {
        this.manualControlService.addCommand("shoot");
    }
}
