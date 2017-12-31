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
    start: [{name: '起點1'}],
    end: [{ id: '999', name: '終點 999' }],
    random: '0'
  };

  constructor() {}

  ngOnInit() {
    this.canvas = <HTMLCanvasElement>document.getElementById(this.canvasId);
    this.resize();
  }

  ngAfterViewInit(): void {
    this.stage = new createjs.Stage(this.canvasId);
    let stage = this.stage;
    this.manager = new GhostLegManager(stage);
    this.manager.load(this.gameSettings);

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener('tick', stage);
  }

  @HostListener('window:resize')
  resize() {
    this.size = {
      w: window.innerWidth - 20,
      h: window.innerHeight - 50
    };
    this.canvas.width = this.size.w;
    this.canvas.height = this.size.h;
  }
}
