export class Juker {

  name = 'Juker';

  origPos;
  forwards = true;

  tick() {
    console.log('tick', this.getX());
    if (!this.origPos) {
      this.origPos = this.getX();
    }

    if (this.origPos + 20 < this.getX()) {
      this.forwards = false;
      this.shoot();
    } else if (this.origPos - 40 > this.getX()) {
      this.forwards = true;
      this.shoot();
    }
    if (this.forwards) {
      this.forward(10);
      this.turn(15);
    } else {
      this.backward(10);
      this.turn(-15);
    }

  }
}
