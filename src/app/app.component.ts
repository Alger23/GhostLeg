import { Component, HostListener, OnInit, AfterViewInit } from '@angular/core';
import { LegManager } from './models/LegManager';
import { Leg } from './models/Leg';
import * as createjs from 'createjs-module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  stage: createjs.Stage;
  legManager: LegManager;
  options: any;
  constructor() { }

  ngOnInit() {
    this.options = {
      game: {
        start: [
          { id: 1, name: '起點1' },
          { id: 2, name: '起點2' },
          { id: 3, name: '起點3' },
          { id: 4, name: '起點4' }
        ],
        end: [
          { id: 1, name: '20000元' },
          { id: 2, name: '30000元' },
          { id: 3, name: '50000元' },
          { id: 4, name: '闖關' },
        ],
        random: '0'
      }
    }
  }

  ngAfterViewInit(): void {
    this.stage = new createjs.Stage("demoCanvas");
    let stage = this.stage;

    this.legManager = new LegManager(stage);
    let data = this.options.game;

    for (let i = 0; i < data.start.length; i++) {
      let start = data.start[i];
      let end = data.end[i];
      let leg = new Leg(i, start.name, end.name);
      leg.createShapes(stage);
      leg.moveTo(50 + i * 100, 50);
      this.legManager.addLeg(leg);
    }

    this.legManager.randomWoods();

    stage.update();

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", stage);
  }
  @HostListener('window:resize')
  resize() {
    let canvas: any = this.stage.canvas;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resetWoods() {
    this.legManager.randomWoods();
  }
}
