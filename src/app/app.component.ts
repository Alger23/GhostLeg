import { Component, HostListener, OnInit, AfterViewInit } from '@angular/core';
import * as createjs from 'createjs-module';
import { GhostLegManager } from './models/GhostLegManager';
import { IGhostLegOptions } from './models/IGhostLegOptions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  canvasId = 'canvas';
  canvas: HTMLCanvasElement;
  size: { w: number; h: number };

  stage: createjs.Stage;
  manager: GhostLegManager;

  gameSettings: any = {
    start: [{ name: '1' }],
    end: [{ id: '1', name: '1' }],
    random: '0'
  };

  options: IGhostLegOptions = {
    horizontal: {
      min: 5,
      max: 10
    },
    leg: {
      offsetX: 0,
      offsetY: 50
    },
    speed: 10
  };

  constructor() {}

  ngOnInit() {
    this.canvas = <HTMLCanvasElement>document.getElementById(this.canvasId);
  }

  ngAfterViewInit(): void {
    createjs.MotionGuidePlugin.install();

    this.stage = new createjs.Stage(this.canvasId);
    this.manager = new GhostLegManager(this.stage);

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener('tick', this.stage);

    this.resize();
  }

  @HostListener('window:resize')
  resize() {
    this.size = {
      w: window.innerWidth - 20,
      h: window.innerHeight - 50
    };
    this.canvas.width = this.size.w;
    this.canvas.height = this.size.h;

    this.manager.onParentSizeChange(this.size);
  }

  start() {
    this.manager.start(this.gameSettings, this.options);
  }

  addSample() {
    this.gameSettings.start.push({
      name: '' + (this.gameSettings.start.length + 1)
    });
    this.gameSettings.end.push({
      id: this.gameSettings.end.length + 1,
      name: '' + (this.gameSettings.end.length + 1)
    });
    this.start();
  }
  removeSample() {
    this.gameSettings.start.pop();
    this.gameSettings.end.pop();
    this.start();
  }
}
