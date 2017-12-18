import * as createjs from 'createjs-module';
import { Leg } from "./Leg";
import { RandomNormal } from "./Random_Normal";
import { Distance } from './Distance';

export class LegManager {
  legs: Leg[];
  woods: number;
  count: number;
  randomEngine: any;
  constructor(private stage: createjs.Stage) {
    this.legs = [];
    this.woods = 15;
    this.randomEngine = RandomNormal;
  }
  addLeg(leg: Leg) {
    if (leg) {
      leg.onClick = (id) => {
        let startLeg = this.legs[id];
        this.startFrom(startLeg);
      };

      this.legs.push(leg);
      this.count = this.legs.length;
    }
  }
  randomWoods() {
    this.removeWoods();
    let woods = this.randomEngine(this.legs.length, 3 * this.legs.length);
    for (let i = 0; i < woods; i++) {
      let leg: number;
      let position: number;
      do {
        leg = this.randomEngine(0, this.legs.length - 2);
        position = this.randomEngine(2, this.woods);
      } while (!this.addLink(leg, position))
    }
  }

  removeWoods() {
    this.legs.forEach(leg => {
      Object.keys(leg.nodes).map(key => {
        this.stage.removeChild(leg.nodes[key].shape);
        leg.nodes[key] = null;
      });
    });
  }
  addLink(i, num) {
    let offsetY = 50;
    if (i >= 0 && i < this.count) {
      let leg1 = this.legs[i];
      let leg2 = this.legs[i + 1];
      if (leg1.nodes[num.toString()] || leg2.nodes[num.toString()]) {
        return false;
      }
      let line = new createjs.Shape();
      let y = (((leg1.startY - offsetY) - (leg1.endY + offsetY)) / this.woods) * num + leg1.endY + offsetY;
      line.graphics.setStrokeStyle(1).beginStroke('#000').moveTo(leg1.x, y);
      line.graphics.lineTo(leg2.x, y);
      line.graphics.endStroke();
      leg1.nodes[num] = { shape: line, linkTo: leg2.id, x: leg1.x, y: y };
      leg2.nodes[num] = { shape: line, linkTo: leg1.id, x: leg2.x, y: y };
      this.stage.addChild(line);
      return true;
    }
    return false;
  }

  startFrom(leg: Leg) {
    let paths = this.findPath(leg);
    if (paths.length >= 0) {
      let color = '#' + (Math.random().toString(16) + "000000").substring(2, 8);

      //把線畫出來
      // let line = new createjs.Shape();
      // let g = line.graphics.setStrokeStyle(2).beginStroke(color).moveTo(paths[0].x, paths[0].y);
      // for(let i = 1; i< paths.length; i++) {
      //   g = g.lineTo(paths[i].x, paths[i].y);
      // }
      // this.stage.addChild(line);

      // 有動畫的劃線
      // for(let i  = 0; i< paths.length-1; i++) {
      //   let line = new createjs.Shape();
      //   this.stage.addChild(line);
      //   let g = line.graphics.setStrokeStyle(2).beginStroke(color).moveTo(paths[i].x, paths[i].y);
      //   let cmd = g.lineTo(paths[i].x, paths[i].y).command;
      //   createjs.Tween.get(cmd, {loop: false}).to({x: paths[i+1].x, y:paths[i+1].y}, 2000).call(()=>{
      //   });
      // }

      // 正確的畫線
      let i = 0;
      let length = paths.length - 1;
      let line = new createjs.Shape();
      this.stage.addChild(line);
      let to = (paths, i, length) => {
        let g = line.graphics.setStrokeStyle(5).beginStroke(color).moveTo(paths[i].x, paths[i].y);
        let cmd = g.lineTo(paths[i].x, paths[i].y).command;
        let dist = Distance(paths[i].x, paths[i].y, paths[i + 1].x, paths[i + 1].y);
        let duration = dist * 10;
        let tween = createjs.Tween.get(cmd, { loop: false })
          .to({ x: paths[i + 1].x, y: paths[i + 1].y }, duration);
        if (i < length-1) {
          tween.call(to, [paths, i + 1, length]);
        }
      };
      to(paths, 0, length);

    }
  }


  findPath(leg: Leg) {
    let paths: any[] = [];
    let keys = [];
    for (let i = 0; i < this.legs.length; i++) {
      keys = [...keys, ...Object.keys(this.legs[i].nodes)];
    }
    keys = keys.filter((x, i, a) => a.indexOf(x) == i)
    keys = keys.sort((a, b) => parseInt(a, 10) < parseInt(b, 10) ? -1 : 1);

    let currentLeg = leg;
    paths.push({ x: currentLeg.startX, y: currentLeg.startY });
    let index = keys.length - 1;
    do {
      let n = currentLeg.nodes[keys[index]];
      if (n) {
        paths.push({ x: n.x, y: n.y });
        currentLeg = this.legs[n.linkTo];
        n = currentLeg.nodes[keys[index]];
        paths.push({ x: n.x, y: n.y });
      }
      index--;
    } while (index >= 0);
    paths.push({ x: currentLeg.endX, y: currentLeg.endY });
    return paths;
  }
}