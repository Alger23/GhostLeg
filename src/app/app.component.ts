import { Component, HostListener, OnInit, AfterViewInit } from '@angular/core';
import * as createjs from 'createjs-module';
import { GhostLegManager } from './models/GhostLegManager';

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
    start: [
      { name: '起點1' },
      { name: '起點2' },
      { name: '起點3' }
    ],
    end: [
      { id: 'a', name: '終點 A' },
      { id: 'b', name: '終點 B' },
      { id: 'c', name: '終點 C' }
    ],
    random: '0'
  };

  constructor() {}

  ngOnInit() {
    this.canvas = <HTMLCanvasElement>document.getElementById(this.canvasId);
  }

  ngAfterViewInit(): void {
    createjs.MotionGuidePlugin.install();

    this.stage = new createjs.Stage(this.canvasId);
    let stage = this.stage;
    this.manager = new GhostLegManager(stage);
    this.manager.load(this.gameSettings);

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener('tick', stage);

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
    this.manager.start();
  }
}
