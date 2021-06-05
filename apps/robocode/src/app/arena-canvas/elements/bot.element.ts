import { Logger } from '@robo-code/utils';
import { CanvasElement, NgCanvasElement, NgCanvas } from 'angular-canvas';

@CanvasElement({
  selector: 'rc-bot'
})
export class BotElement implements NgCanvasElement {


  public parent!: NgCanvas;

  public x = 0;
  public y = 0;
  public rotation = 0;

  private height = 50;
  private width = 30;

  private logger = new Logger('BotElement');

  setNgProperty(name: string, value: unknown): void {
    this.logger.verbose(`BackgroundElement[setNgProperty][${ name }]`);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this[name] = value;

    // redraw all element in one canvas context after set ng property
    this.parent.drawAll();
  }

  draw(context: CanvasRenderingContext2D, time: number): void {
    this.logger.debug('draw');

    const originX = this.x + this.width / 2;
    const originY = this.y + this.height / 2;

    context.translate(originX, originY);
    context.rotate(-this.rotation * Math.PI / 180);
    context.translate(-originX, -originY);

    this.drawWheels(context);
    this.drawBody(context);
    this.drawGun(context);

    // Reset transformation matrix to the identity matrix
    context.setTransform(1, 0, 0, 1, 0, 0);
  }

  private drawBody(context: CanvasRenderingContext2D) {
    context.fillStyle = '#5a5a9f';
    context.fillRect(this.x, this.y, this.width, this.height);
  }

  private drawWheels(context: CanvasRenderingContext2D) {
    const radius = this.width / 6;
    context.beginPath();
    context.fillStyle = 'black';
    context.arc(this.x, this.y, radius, 0, 2 * Math.PI);
    context.fillRect(this.x - radius, this.y, radius, this.height);
    context.arc(this.x + this.width, this.y, radius, 0, 2 * Math.PI);
    context.arc(this.x, this.y + this.height, radius, 0, 2 * Math.PI);
    context.fillRect(this.x + this.width, this.y, radius, this.height);
    context.arc(this.x + this.width, this.y + this.height, radius, 0, 2 * Math.PI);
    context.fill();
  }

  private drawGun(context: CanvasRenderingContext2D) {
    const radius = this.width / 4;
    const gunWidth = radius / 2;
    const gunHeight = this.height - 10;

    context.beginPath();
    context.fillStyle = '#63a5ef';
    context.arc(this.x + this.width / 2, this.y + this.height / 2, radius, 0, 2 * Math.PI);
    context.fillRect(this.x + this.width / 2 - gunWidth / 2, this.y - 10, gunWidth, gunHeight);
    context.fill();

  }
}
