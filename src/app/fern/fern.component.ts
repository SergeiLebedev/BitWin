import { Component, OnInit, OnDestroy } from '@angular/core';
import { MyRandom } from '../car-race/car-race.component';

@Component({
    selector: 'app-fern',
    templateUrl: './fern.component.html',
    styleUrls: ['./fern.component.css']
})
export class FernComponent implements OnInit, OnDestroy {
    silverFern: SilverFernAnimation;

    constructor() { }

    ngOnInit() {
        this.silverFern = new SilverFernAnimation();
        this.silverFern.init();
    }

    ngOnDestroy() {
        this.silverFern.destroy();
        this.silverFern = null;
    }
}

class SilverFernAnimation {
    requestId;
    canvas;
    ctx;
    cw;
    ch;
    dots = new Array<Dot>();
    ferns = new Array<Fern>();
    previousMouseX = 0;
    previousMouseY = 0;
    mouseSpeed = 50;
    lineWidth = 1;

    constructor() {

        const self = this;
        this.canvas = document.getElementById('canvas');
        if (this.canvas.getContext) {
            this.ctx = this.canvas.getContext('2d');

            this.cw = (this.canvas.width = window.innerWidth);
            this.ch = (this.canvas.height = window.innerHeight);
            // this.previousMouseX = window.event.clientX;
            // this.previousMouseY = window.event.clientY;
            // this.ctx.globalAlpha = 0.5;
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
        this.dots.push(new Dot(evt.clientX - 17, evt.clientY - 45));

        if ((evt.clientX - this.previousMouseX) > this.mouseSpeed
            || (evt.clientY - this.previousMouseY) > this.mouseSpeed
            || (this.previousMouseX - evt.clientX) > this.mouseSpeed
            || (this.previousMouseY - evt.clientY) > this.mouseSpeed) {
            if (this.ferns.length < 5) {
                this.ferns.push(new Fern(evt.clientX, evt.clientY));
            }
        }
        this.previousMouseX = evt.clientX;
        this.previousMouseY = evt.clientY;
    }

    oTouchPos(evt) {
        this.dots.push(new Dot(evt.clientX - 17, evt.clientY - 45));

        if (this.ferns.length < 5) {
            this.ferns.push(new Fern(evt.clientX, evt.clientY));
        }
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
        this.drawFerns();
    }

    drawPath() {
        // return;
        if (this.dots.length > 0) {
            const previousX = this.dots[0].x;
            const previousY = this.dots[0].y;
            this.ctx.lineWidth = this.lineWidth;
            this.ctx.beginPath();
            this.ctx.moveTo(previousX, previousY);
            this.dots.forEach(path => {
                // path.draw(this.ctx);

                // path.drawLine(this.ctx, previousX, previousY);
                // previousX = path.x;
                // previousY = path.y;

                path.drawSimpleLine(this.ctx);
                path.fade();
            });

            this.ctx.stroke();

            // remove empty items
            this.dots = this.dots.filter(path => path.opacity > 0).map(path => path);
        }
    }

    drawFerns() {
        if (this.ferns.length > 0) {
            this.ferns.forEach(fern => {
                fern.draw(this.ctx);
            });

            // remove empty items
            this.ferns = this.ferns.filter(path => path.opacity > 0).map(path => path);
        }
    }
}

class Dot {
    // color = 'rgb(0, 0, 0, 1)';
    x;
    y;
    radius = 1;
    opacity = 1;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(ctx) {
        // circle
        ctx.fillStyle = `rgb(255,255,255,${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fill();
    }

    drawLine(ctx, previousX?, previousY?) {
        ctx.beginPath();
        ctx.moveTo(previousX, previousY);
        ctx.quadraticCurveTo(previousX, previousY + 1, this.x, this.y);
        ctx.strokeStyle = `rgb(255,255,255,${this.opacity})`;
        ctx.stroke();
    }

    drawSimpleLine(ctx) {
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `rgb(255,255,255,${this.opacity})`;
    }

    fade() {
        this.opacity -= 0.05;
    }
}

class Fern {
    x;
    y;
    // x1;
    // y1;
    radius = 1;
    opacity = 1;
    leaves = new Array<Array<{ x: number, y: number }>>();
    stem = new Array<{ x: number, y: number }>();
    percentage = 0;
    speed = 1;
    scale = 100;
    turnAngle = MyRandom.getRandomNumber(360);
    simmetric = MyRandom.getRandomNumber(2);
    size = MyRandom.getRandomNumber(20) / 10;
    lineWidth = this.size < 0.5 ? 1 : MyRandom.getRandomNumber(5);

    constructor(x, y) {
        this.x = x;
        this.y = y;
        // this.x1 = x1;
        // this.y1 = y1;

        let startPointX;
        let startPointY;

        // stem dots
        this.getStem(this.stem, x, y, this.scale);

        // leaves dots
        const leavesNumber = 4 + MyRandom.getRandomNumber(3);
        const turnAngle = 30 + MyRandom.getRandomNumber(30);
        const lenghtBetweenLeaves = Math.ceil(this.stem.length * 0.8 / leavesNumber);
        for (let index = 1; index < lenghtBetweenLeaves * leavesNumber; index += lenghtBetweenLeaves) {
            startPointX = this.stem[index].x;
            startPointY = this.stem[index].y;
            const scale = (this.scale - index) / 3; // - index;
            const leaf = new Array<{ x: number, y: number }>();
            let leaf1 = new Array<{ x: number, y: number }>();
            this.getStem(leaf, startPointX, startPointY, scale);

            leaf1 = leaf.map(dot => {
                return { x: dot.x, y: dot.y };
            });

            startPointX = leaf[0].x;
            startPointY = leaf[0].y;
            this.turnWithAngle(leaf, turnAngle, startPointX, startPointY);

            startPointX = leaf1[0].x;
            startPointY = leaf1[0].y;
            this.turnWithAngle(leaf1, -turnAngle, startPointX, startPointY);

            this.leaves.push(leaf);
            this.leaves.push(leaf1);
        }

        // spiral dots
        startPointX = this.stem[this.stem.length - 1].x;
        startPointY = this.stem[this.stem.length - 1].y;
        this.getSpiral(this.stem, startPointX, startPointY);


        // turn with angle
        startPointX = this.stem[0].x;
        startPointY = this.stem[0].y;
        this.turnWithAngle(this.stem, this.turnAngle, startPointX, startPointY);
        this.leaves.forEach(leaf => this.turnWithAngle(leaf, this.turnAngle, startPointX, startPointY));

        // simmetric reflection
        startPointX = this.stem[0].x;
        this.simmetricReflection(this.stem, startPointX);
        this.leaves.forEach(leaf => this.simmetricReflection(leaf, startPointX));

        // change size
        startPointX = this.stem[0].x;
        startPointY = this.stem[0].y;
        this.changeSize(this.stem, this.size, startPointX, startPointY);
        this.leaves.forEach(leaf => this.changeSize(leaf, this.size, startPointX, startPointY));
    }

    getStem(dots, x, y, scale) {
        const startPointX = x;
        const startPointY = y;

        let dotX = x;
        let dotY = y;
        const halfPI = Math.PI / 2;
        for (let index = -1; index <= 1; index += 0.05) {
            dotX = startPointX + index;
            dotY = startPointY + (halfPI + Math.asin(index));
            dots.push({ x: dotX, y: dotY });
        }

        this.changeSize(dots, scale, dots[0].x, dots[0].y);
    }

    getSpiral(dots, x, y) {
        let stemX = x;
        let stemY = y;
        const spiralStartX = stemX;
        const spiralStartY = stemY;
        const a = 0;
        const b = 1; // 0.4;
        let angle = 0;
        for (let i = 176; i > 0; i--) {
            angle = 0.1 * i;
            stemX = spiralStartX - 15 + (a - b * angle) * Math.sin(angle);
            stemY = spiralStartY + 12 + (a - b * angle) * Math.cos(angle);
            dots.push({ x: stemX, y: stemY });
        }
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

    simmetricReflection(dots, zeroX) {
        if (this.simmetric > 1) {
            dots.forEach(dot => {
                dot.x = 2 * zeroX - dot.x;
            });
        }
    }

    changeSize(dots, size, zeroX, zeroY) {
        if (size) {
            dots.forEach(dot => {
                dot.x = (dot.x - zeroX) * size + zeroX;
                dot.y = (dot.y - zeroY) * size + zeroY;
            });
        }
    }

    draw(ctx) {
        ctx.lineWidth = this.lineWidth;
        this.percentage += this.speed;
        this.drawStem(ctx);
        this.drawLeaves(ctx);
        if (this.percentage > 100) {
            this.fade();
        }
    }

    drawStem(ctx) {
        const strokeLength = Math.min(Math.ceil(this.stem.length * this.percentage / 100), this.stem.length);

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        for (let index = 0; index < strokeLength; index++) {
            ctx.lineTo(this.stem[index].x, this.stem[index].y);
        }
        ctx.strokeStyle = this.getColor();
        ctx.stroke();
    }

    drawLeaves(ctx) {
        let strokeLength = 0;
        this.leaves.forEach(leaf => {
            strokeLength = Math.min(Math.ceil(leaf.length * this.percentage / 100), leaf.length);

            ctx.beginPath();
            ctx.moveTo(leaf[0].x, leaf[0].y);
            for (let index = 0; index < strokeLength; index++) {
                ctx.lineTo(leaf[index].x, leaf[index].y);
            }
            ctx.strokeStyle = this.getColor();
            ctx.stroke();
        });
    }

    getColor() {
        return `rgb(192,192,192,${this.opacity})`;
    }

    fade() {
        this.opacity -= 0.05;
    }
}

class Leaf {

    constructor() {

    }

    draw(ctx) {

    }
}
