import { IGhostLegSettings } from './IGhostLegSettings';
import * as createjs from 'createjs-module';
import { Shuffle } from './Shuffle';
import { Leg } from './Leg';
export class GhostLegManager {
  stage: createjs.Stage;
  settings: IGhostLegSettings;
  legs: Leg[];
  env: {
    width: number;
    height: number;
    scaleX: number;
    scaleY: number;
  };
  constructor(stage: createjs.Stage) {
    this.stage = stage;
    this.env = {
      width: 1,
      height: 1,
      scaleX: 1,
      scaleY: 1
    };
    this.legs = [];
  }

  load(settings: IGhostLegSettings) {
    this.settings = settings;
  }

  onParentSizeChange(size: { w: number; h: number }) {
    this.env.width = size.w;
    this.env.height = size.h;
  }

  start() {
    let canvas = <HTMLCanvasElement>this.stage.canvas;
    this.env = {
      width: canvas.width,
      height: canvas.height,
      scaleX: 1,
      scaleY: 1
    };

    this.stage.removeAllChildren();
    this.legs = [];
    this.addLegs();
    this.stage.update();
  }

  addLegs() {
    let ends = Shuffle(this.settings.end.map(end => end));
    let offsetX = this.env.width / (ends.length + 1);
    for (let i = 0, length = ends.length; i < length; i++) {
      let leg = new Leg(i);
      leg.startId = i;
      leg.startText = this.settings.start[i].name;
      leg.endId = ends[i].id;
      leg.endText = ends[i].name;
      this.legs.push(leg);

      leg.createShapes(this.stage);
      leg.setBounds({
        x: offsetX * (i + 1),
        y: 50,
        w: 20,
        h: this.env.height - 100
      });
    }
  }
}
