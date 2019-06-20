import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
    title = 'bitwin';
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

    ngOnInit() {
        // return;
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
            this.starsNumber = 200;
            this.stars = [];
            this.vp = { x: this.cx, y: this.cy }; // vanishing point
            this.fl = this.cx; // focal length
            this.requestId = null;

            this.ctx.globalAlpha = 0.5;


            // this.canvas.addEventListener(
            //     'mousedown',
            //     (evt) => {
            //         this.dragging = true;
            //     },
            //     false
            // );

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

    draw() {
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
    }

    txt() {
        const t = 'Click & drag'.split('').join(' ');
        this.ctx.font = '1.5em Lucida Console';
        this.ctx.fillStyle = 'hsla(210,95%,45%,.75)';
        this.ctx.textAlign = 'end';
        this.ctx.fillText(t, this.cw * .95, this.ch * .95);
    }


    init() {
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

    oMousePos(canvas, evt) {
        const clientRect = canvas.getBoundingClientRect();
        return {
            // objeto
            x: Math.round(evt.clientX - clientRect.left),
            y: Math.round(evt.clientY - clientRect.top)
        };
    }
}

export class Star {
    r;
    R;
    pos;
    x;
    y;
    a;
    scale;
    fl;
    vp;
    visible;
    ctx;
    h;

    constructor(x, y, z, cx, cy, ctx, fl, vp, h) {
        this.h = h;
        this.vp = vp;
        this.fl = fl;
        this.ctx = ctx;
        this.r = 5;
        this.R = x - cx;
        // 3D position
        this.pos = { x: x, y: y, z: z };
        // 2D position
        this.x = x + cx;
        this.y = y + cy;

        this.a = { x: 0, y: 0 };
        this.scale = { x: 1, y: 1 };
    }

    rotateX(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const y1 = this.pos.y * cos - this.pos.z * sin;
        const z1 = this.pos.z * cos + this.pos.y * sin;

        this.pos.y = y1;
        this.pos.z = z1;
    }

    rotateY(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const x1 = this.pos.x * cos - this.pos.z * sin;
        const z1 = this.pos.z * cos + this.pos.x * sin;

        this.pos.x = x1;
        this.pos.z = z1;
    }

    draw3D() {
        if (this.pos.z > -this.fl) {
            const scale = this.fl / (this.fl - this.pos.z);

            this.scale = { x: scale, y: scale };
            this.x = this.vp.x + this.pos.x * scale;
            this.y = this.vp.y + this.pos.y * scale;
            this.visible = true;
        } else {
            this.visible = false;
        }
    }

    draw2D() {

        // this.move();
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.scale(this.scale.x, this.scale.y);
        this.ctx.beginPath();
        // this.ctx.arc(0, 0, this.r, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.oGrd(this.r);
        this.ctx.fillRect(0, 0, 2 * this.r, 2 * this.r);
        this.ctx.restore();
    }

    move() {
        this.x += Math.random() * 1;
        this.y += Math.random() * 1;
    }

    oGrd(r) {
        const grd = this.ctx.createRadialGradient(r, r, 0, r, r, r);

        grd.addColorStop(0, 'hsla(' + this.h + ',95%,95%, 1)');
        grd.addColorStop(0.4, 'hsla(' + this.h + ',95%,45%,.5)');
        grd.addColorStop(1, 'hsla(' + this.h + ', 95%, 45%, 0)');

        return grd;
    }

}
