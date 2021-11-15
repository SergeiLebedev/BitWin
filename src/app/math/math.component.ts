import { Component, OnInit } from '@angular/core';
import { Star } from '../contacts/contacts.component';
import { MathSettings } from '../math-settings';
import { Rocket } from './rocket';
import { Coordinates, Task } from './task';

@Component({
  selector: 'app-math',
  templateUrl: './math.component.html',
  styleUrls: ['./math.component.css']
})
export class MathComponent implements OnInit {
    canvas;
    ctx;
    cw;
    cx;
    cy;
    ch;
    m;
    target;
    speed = 0.000025;
    easing;
    dragging;
    starsNumber;
    stars;
    vp;
    fl;
    requestId;
    rocket: Rocket;
    task: Task;
    mathSettings: MathSettings;

  constructor() { }

  ngOnInit(): void {
    const self = this;
        this.canvas = document.getElementById('canvas');
        if (this.canvas.getContext) {
            this.ctx = this.canvas.getContext('2d');

            this.cw = (this.canvas.width = window.innerWidth);
            this.cx = this.cw / 2;
            this.ch = (this.canvas.height = window.innerHeight);
            this.cy = this.ch / 2;
            this.m = { x: 0, y: 0 };
            this.speed = 0.00001;
            this.target = { x: this.cx * this.speed, y: this.cy * this.speed };
            this.easing = 1.00; // 1 - non stop
            this.dragging = false;
            this.starsNumber = 100;
            this.stars = [];
            this.vp = { x: this.cx, y: this.cy }; // vanishing point
            this.fl = this.cx; // focal length
            this.requestId = null;
            this.rocket = new Rocket(this.ctx, this.cw, this.ch);
            this.mathSettings = new MathSettings();
            this.task = new Task(this.mathSettings, this.ctx, this.cw, this.ch);

            this.ctx.globalAlpha = 0.5;


            this.canvas.addEventListener(
                'mousedown',
                (evt) => {
                    this._checkAnswer(evt);
                },
                false
            );

            this.canvas.addEventListener(
                'mousemove',
                (evt) => {
                    // if (self.dragging) {
                    self.m = self.oMousePos(self.canvas, evt);
                    self.target.x = (self.m.y - self.vp.y) * self.speed;
                    self.target.y = (self.m.x - self.vp.x) * self.speed;
                    // }
                },
                false
            );

            // this.canvas.addEventListener(
            //     'mouseup',
            //     (evt) => {
            //         this.dragging = false;
            //     },
            //     false
            // );

            // this.canvas.addEventListener(
            //     'mouseoutp',
            //     (evt) => {
            //         self.dragging = false;
            //     },
            //     false
            // );
        }

        setTimeout(() => {
            this.init();
            window.addEventListener('resize', () => this.init(), false);
        }, 15);
    }
    starsGenerator() {
      this.stars.length = 0;
      for (let i = 0; i < this.starsNumber; i++) {
          const x = Math.random() * 2 * this.cw - this.cw;
          const y = Math.random() * 2 * this.ch - this.ch;
          const z = Math.random() * 1000 - 500;
          const h = Math.floor(Math.random() * 254);
          this.stars.push(new Star(x, y, z, this.cx, this.cy, this.ctx, this.fl, this.vp, h));
      }
  }

  public draw() {
      this.requestId = window.requestAnimationFrame(() => this.draw());
      this.ctx.clearRect(0, 0, this.cw, this.ch);
      // this.txt();
      this.stars.map((s) => {
          s.draw3D();
      });
      this.stars.sort((a, b) => {
          return a.pos.z - b.pos.z;
      });

      this.target.x *= this.easing;
      this.target.y *= this.easing;

      const self = this;
      this.stars.map((s) => {
          s.rotateX(self.target.x);
          s.rotateY(self.target.y);
          if (s.visible) {
              s.draw2D();
          }
      });

      this.rocket.draw();

      this.task.draw();
  }

  private txt() {
      const t = 'Click & drag'.split('').join(' ');
      this.ctx.font = '1.5em Lucida Console';
      this.ctx.fillStyle = 'hsla(210,95%,45%,.75)';
      this.ctx.textAlign = 'end';
      this.ctx.fillText(t, this.cw * .95, this.ch * .95);
  }


  private init() {
      if (this.requestId) {
          window.cancelAnimationFrame(this.requestId);
          this.requestId = null;
      }

      this.cw = this.canvas.width = window.innerWidth;
      this.cx = this.cw / 2;
      this.ch = this.canvas.height = window.innerHeight;
      this.cy = this.ch / 2;
      this.starsGenerator();

      this.vp = { x: this.cx, y: this.cy }; // vanishing point
      this.fl = this.cx; // focal length
      this.draw();
  }

  private oMousePos(canvas, evt) {
      const clientRect = canvas.getBoundingClientRect();
      return new Coordinates(Math.round(evt.clientX - clientRect.left), Math.round(evt.clientY - clientRect.top))
      // {
      //     // object
      //     x: Math.round(evt.clientX - clientRect.left),
      //     y: Math.round(evt.clientY - clientRect.top)
      // };
  }

  private _checkAnswer(evt): void {
    const coordinates = this.oMousePos(this.canvas, evt);
    this.task.checkAnswers(coordinates);
  }
}
