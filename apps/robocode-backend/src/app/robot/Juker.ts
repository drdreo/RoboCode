import { Bot } from './Robot';


export class Juker extends Bot {

  name = 'Juker';

  origPos;
  forwards = true;

  tick() {

    if (!this.origPos) {
      this.origPos = this.x;
    }

    if (this.origPos + 20 < this.x) {
      this.forwards = false;
    } else if (this.origPos - 40 > this.x) {
      this.forwards = true;
    }
    if (this.forwards) {
      console.log('forward - ' + this.origPos + this.toString());
      this.forward(10);
    } else {

      console.log('backward - ' + this.origPos + this.toString());
      this.backward(10);
    }

  }
}
