import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-car-race',
    templateUrl: './car-race.component.html',
    styleUrls: ['./car-race.component.css']
})
export class CarRaceComponent implements OnInit, OnDestroy {

    carRace: CarRace;

    constructor() { }

    ngOnInit() {
        this.carRace = new CarRace();
        this.newGame();
    }

    ngOnDestroy() {
        if (this.carRace) {
            this.carRace.destroyed = true;
            this.carRace.playing = false;
            this.carRace.stopGame = true;
            this.carRace.car.oscillator.stop();
            this.carRace = null;
        }
    }

    newGame() {
        this.carRace.initGame();
    }
}

class CarRace {

    canvas;
    ctx;
    cw;
    ch;
    requestId;

    car: Car;
    dashboard: Dashboard;
    trees: ITree[];
    buildings: House[];
    cars: Car[];
    roadStripesNumber = 10;
    roadStripes: RoadStripe[];
    canisters: Canister[];

    audioCtx; // = new (AudioContext); // || window.webkitAudioContext || window.audioContext)

    playing = false;
    stopGame = false;
    destroyed = false;

    constructor() { }

    initGame() {
        const self = this;
        this.canvas = document.getElementById('canvas');
        if (this.canvas.getContext) {
            this.ctx = this.canvas.getContext('2d');

            this.cw = (this.canvas.width = window.innerWidth);
            this.ch = (this.canvas.height = window.innerHeight);
            this.requestId = null;

            this.ctx.globalAlpha = 0.5;

            this.canvas.addEventListener(
                'mousemove',
                (evt) => {
                    self.oMousePos(evt);
                },
                false
            );

            // this.canvas.addEventListener(
            //     'mousedown',
            //     (evt) => {
            //         self.onMouseClick(evt);
            //     },
            //     false
            // );
        }

        setTimeout(() => {
            this.init();
            window.addEventListener('resize', () => {
                if (!this.destroyed && !this.playing) {
                    this.init();
                }
            }, false);
        }, 15);
    }

    init() {
        if (this.requestId) {
            window.cancelAnimationFrame(this.requestId);
            this.requestId = null;
        }



        if (!this.audioCtx) {
            this.audioCtx = new (AudioContext);
        }

        if (this.car) {
            this.car.oscillator.stop(); // playBumpSound(this.audioCtx);
        }

        this.cw = this.canvas.width = window.innerWidth;
        this.ch = this.canvas.height = window.innerHeight;

        this.stopGame = false;
        this.playing = true;

        this.car = new Car(this.cw, this.ch, 3, true);
        this.car.playEngineSound(this.audioCtx);
        this.dashboard = new Dashboard();

        this.roadStripes = [];
        const height = Math.ceil(this.ch / this.roadStripesNumber);
        let y = 0;
        for (let index = -1; index < this.roadStripesNumber - 1; index++) {
            y = index * (height + 10);
            this.roadStripes.push(new RoadStripe(y, height));
        }

        this.trees = [];
        for (let index = 0; index < 15; index++) {
            const tree = !MyRandom.getRandomBoolean() ? new Pine(this.cw, this.ch) : new Maple(this.cw, this.ch);
            this.trees.push(tree);
        }

        this.buildings = [];
        for (let index = 0; index < 15; index++) {
            const house = new House(this.cw, this.ch);
            this.buildings.push(house);
        }

        this.canisters = [];
        for (let index = 0; index < 2; index++) {
            const canister = new Canister(this.cw, this.ch);
            this.canisters.push(canister);
        }

        this.cars = [];
        for (let index = 0; index < 5; index++) {
            const car = new Car(this.cw, this.ch, 0.5 + Math.random() * (this.car.speed - 0.5));
            this.cars.push(car);
        }


        this.draw();
    }

    draw() {
        this.checkBumpsAndFuel();
        if (!this.stopGame) {
            this.requestId = window.requestAnimationFrame(() => this.draw());

            this.drawGrass();
            this.drawRoad();
            this.drawRoadStripes();
            this.drawBuildings();
            this.drawTrees();
            this.drawFuel();
            this.drawCars();
            this.drawMyCar();
            this.drawDashboard();
            // this.txt();
        } else {
            setTimeout(() => {
                if (!this.destroyed && !this.playing) {
                    this.initGame();
                }
            }, 5000);
        }

    }

    txt() {
        const t = 'BitWin'; // .split('').join(' ');
        this.ctx.font = '1.5em Lucida Console';
        this.ctx.fillStyle = 'hsla(210,95%,45%,.75)';
        this.ctx.textAlign = 'end';
        this.ctx.fillText(t, this.cw * .95, this.ch * .95);
    }

    drawGrass() {
        this.ctx.fillStyle = 'rgb(34, 177, 76)';
        this.ctx.fillRect(0, 0, this.cw, this.ch);
    }

    drawRoad() {
        this.ctx.fillStyle = 'rgb(195, 195, 195)';
        this.ctx.fillRect(this.cw / 2 - 250, 0, 500, this.ch);
    }

    drawRoadStripes() {
        const minY = Math.min(...this.roadStripes.map(roadStripe => roadStripe.y));
        this.roadStripes.forEach(roadStripe => {
            roadStripe.draw(this.ctx, this.cw);
            roadStripe.changePosition(this.car.speed, minY, this.ch);
        });
    }

    drawTrees() {
        this.trees.sort((a, b) => a.y - b.y);
        this.trees.forEach(tree => {
            tree.draw(this.ctx);
            tree.changePosition(this.car.speed, this.cw, this.ch);
        });
    }

    drawBuildings() {
        this.buildings.sort((a, b) => a.y - b.y);
        this.buildings.forEach(building => {
            building.draw(this.ctx);
            building.changePosition(this.car.speed, this.cw, this.ch);
        });
    }

    drawFuel() {
        this.canisters.sort((a, b) => a.y - b.y);
        this.canisters.forEach(canister => {
            canister.draw(this.ctx);
            canister.changePosition(this.car.speed, this.cw, this.ch);
        });
    }

    drawCars() {
        this.cars.sort((a, b) => a.y - b.y);
        this.cars.forEach(car => {
            car.draw(this.ctx, this.cw, this.ch);
            car.changePosition(this.car.speed, this.cw, this.ch);
        });
    }

    drawMyCar() {
        this.car.changeState();
        this.car.draw(this.ctx, this.cw, this.ch);
    }

    drawDashboard() {
        this.dashboard.draw(this.ctx, this.car.speed, this.car.mileage, this.car.fuel);
    }

    oMousePos(evt) {
        if (this.car) {
            this.car.move(this.cw, this.ch, evt.clientX, evt.clientY);
        }
    }

    // onMouseClick(evt) {
    //     if (evt.clientX >= this.cw - 10 - 20
    //         && evt.clientX <= this.cw - 10
    //         && evt.clientY >= 10
    //         && evt.clientY <= 30) {
    //         this.init();
    //     }
    // }

    checkBumpsAndFuel() {
        // bumps with canisters
        this.canisters.forEach(canister => {
            const crossX = (canister.x <= this.car.x && this.car.x <= (canister.x + canister.width)) ||
                (canister.x <= (this.car.x + this.car.width) && (this.car.x + this.car.width) <= (canister.x + canister.width));
            const crossY = (canister.y <= this.car.y && this.car.y <= (canister.y + canister.height)) ||
                (canister.y <= (this.car.y + this.car.height) && (this.car.y + this.car.height) <= (canister.y + canister.height));

            if (crossX && crossY) {
                this.car.fuel += 10;
                canister.y = this.ch + 100;
                this.car.playCanisterSound(this.audioCtx);
            }
        });
        // fuel runs out
        if (this.car.fuel <= 0) {
            this.stopGame = true;
            this.playing = false;
            return;
        }
        // bumps with cars
        this.cars.forEach(car => {
            const crossX = (car.x <= this.car.x && this.car.x <= (car.x + car.width)) ||
                (car.x <= (this.car.x + this.car.width) && (this.car.x + this.car.width) <= (car.x + car.width));
            const crossY = (car.y <= this.car.y && this.car.y <= (car.y + car.height)) ||
                (car.y <= (this.car.y + this.car.height) && (this.car.y + this.car.height) <= (car.y + car.height));

            if (crossX && crossY) {
                this.stopGame = true;
                this.playing = false;
                this.car.playBumpSound(this.audioCtx);
                return;
            }
        });
    }


}

class Car {
    speed: number; // px/sec
    fuel = 100;
    mileage = 0;

    x;
    y;
    width = 20;
    height = 50;
    a;
    color;

    oscillator;
    volume = 0.02;

    constructor(cw, ch, speed = 1, main = false) {
        this.speed = speed;
        this.x = main ? cw / 2 - this.width / 2 : cw / 2 - 250 + MyRandom.getRandomNumber(500 - this.width);
        this.y = main ? ch - this.height - 10 : - MyRandom.getRandomNumber(500) - this.height;
        this.color = main ? 'rgb(255, 34, 34)' : MyRandom.getRandomColor();
    }

    changeState() {
        this.mileage += this.speed / 100;
        if (this.mileage / this.speed > this.speed) {
            this.increaseSpeed(1);
        }
        this.fuel -= this.speed / 100;
    }

    increaseSpeed(speed: number) {
        this.speed += speed;
    }

    draw(ctx, cw, ch) {
        this.roundedRect(ctx, this.x, this.y, this.width, this.height, 5, this.color);

        this.roundedRect(ctx, this.x + 2, this.y + 15, this.width - 4, 5, 2, 'rgb(0, 162, 232)');
        this.roundedRect(ctx, this.x + 2, this.y + 35, this.width - 4, 5, 2, 'rgb(0, 162, 232)');
        // ctx.fillRect(this.x, this.y + 10, this.width, 5);
        // ctx.fillRect(this.x, this.y + 40, this.width, 5);
    }

    changePosition(speed, cw, ch) {
        this.y += this.speed;
        if (this.y - this.height > ch) {
            this.x = cw / 2 - 250 + MyRandom.getRandomNumber(500 - this.width);
            this.y = - MyRandom.getRandomNumber(100) - this.height;
            this.color = MyRandom.getRandomColor();
            this.speed = 0.5 + Math.random() * (speed - 0.5);
        }
    }

    move(cw, ch, mouseX, mouseY) {
        if (mouseX < this.x) {
            this.x -= Math.min(this.speed, this.x - mouseX);
        } else if (mouseX > this.x) {
            this.x += Math.min(this.speed, mouseX - this.x);
        }
        this.x = this.x < cw / 2 - 250 ? this.x = cw / 2 - 250 : this.x;
        this.x = this.x > cw / 2 + 250 - this.width ? this.x = cw / 2 + 250 - this.width : this.x;

        if (mouseY < this.y) {
            this.y -= Math.min(this.speed, this.y - mouseY);
        } else if (mouseY > this.y) {
            this.y += Math.min(this.speed, mouseY - this.y);
        }
        this.y = this.y < 0 ? this.y = 0 : this.y;
        this.y = this.y > ch - 10 - this.height ? this.y = ch - 10 - this.height : this.y;
    }

    roundedRect(ctx, x, y, width, height, radius, color) {
        ctx.beginPath();
        ctx.moveTo(x, y + radius);
        ctx.lineTo(x, y + height - radius);
        ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
        ctx.lineTo(x + width - radius, y + height);
        ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
        ctx.lineTo(x + width, y + radius);
        ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
        ctx.lineTo(x + radius, y);
        ctx.quadraticCurveTo(x, y, x, y + radius);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.stroke();
    }

    playBumpSound(audioCtx) {
        // const audio = new Audio();
        // audio.src = "../../../assets/sounds/button_1.mp3";
        // audio.load();
        // audio.play();


        // All arguments are optional:

        // duration of the tone in milliseconds. Default is 500
        // frequency of the tone in hertz. default is 440
        // volume of the tone. Default is 1, off is 0.
        // type of tone. Possible values are sine, square, sawtooth, triangle, and custom. Default is sine.
        // callback to use on end of tone

        const duration = 100;
        const frequency = 140;
        // const volume = 0.01;
        const type = 'square';
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        if (this.volume) { gainNode.gain.value = this.volume; }
        if (frequency) { oscillator.frequency.value = frequency; }
        if (type) { oscillator.type = type; }


        oscillator.start();
        setTimeout(() => {
            oscillator.stop();
            this.oscillator.stop();
        }, duration);
    }

    playCanisterSound(audioCtx) {
        const duration = 100;
        const frequency = 840;
        // const volume = 0.01;
        const type = 'square';
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        if (this.volume) { gainNode.gain.value = this.volume; }
        if (frequency) { oscillator.frequency.value = frequency; }
        if (type) { oscillator.type = type; }


        oscillator.start();
        setTimeout(() => { oscillator.stop(); }, duration);
    }

    playEngineSound(audioCtx) {
        const frequency = 15;
        // const volume = 0.01;
        const type = 'square';
        this.oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        this.oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        gainNode.gain.value = this.volume;
        this.oscillator.frequency.value = frequency;
        this.oscillator.type = type;

        this.oscillator.start();
    }
}

class House {
    x;
    y;
    width = 30;
    height = 50;
    a = 50;
    color;
    roofColor;
    doorColor;

    constructor(cw, ch) {
        this.x = MyRandom.getRandomNumber(cw / 2 - 250 - this.a);
        this.y = MyRandom.getRandomNumber(ch);
        this.color = MyRandom.getRandomColor();
        this.roofColor = MyRandom.getRandomColor();
        this.doorColor = MyRandom.getRandomColor();
    }

    draw(ctx) {

        const relativeY = this.y;

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.a, this.a);
        ctx.rect(this.x, this.y, this.a, this.a);
        ctx.strokeRect(this.x, this.y, this.a, this.a);

        // triangle
        ctx.fillStyle = this.roofColor;
        ctx.beginPath();
        ctx.moveTo(this.x, relativeY);
        ctx.lineTo(this.x + this.a / 2, relativeY - this.a / 2);
        ctx.lineTo(this.x + this.a, relativeY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // windows
        const xA = this.a / 5;
        // 1.
        ctx.fillStyle = 'rgb(0, 162, 232)';
        ctx.strokeRect(this.x + xA, this.y + xA, xA, xA);
        ctx.fillRect(this.x + xA, this.y + xA, xA, xA);
        ctx.beginPath();
        ctx.moveTo(this.x + xA, this.y + xA + xA / 2);
        ctx.lineTo(this.x + xA + xA, this.y + xA + xA / 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.x + xA + xA / 2, this.y + xA);
        ctx.lineTo(this.x + xA + xA / 2, this.y + xA + xA);
        ctx.stroke();
        // 2.
        ctx.strokeRect(this.x + xA + xA + xA, this.y + xA, xA, xA);
        ctx.fillRect(this.x + xA + xA + xA, this.y + xA, xA, xA);
        ctx.beginPath();
        ctx.moveTo(this.x + xA + xA + xA, this.y + xA + xA / 2);
        ctx.lineTo(this.x + xA + xA + xA + xA, this.y + xA + xA / 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.x + xA + xA / 2 + xA + xA, this.y + xA);
        ctx.lineTo(this.x + xA + xA / 2 + xA + xA, this.y + xA + xA);
        ctx.stroke();
        // 3.
        ctx.strokeRect(this.x + xA + xA + xA, this.y + xA + xA + xA, xA, xA);
        ctx.fillRect(this.x + xA + xA + xA, this.y + xA + xA + xA, xA, xA);
        ctx.beginPath();
        ctx.moveTo(this.x + xA + xA + xA, this.y + xA + xA / 2 + xA + xA);
        ctx.lineTo(this.x + xA + xA + xA + xA, this.y + xA + xA / 2 + xA + xA);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.x + xA + xA / 2 + xA + xA, this.y + xA + xA + xA);
        ctx.lineTo(this.x + xA + xA / 2 + xA + xA, this.y + xA + xA + xA + xA);
        ctx.stroke();

        // door
        ctx.fillStyle = this.doorColor;
        ctx.strokeRect(this.x + xA, this.y + xA + xA + xA, xA, xA + xA - 2);
        ctx.fillRect(this.x + xA, this.y + xA + xA + xA, xA, xA + xA - 2);

    }

    changePosition(speed: number, cw, ch) {
        this.y += speed;
        if (this.y - this.a > ch) {
            this.x = MyRandom.getRandomNumber(cw / 2 - 250 - this.a);
            this.y = - MyRandom.getRandomNumber(100) - this.height;
            this.color = MyRandom.getRandomColor();
            this.roofColor = MyRandom.getRandomColor();
            this.doorColor = MyRandom.getRandomColor();
        }
    }
}

interface ITree {
    x;
    y;
    width;
    height;
    a;
    draw(ctx);
    changePosition(speed: number, cw, ch);
}

class Pine implements ITree {
    x;
    y;
    width = 4;
    height = 10;
    a = 30;

    constructor(cw, ch) {
        this.x = cw / 2 + 250 + MyRandom.getRandomNumber(cw / 2 - 250 - this.width);
        this.y = MyRandom.getRandomNumber(ch);
    }

    draw(ctx) {
        let relativeY = this.y;

        ctx.fillStyle = 'rgb(20, 107, 47)';

        // triangle
        ctx.beginPath();
        ctx.moveTo(this.x, relativeY);
        ctx.lineTo(this.x + this.a / 2, relativeY - this.a * Math.sqrt(3) / 2);
        ctx.lineTo(this.x + this.a, relativeY);
        ctx.closePath();
        ctx.fill();

        relativeY += this.a / 2;
        // triangle
        ctx.beginPath();
        ctx.moveTo(this.x, relativeY);
        ctx.lineTo(this.x + this.a / 2, relativeY - this.a * Math.sqrt(3) / 2);
        ctx.lineTo(this.x + this.a, relativeY);
        ctx.closePath();
        ctx.fill();

        relativeY += this.a / 2;
        // triangle
        ctx.beginPath();
        ctx.moveTo(this.x, relativeY);
        ctx.lineTo(this.x + this.a / 2, relativeY - this.a * Math.sqrt(3) / 2);
        ctx.lineTo(this.x + this.a, relativeY);
        ctx.closePath();
        ctx.fill();
        // rectanlge
        ctx.fillStyle = 'rgb(185, 122, 87)';
        ctx.fillRect(this.x + this.a / 2 - this.width / 2, relativeY, this.width, this.height);
    }

    changePosition(speed: number, cw, ch) {
        this.y += speed;
        if (this.y - this.a > ch) {
            this.x = cw / 2 + 250 + this.a + MyRandom.getRandomNumber(cw / 2 - 250 - this.a);
            this.y = - MyRandom.getRandomNumber(100) - this.height;
        }
    }
}

class Maple implements ITree {
    color;
    x;
    y;
    width = 4;
    height = 10;
    a = 20;
    colors = ['rgb(20, 107, 47)', 'rgb(255, 127, 39)', 'rgb(255, 255, 60)', 'rgb(255, 60, 60)', 'rgb(255, 0, 0)', 'rgb(90, 123, 4)'];

    constructor(cw, ch) {
        this.x = cw / 2 + 250 + MyRandom.getRandomNumber(cw / 2 - 250 - this.width);
        this.y = MyRandom.getRandomNumber(ch);
        this.color = this.colors[MyRandom.getRandomNumber(5)];
    }

    draw(ctx) {
        // circle
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.a, 0, 2 * Math.PI, false);
        // ctx.closePath();
        ctx.fill();

        // rectanlge
        ctx.fillStyle = 'rgb(185, 122, 87)';
        ctx.fillRect(this.x - this.width / 2, this.y + this.a, this.width, this.height);
    }

    changePosition(speed: number, cw, ch) {
        this.y += speed;
        if (this.y - this.a > ch) {
            this.x = cw / 2 + 250 + this.a + MyRandom.getRandomNumber(cw / 2 - 250 - this.a);
            this.y = - MyRandom.getRandomNumber(100) - this.height;
            this.color = this.colors[MyRandom.getRandomNumber(5)];
        }
    }
}

class Canister {
    x: number;
    y: number;
    width = 20;
    height = 20;
    constructor(cw, ch) {
        this.x = cw / 2 - 245 + MyRandom.getRandomNumber(495 - this.width);
        this.y = MyRandom.getRandomNumber(ch);
    }

    draw(ctx) {
        ctx.fillStyle = 'rgb(136, 0, 21)';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = 'rgb(136, 0, 21)';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x + 5, this.y - 5, this.width - 7, 5);
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(this.x - 3, this.y - 3, 6, 6);
        ctx.strokeStyle = 'rgb(0, 0, 0)';
        ctx.strokeRect(this.x + 4, this.y + 4, this.width - 8, this.height - 8);
        ctx.beginPath();
        ctx.moveTo(this.x + 2, this.y + 2);
        ctx.lineTo(this.x + this.width - 2, this.y + this.height - 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.x + 2, this.y + this.height - 2);
        ctx.lineTo(this.x + this.width - 2, this.y + 2);
        ctx.stroke();
    }

    changePosition(speed: number, cw, ch) {
        this.y += speed;
        if (this.y - this.width > ch) {
            this.x = cw / 2 - 245 + MyRandom.getRandomNumber(495 - this.width);
            this.y = - MyRandom.getRandomNumber(100) - this.height;
        }
    }


}

class RoadStripe {
    x: number;
    y: number;
    width = 10;
    height: number;
    constructor(y, height: number) {
        this.y = y;
        this.height = height;
    }

    draw(ctx, cw) {
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.fillRect(cw / 2 - this.width / 2, this.y, this.width, this.height);
    }

    changePosition(speed: number, minY, ch) {
        this.y += speed;
        this.y = this.y > ch ? this.y = minY - 10 - this.height : this.y;
    }
}

class Dashboard {
    x = 20;
    y = 20;
    width = 100;
    height = 30;
    color = 'rgb(255, 255, 255)';

    constructor() {
    }

    draw(ctx, speed, mileage, fuel) {
        // fuel
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillRect(this.x + this.width, this.y + this.height / 3, 5, this.height / 3);
        if (fuel < 100) {
            ctx.fillStyle = 'rgb(34, 177, 76)';
            const width = this.width - 6;
            ctx.fillRect(this.x + 3 + width * fuel / 100, this.y + 3, width - width * fuel / 100, this.height - 6);
        }
        ctx.font = '1em Lucida Console';
        ctx.fillStyle = fuel < 20 ? 'rgb(255, 0 , 0)' : 'rgb(0, 0 , 0)';
        ctx.textAlign = 'end';
        ctx.fillText(`${Math.round(fuel)} %`, this.x + 80, this.y + 22);

        // speed
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.fillRect(this.x + this.width + 20, this.y, 2 * this.width, this.height);
        ctx.font = '1em Lucida Console';
        ctx.fillStyle = 'rgb(0, 0 , 0)';
        ctx.textAlign = 'end';
        ctx.fillText(`${speed} km/h`, this.x + this.width + 120, this.y + 22);

        // mileage
        ctx.font = '1em Lucida Console';
        ctx.fillStyle = 'rgb(0, 0 , 0)';
        ctx.textAlign = 'end';
        ctx.fillText(`${Math.round(mileage)} km`, this.x + this.width + 200, this.y + 22);
    }
}

export class MyRandom {
    static getRandomColor(): string {
        return `rgb(${this.getRandomNumber(255)}, ${this.getRandomNumber(255)}, ${this.getRandomNumber(255)}, 1)`;
    }

    static getRandomNumber(limit: number = 1) {
        return Math.ceil(Math.random() * limit);
    }

    static getRandomBoolean() {
        return Math.random() < 0.5;
    }
}
