import { Logger } from '@robo-code/utils';
import { CanvasElement, NgCanvasElement, NgCanvas } from 'angular-canvas';

@CanvasElement({
  selector: 'rc-bot'
})
export class BotElement implements NgCanvasElement {


  public parent!: NgCanvas;

  public x = 0;
  public y = 0;

  private height = 100;
  private width = 50;

  private logger = new Logger('BotElement');

  setNgProperty(name: string, value: any): void {
    this.logger.verbose(`BackgroundElement[setNgProperty][${ name }]`);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this[name] = value;

    // redraw all element in one canvas context after set ng property
    this.parent.drawAll();
  }

  draw(context: CanvasRenderingContext2D, time: number): void {
    this.logger.debug('draw');
    context.beginPath();
    this.drawWheels(context);
    context.fillStyle = '#2c2c54';
    context.fillRect(this.x, this.y, this.width, this.height);
  }

  private drawWheels(context: CanvasRenderingContext2D) {
    const radius = this.width / 3;

    context.fillStyle = 'black';
    context.ellipse(this.x, this.y, radius / 2, radius, 0, 0, 2 * Math.PI);
    context.ellipse(this.x + this.width, this.y, radius / 2, radius, 0, 0, 2 * Math.PI);
    context.ellipse(this.x, this.y + this.height, radius / 2, radius, 0, 0, 2 * Math.PI);
    context.ellipse(this.x + this.width, this.y + this.height, radius / 2, radius, 0, 0, 2 * Math.PI);
    context.fill();
  }

}
