import { MyRandom } from "../car-race/car-race.component";
import { MathSettings } from "../math-settings";
import { MathAction } from "./math-action";

export class Task {
  private _ctx: any;
  private _cw: number;
  private _ch: number;
  private _text: string;
  private _correctAnswer: number;
  private _answers: Array<Answer>;
  private _mathSettings: MathSettings;
  private _actions: Array<MathAction>;
  private _galaxyPath = 'assets/math/galaxy.png';
  private _asteriodPath = 'assets/math/asteroid.png';
  private _saturnPath = 'assets/math/saturn.png';
  private _asteroidSize: any;
  private _rightAnswerIsGiven = false;
  private _firstAttempt = 1;
  private _numberOfCorrectAnswers = 0;
  private _numberOfIncorrectAnswers = 0;
  private _percentage = 0;
  private _audioCtx;
  private _oscillator;
  private _volume = 0.02;
  private _bullets: Array<Bullet>

  constructor(mathSettings: MathSettings, ctx: any, cw: number, ch: number) {
    this._ctx = ctx;
    this._cw = cw;
    this._ch = ch;
    this._mathSettings = mathSettings;
    if (!this._audioCtx) {
      this._audioCtx = new (AudioContext);
  }

    this._initAvailableActions();
    this.generateNewTask();
  }

  public draw(): void {
    // first draw images
    const galaxy = new Image();
    galaxy.src = this._galaxyPath;
    const galaxyHeight = this._ch / 5;
    const galaxyWidth = galaxy.width * galaxyHeight / galaxy.height;
    this._ctx.drawImage(galaxy, this._cw/2 - galaxyWidth / 2, this._ch * 0.15 - galaxyHeight / 2,  galaxyWidth, galaxyHeight);

    const asteroid = new Image();
    asteroid.src = this._asteriodPath;
    const asteroidHeight = this._ch / 10;
    const asteroidWidth = asteroid.width * asteroidHeight / asteroid.height;
    this._answers.forEach((v, i) => {
      this._ctx.drawImage(asteroid, (i + 1) * this._cw / 4 - asteroidWidth / 2, this._ch * 0.4 - asteroidHeight / 2, asteroid.width * asteroidHeight / asteroid.height , asteroidHeight);
    });
    if (!this._asteroidSize) {
      this._asteroidSize = {width: asteroidWidth, height: asteroidHeight};
    }

    // second draw text
    this._ctx.font = 'bold 4em Arial'; // "bold 4em Lucida Console"
    this._ctx.fillStyle = 'hsl(240, 100%, 20%)'; //"hsla(210,95%,45%,1)";
    this._ctx.textAlign = 'center';
    this._ctx.textBaseline = 'middle';
    this._ctx.fillText(this._text, this._cw / 2, this._ch * 0.15);

    this._answers.forEach((v, i) => {
      this._ctx.fillStyle = v.color;
      this._ctx.fillText(v.text, (i + 1) * this._cw / 4 , this._ch * 0.4);
    });

    this.drawBullets();

    this._drawGameStatistic();
  }

  private drawBullets() {
    for (let index = this._bullets.length-1; index > -1 ; index--) {
      const element = this._bullets[index];
      if (!element.checkPosition()) {
        this._bullets.splice(index, 1);
      } else {
        this._answers.forEach((v,i) => {
          if (element.x > ((i + 1) * this._cw / 4 - this._asteroidSize.width / 2) &&
              element.x < ((i + 1) * this._cw / 4 + this._asteroidSize.width / 2) &&
              element.y > (this._ch * 0.4 - this._asteroidSize.height / 2) &&
              element.y < (this._ch * 0.4 + this._asteroidSize.height / 2)) {
            this._bullets.splice(index, 1);
          }
        });
      }
    }

    this._bullets.forEach(bullet => {
      bullet.draw(this._ctx);
      bullet.changePosition();
    });
  }

  private _drawGameStatistic(): void {
    this._ctx.font = 'bold 1em Arial';
    this._ctx.fillStyle = 'hsl(136, 93%, 59%)';
    this._ctx.textAlign = 'start';
    this._ctx.textBaseline = 'middle';
    this._ctx.fillText(`Correct:       ${this._numberOfCorrectAnswers}`, 0, this._ch * 0.05);

    this._ctx.fillStyle = 'hsl(346, 79%, 47%)';
    this._ctx.fillText(`Wrong:         ${this._numberOfIncorrectAnswers}`, 0, this._ch * 0.07);

    this._ctx.fillStyle = this._percentage > 79 ? 'hsl(136, 93%, 59%)' : 'hsl(346, 79%, 47%)';
    this._ctx.fillText(`Percentage: ${this._percentage}%`, 0, this._ch * 0.09);
  }

  public generateNewTask(): void {
    this._correctAnswer = 0;
    this._answers = new Array(3);
    this._rightAnswerIsGiven = false;
    this._firstAttempt = 1;
    this._bullets = [];

    const action = this._actions[this.getRandomNumber(this._actions.length)];
    const firstNumber = this.getRandomNumber(this._mathSettings.maxFirstNumber - this._mathSettings.minFirstNumber) + this._mathSettings.minFirstNumber;
    const secondNumber = this.getRandomNumber(this._mathSettings.maxSecondNumber - this._mathSettings.minSecondNumber) + this._mathSettings.minSecondNumber;
    let actionResult = -1;
    switch (action) {
      case MathAction.Addition:
        actionResult = firstNumber + secondNumber;
        this._text = `${firstNumber} + ${secondNumber}`;
        break;
      case MathAction.Subtraction:
        actionResult = firstNumber - secondNumber;
        this._text = `${firstNumber} - ${secondNumber}`;
        if (!this._mathSettings.negative && actionResult < 0) {
          actionResult = secondNumber - firstNumber;
          this._text = `${secondNumber} - ${firstNumber}`;
        }
        break;
      case MathAction.Multiplication:
        actionResult = firstNumber * secondNumber;
        this._text = `${firstNumber} * ${secondNumber}`;
        break;
      case MathAction.Division:
        actionResult = secondNumber;
        this._text = `${firstNumber * secondNumber} / ${firstNumber}`;
        break;
      default:
        actionResult = firstNumber + secondNumber;
        this._text = `${firstNumber} + ${secondNumber}`;
        break;
    }

    this._correctAnswer = this.getRandomNumber(2);
    this._answers[0] = new Answer(actionResult == 0 ? (actionResult + 5 + this.getRandomNumber(actionResult + 5)).toString() : this.getRandomNumber(actionResult - 1).toString());
    this._answers[1] = new Answer((actionResult + 1 + this.getRandomNumber(actionResult + 1)).toString());
    this._answers[2] = new Answer((actionResult + 5 + this.getRandomNumber(actionResult + 5)).toString());
    this._answers[this._correctAnswer] = new Answer(actionResult.toString());
  }

  public checkAnswers(coordinates: Coordinates) {
    if (!this._rightAnswerIsGiven) {
      this._answers.forEach((v,i) => {
        if (coordinates.x > ((i + 1) * this._cw / 4 - this._asteroidSize.width / 2) &&
            coordinates.x < ((i + 1) * this._cw / 4 + this._asteroidSize.width / 2) &&
            coordinates.y > (this._ch * 0.4 - this._asteroidSize.height / 2) &&
            coordinates.y < (this._ch * 0.4 + this._asteroidSize.height / 2)) {
              if (this._firstAttempt == 1 && this._correctAnswer == i) {
                this._numberOfCorrectAnswers++;
              } else if ((this._firstAttempt == 1 && this._correctAnswer != i) || this._firstAttempt == 2) {
                this._numberOfIncorrectAnswers++;
              }
              this._percentage = Math.round(100*this._numberOfCorrectAnswers/(this._numberOfIncorrectAnswers + this._numberOfCorrectAnswers));
              this._firstAttempt++;
              this._answers[i].color = this._correctAnswer == i ? 'hsl(136, 93%, 59%)' : 'hsl(346, 79%, 47%)';
              if (this._correctAnswer == i) {
                this._rightAnswerIsGiven = true;
                this._playRightAnswerSound();
                setTimeout(() => {
                  this.generateNewTask();
                }, 1500);
              } else {
                this._playWrongAnswerSound();
              }
            }
      });
    }

    this._addBulet(coordinates);
  }

  private _addBulet(coordinates: Coordinates): void {
      const bullet = new Bullet(this._cw, this._ch, coordinates);
      this._bullets.push(bullet);
  }

  private _initAvailableActions() {
    this._actions = [];
    if (this._mathSettings.addition) {
      this._actions.push(MathAction.Addition);
    }
    if (this._mathSettings.subtraction) {
      this._actions.push(MathAction.Subtraction);
    }
    if (this._mathSettings.multiplication) {
      this._actions.push(MathAction.Multiplication);
    }
    if (this._mathSettings.division) {
      this._actions.push(MathAction.Division);
    }
  }

  getRandomNumber(limit: number = 1): number {
    return Math.round(Math.random() * limit);
  }

  private _playWrongAnswerSound(): void {
    const duration = 100;
    const frequency = 140;
    // const volume = 0.01;
    const type = 'square';
    const oscillator = this._audioCtx.createOscillator();
    const gainNode = this._audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this._audioCtx.destination);

    if (this._volume) { gainNode.gain.value = this._volume; }
    if (frequency) { oscillator.frequency.value = frequency; }
    if (type) { oscillator.type = type; }


    oscillator.start();
    setTimeout(() => {
        oscillator.stop();
        this._oscillator.stop();
    }, duration);
}

private _playRightAnswerSound(): void {
    const duration = 100;
    const frequency = 840;
    // const volume = 0.01;
    const type = 'square';
    const oscillator = this._audioCtx.createOscillator();
    const gainNode = this._audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this._audioCtx.destination);

    if (this._volume) { gainNode.gain.value = this._volume; }
    if (frequency) { oscillator.frequency.value = frequency; }
    if (type) { oscillator.type = type; }


    oscillator.start();
    setTimeout(() => { oscillator.stop(); }, duration);
}
}

class Answer {
  constructor(public text: string, public color = 'hsl(240, 100%, 20%)') {}
}

export class Coordinates {
  constructor(public x: number, public y: number) {}
}

class Bullet {
  x: number;
  y: number;
  deltaX: number;
  width = 2;
  height = 10;
  speed = 10;
  cw: number;
  constructor(cw, ch, coordinates: Coordinates) {
      this.x = cw/2;
      this.y = ch - ch / 10;
      this.deltaX = this.speed * (coordinates.x - this.x) / (this.y - coordinates.y);
      this.cw = cw;
  }

  draw(ctx) {
      ctx.strokeStyle = 'red';
      ctx.lineWidth = this.width;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.deltaX, this.y - this.height);
      ctx.stroke();
  }

  changePosition() {
      this.y -= this.speed;
      this.x += this.deltaX;
  }

  checkPosition(): boolean {
    if ((this.y - this.width < 0) || (this.x + this.height < 0) || (this.x + this.height > this.cw)) {
      return false;
    }
    return true; // visible on the screen
  }
}

