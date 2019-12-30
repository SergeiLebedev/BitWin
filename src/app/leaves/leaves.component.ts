import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-leaves',
    templateUrl: './leaves.component.html',
    styleUrls: ['./leaves.component.css']
})
export class LeavesComponent implements OnInit, OnDestroy {
    leaf: LeafAnimation;

    constructor() { }

    ngOnInit() {
        this.leaf = new LeafAnimation();
        this.leaf.init();
    }

    ngOnDestroy() {
        this.leaf.destroy();
        this.leaf = null;
    }
}

class LeafAnimation {
    requestId;
    canvas;
    ctx;
    cw;
    ch;
    leaves = new Array<Leaf>();
    previousMouseX = 0;
    previousMouseY = 0;
    mouseSpeed = 50;
    lineWidth = 1;
    x1; y1; x2; y2; x3; y3; x4; y4;

    lastTime = new Date().getTime();

    constructor() {

        const self = this;
        this.canvas = document.getElementById('canvas');
        if (this.canvas.getContext) {
            this.ctx = this.canvas.getContext('2d');

            this.cw = (this.canvas.width = window.innerWidth);
            this.ch = (this.canvas.height = window.innerHeight);
            this.requestId = null;

            this.canvas.addEventListener(
                'mousemove',
                (evt) => {
                    self.oMousePos(evt);
                },
                false
            );

            this.canvas.addEventListener(
                'touchmove',
                (evt) => {
                    self.oTouchPos(evt);
                }, false);
        }

        setTimeout(() => {
            this.init();
            window.addEventListener('resize', () => {
                this.init();
            }, false);
        }, 15);

    }

    destroy() {
        window.cancelAnimationFrame(this.requestId);
    }

    oMousePos(evt) {
        if (this.leaves.length < 10 && (new Date().getTime() - this.lastTime) > MyRandom.getRandomNumber(2000)) {
            this.leaves.push(new Leaf(evt.clientX, evt.clientY));
            this.lastTime = new Date().getTime();
        }

        this.previousMouseX = evt.clientX;
        this.previousMouseY = evt.clientY;
    }

    oTouchPos(evt) {
        if (this.leaves.length < 10 && (new Date().getTime() - this.lastTime) > MyRandom.getRandomNumber(2000)) {
            this.leaves.push(new Leaf(evt.clientX, evt.clientY));
            this.lastTime = new Date().getTime();
        }

        this.previousMouseX = evt.clientX;
        this.previousMouseY = evt.clientY;
    }

    init() {
        if (this.requestId) {
            window.cancelAnimationFrame(this.requestId);
            this.requestId = null;
        }

        this.draw();
    }

    draw() {
        this.requestId = window.requestAnimationFrame(() => this.draw());
        this.ctx.clearRect(0, 0, this.cw, this.ch);
        this.drawPath();
    }

    drawPath() {
        if (this.leaves.length > 0) {
            this.leaves.forEach(leaf => {
                leaf.draw(this.ctx, this.x1, this.y1, this.x2, this.y2, this.x3, this.y3, this.x4, this.y4);
            });
            // remove empty items
            this.leaves = this.leaves.filter(path => path.opacity > 0).map(path => path);
        }
    }
}

class Leaf {
    x;
    y;
    radius = 1;
    opacity = 1;
    color1 = 0;
    color2 = 0;
    color3 = 0;
    originalX;
    direction = 1;
    deviation;
    xSpeed;
    ySpeed;

    xLength = 30;
    yLength = 30;

    x1 = 0;
    y1 = -50;
    x2 = 50;
    y2 = -20;
    x3 = 30;
    y3 = 0;
    x4 = 10;
    y4 = 0;

    dots = [];
    size = 1;
    turnAngle = 0;
    changeAngle = 0;
    xCenter = 0;
    yCenter = 0;
    xCenterChange = 0;
    yCenterChange = 0;

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color1 = 62;
        this.color2 = 216;
        this.color3 = 111;
        this.originalX = x;
        this.deviation = 20 + MyRandom.getRandomNumber(40);
        this.xSpeed = MyRandom.getRandomNumber(2);
        this.ySpeed = MyRandom.getRandomNumber(3);

        this.size = 1 / (0.1 + MyRandom.getRandomNumber(4));

        this.x1 *= this.size;
        this.y1 *= this.size;
        this.x2 *= this.size;
        this.y2 *= this.size;
        this.x3 *= this.size;
        this.y3 *= this.size;
        this.x4 *= this.size;
        this.y4 *= this.size;

        this.initDots();

        if (MyRandom.getRandomBoolean()) {
            this.changeAngle = MyRandom.getRandomNumber(10);
        } else {
            this.changeAngle = - MyRandom.getRandomNumber(10);
        }

        this.xCenterChange = MyRandom.getRandomNumber(10);
        this.yCenterChange = MyRandom.getRandomNumber(10);
    }

    draw(ctx, x1, y1, x2, y2, x3, y3, x4, y4) {
        ctx.fillStyle = `rgb(${this.color1},${this.color2},${this.color3},${this.opacity})`;
        ctx.beginPath();
        ctx.moveTo(this.dots[0].x, this.dots[0].y);
        ctx.bezierCurveTo(this.dots[1].x, this.dots[1].y, this.dots[2].x, this.dots[2].y, this.dots[3].x, this.dots[3].y);
        ctx.bezierCurveTo(this.dots[4].x, this.dots[4].y, this.dots[5].x, this.dots[5].y, this.dots[0].x, this.dots[0].y);
        ctx.fill();

        ctx.strokeStyle = `rgb(255,255,255,${this.opacity})`;
        ctx.lineWidth = 2 * this.size;
        ctx.beginPath();
        ctx.moveTo(this.dots[0].x, this.dots[0].y);
        ctx.bezierCurveTo(this.dots[6].x, this.dots[6].y, this.dots[7].x, this.dots[7].y, this.dots[8].x, this.dots[8].y);
        ctx.stroke();

        this.fade();
        this.move();
        this.initDots();
        this.turnAngle += this.changeAngle;
        this.turnWithAngle(this.dots, this.turnAngle, this.xCenter, this.yCenter);
    }

    initDots() {
        this.xCenter = this.x + this.xCenterChange;
        this.yCenter = this.y + this.yCenterChange;

        this.dots = [];
        this.dots.push({ x: this.x, y: this.y });
        this.dots.push({ x: this.x + this.x1, y: this.y + this.y1 });
        this.dots.push({ x: this.x + this.x2, y: this.y + this.y2 });
        this.dots.push({ x: this.x + this.xLength * this.size, y: this.y - this.yLength * this.size });
        this.dots.push({ x: this.x + this.x3, y: this.y + this.y3 });
        this.dots.push({ x: this.x + this.x4, y: this.y + this.y4 });
        this.dots.push({ x: this.x + 1, y: this.y - 10 });
        this.dots.push({ x: this.x + 20, y: this.y - 10 });
        this.dots.push({ x: this.x + 20 * this.size, y: this.y - 20 * this.size });
    }

    move() {
        this.x = this.x + this.direction * this.xSpeed;

        const difference = this.x - this.originalX;
        if (difference > this.deviation || difference < -this.deviation) {
            this.direction *= -1;
            this.xSpeed += this.direction * MyRandom.getRandomNumber(1);
            this.deviation = 20 + MyRandom.getRandomNumber(40);
        }

        this.y = this.y + this.ySpeed;
    }


    fade() {
        this.opacity -= 0.01;
    }

    turnWithAngle(dots, turnAngle, zeroX, zeroY) {
        turnAngle *= Math.PI / 180;
        dots.forEach(dot => {
            const angleX = dot.x - zeroX;
            const angleY = dot.y - zeroY;
            dot.x = angleX * Math.cos(turnAngle) - angleY * Math.sin(turnAngle) + zeroX;
            dot.y = angleX * Math.sin(turnAngle) + angleY * Math.cos(turnAngle) + zeroY;
        });
    }
}

export class MyRandom {
    static getRandomNumber(limit: number = 1) {
        return Math.ceil(Math.random() * limit);
    }

    static getRandomBoolean() {
        return Math.random() < 0.5;
    }
}
