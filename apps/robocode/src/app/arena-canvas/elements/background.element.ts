import { Logger } from '@robo-code/utils';
import { CanvasElement, NgCanvasElement, NgCanvas } from 'angular-canvas';

@CanvasElement({
  selector: 'rc-background'
})
export class BackgroundElement implements NgCanvasElement {

  public parent!: NgCanvas;
  public src!: string;

  private logger = new Logger('BackgroundElement');

  setNgProperty(name: string, value: any): void {
    this.logger.verbose(`BackgroundElement[setNgProperty][${name}]`);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this[name] = value;
    this.parent.drawAll();
  }

  draw(context: CanvasRenderingContext2D, time: number): void {
    const img = new Image(this.parent.width, this.parent.height);
    img.onload = () => {
      this.logger.verbose('loaded');
      context.drawImage(img, 0, 0); // Or at whatever offset you like
    };
    img.src = this.src;
  }
}
