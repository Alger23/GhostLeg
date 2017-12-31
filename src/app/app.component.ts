import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  canvasId = 'canvas';
  canvas: HTMLCanvasElement;
  size: { w: number; h: number };
  constructor() {}

  ngOnInit() {
    this.canvas = <HTMLCanvasElement>document.getElementById(this.canvasId);
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
  }
}
