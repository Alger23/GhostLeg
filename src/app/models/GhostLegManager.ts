import { IGhostLegOptions } from './IGhostLegOptions';
import { IGhostLegSettings } from './IGhostLegSettings';
import * as createjs from 'createjs-module';
import { Shuffle } from './Shuffle';
import { Leg } from './Leg';
import { Random } from './Random';

export class GhostLegManager {
  stage: createjs.Stage;
  settings: IGhostLegSettings;
  options: IGhostLegOptions;
  legs: Leg[];
  containers: createjs.Container[];

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
    this.containers = [];
  }

  onParentSizeChange(size: { w: number; h: number }) {
    this.env.width = size.w;
    this.env.height = size.h;
  }

  start(settings: IGhostLegSettings, options: IGhostLegOptions) {
    this.settings = settings;
    this.options = Object.assign(
      {
        horizontal: { min: 3, max: 4 },
        leg: { offsetX: 0, offsetY: 50 },
        speed: 1
      },
      options
    );

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
    this.addHorizontal();
    this.addHorizontalShapes();
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
        x: offsetX * (i + 1) + this.options.leg.offsetX,
        y: 0 + this.options.leg.offsetY,
        w: 20,
        h: this.getLegHeight()
      });
      leg.onClick = (leg: Leg) => this.startHere(leg);
    }
  }

  getLegHeight(): number {
    return this.env.height - 100;
  }
  getHorizontalNodes() {
    return 30;
  }
  getHorizontalOffsetY() {
    return this.getLegHeight() / (this.getHorizontalNodes() + 1); // 加上一格，才不會使最後一條線剛好在起點座標
  }
  addHorizontal() {
    for (let s = 0, e = this.legs.length - 1; s < e; s++) {
      let legL = this.legs[s];
      let legR = this.legs[s + 1];
      let horizontalCount = Random(
        this.options.horizontal.min,
        this.options.horizontal.max
      );
      this.linkNodes(legL, legR, horizontalCount);
    }
  }

  linkNodes(legL: Leg, legR: Leg, count: number) {
    let retry = 0;
    let nodeTotal = this.getHorizontalNodes();

    while (count > 0) {
      let nodeIdx = Random(1, nodeTotal);
      if (!legL.nodes[nodeIdx] && !legR.nodes[nodeIdx]) {
        legL.nodes[nodeIdx] = legR;
        legR.nodes[nodeIdx] = legL;
        count--;
        retry = 0;
      } else {
        if (retry >= nodeTotal) {
          break;
        }
        retry++;
      }
    }
  }

  addHorizontalShapes() {
    let offsetY = this.getHorizontalOffsetY();
    let container = new createjs.Container();

    for (let s = 0, e = this.legs.length - 1; s < e; s++) {
      let legL = this.legs[s];
      let keys = Object.keys(legL.nodes);
      keys.forEach(key => {
        let legR = legL.nodes[key];
        if (legR.id > legL.id) {
          let idx = parseInt(key, 10);
          let line = container.addChild(new createjs.Shape());
          line.graphics.setStrokeStyle(1).beginStroke('#000');
          let cmdStart = line.graphics.moveTo(
            legL.bounds.x,
            offsetY * idx + this.options.leg.offsetY
          ).command;
          let cmdEnd = line.graphics.lineTo(
            legR.bounds.x,
            offsetY * idx + this.options.leg.offsetY
          ).command;
        }
      });
    }

    this.stage.addChild(container);
  }
  startHere(leg: Leg) {
    if (this.containers[leg.id]) {
      this.stage.removeChild(this.containers[leg.id]);
      this.containers[leg.id] = null;
    }

    let paths = this.findPath(leg);
    let color = '#' + (Math.random().toString(16) + '000000').substring(2, 8);
    let curve = {
      x: paths[0].x,
      y: paths[0].y,
      oldx: paths[0].x,
      oldy: paths[0].y
    };
    // 使用 MotionGuidePlugin 畫線
    let getMotionPathFromPoints = (points: createjs.Point[]) => {
      let i;
      let motionPath: number[];
      for (i = 0, motionPath = []; i < points.length; ++i) {
        if (i === 0) {
          motionPath.push(points[i].x, points[i].y);
        } else {
          motionPath.push(
            points[i - 1].x,
            points[i - 1].y,
            points[i].x,
            points[i].y
          );
        }
      }
      return motionPath;
    };

    let container = this.stage.addChild(new createjs.Container());
    this.containers[leg.id] = container;
    let currentClip = container.addChild(new createjs.Shape());

    let tick = event => {
      currentClip.graphics
        .setStrokeStyle(10, 'round', 'round')
        .beginStroke(color)
        .curveTo(curve.oldx, curve.oldy, curve.x, curve.y)
        .endStroke();

      this.stage.update();

      curve.oldx = curve.x;
      curve.oldy = curve.y;
    };
    createjs.Ticker.addEventListener('tick', tick);

    let activeTween = createjs.Tween.get(curve)
      .to(
        {
          guide: { path: getMotionPathFromPoints(paths) }
        },
        this.options.speed * 200,
        createjs.Ease.linear
      )
      .call(() => {
        createjs.Ticker.off('tick', tick);
      });
  }

  findPath(leg: Leg) {
    let paths: createjs.Point[] = [];
    let idx = this.getHorizontalNodes();
    let offsetY = this.getHorizontalOffsetY();

    paths.push(new createjs.Point(leg.bounds.x, leg.bounds.y + leg.bounds.h));
    do {
      let linkLeg = leg.nodes[idx];

      if (!linkLeg) {
        idx--;
        continue;
      }

      paths.push(
        new createjs.Point(
          leg.bounds.x,
          offsetY * idx + this.options.leg.offsetY
        )
      );
      paths.push(
        new createjs.Point(
          linkLeg.bounds.x,
          offsetY * idx + this.options.leg.offsetY
        )
      );
      leg = linkLeg;
      idx--;
    } while (idx > 0);
    paths.push(new createjs.Point(leg.bounds.x, leg.bounds.y));

    return paths;
  }
}
