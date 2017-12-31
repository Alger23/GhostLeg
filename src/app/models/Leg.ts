import * as createjs from 'createjs-module';

export class Leg {
  id: number;
  startId: any;
  startText: string;
  endId: any;
  endText: string;
  container: createjs.Container;
  shapeCommands: { [id: string]: any } = {};
  bounds: { x: number; y: number; w: number; h: number };
  constructor(id: any) {
    this.id = id;
    this.bounds = { x: 0, y: 0, w: 10, h: 10 };
  }

  createShapes(stage: createjs.Stage) {
    this.removeShapes(stage);
    let container = (this.container = new createjs.Container());

    let line = container.addChild(new createjs.Shape());
    line.graphics.beginStroke('#000').setStrokeStyle(1);
    this.shapeCommands['lineStart'] = line.graphics.moveTo(0, 0).command;
    this.shapeCommands['lineEnd'] = line.graphics.lineTo(0, 0).command;

    let circle = container.addChild(new createjs.Shape());
    this.shapeCommands['circle'] = circle.graphics.beginFill('DeepSkyBlue').drawCircle(0, 0, 15).command;

    stage.addChild(container);
  }

  removeShapes(stage: createjs.Stage) {
    if (this.container) {
      stage.removeChild(this.container);
      this.container.removeAllChildren();
      this.container = null;
    }
  }

  setBounds(bounds: { x?: number; y?: number; w?: number; h?: number }) {
    Object.assign(this.bounds, bounds);
    this.redraw();
  }

  redraw() {
    let lineStartCmd = this.shapeCommands['lineStart'];
    let lineEndCmd = this.shapeCommands['lineEnd'];
    lineStartCmd.x = this.bounds.x;
    lineStartCmd.y = this.bounds.y + this.bounds.h;
    lineEndCmd.x = this.bounds.x;
    lineEndCmd.y = this.bounds.y;

    let circleCmd = this.shapeCommands['circle'];
    circleCmd.x = this.bounds.x;
    circleCmd.y = this.bounds.y + this.bounds.h;
  }
}
