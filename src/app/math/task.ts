import { MathSettings } from "../math-settings";
import { MathAction } from "./math-action";

export class Task {
  private _ctx: any;
  private _cw: number;
  private _ch: number;
  private _text: string;
  private _correctAnswer: number;
  private _answers: Array<string>;
  private _mathSettings: MathSettings;
  private _actions: Array<MathAction>;

  constructor(mathSettings: MathSettings, ctx: any, cw: number, ch: number) {
    this._ctx = ctx;
    this._cw = cw;
    this._ch = ch;
    this._mathSettings = mathSettings;

    this._initAvailableActions();
    this.generateNewTask();
  }

  public draw(): void {
    this._ctx.font = "3em Lucida Console";
    this._ctx.fillStyle = "hsla(210,95%,45%,.75)";
    this._ctx.textAlign = "end";
    this._ctx.fillText(this._text, this._cw / 2, this._ch * 0.15);

    this._answers.forEach((v, i) => {
      this._ctx.fillText(v, (i + 1) * this._cw / 4 , this._ch * 0.25);
    })

  }

  public generateNewTask(): void {
    this._correctAnswer = 0;
    this._answers = new Array(3);

    const action = this._actions[this.getRandomNumber(this._actions.length)];
    const firstNumber = this.getRandomNumber(this._mathSettings.maxFirstNumber - this._mathSettings.minFirstNumber) + this._mathSettings.minFirstNumber;
    const secondNumber = this.getRandomNumber(this._mathSettings.maxSecondNumber - this._mathSettings.minSecondNumber) + this._mathSettings.minSecondNumber;
    let actionResult = -1;
    switch (action) {
      case MathAction.Addition:
        actionResult = firstNumber + secondNumber;
        this._text = `${firstNumber} + ${secondNumber} =`;
        break;
      case MathAction.Subtraction:
        actionResult = firstNumber - secondNumber;
        this._text = `${firstNumber} - ${secondNumber} =`;
        if (!this._mathSettings.negative && actionResult < 0) {
          actionResult = secondNumber - firstNumber;
          this._text = `${secondNumber} - ${firstNumber} =`;
        }
        break;
      case MathAction.Multiplication:
        actionResult = firstNumber * secondNumber;
        this._text = `${firstNumber} * ${secondNumber} =`;
        break;
      case MathAction.Division:
        actionResult = secondNumber;
        this._text = `${firstNumber * secondNumber} / ${firstNumber} =`;
        break;
      default:
        actionResult = firstNumber + secondNumber;
        this._text = `${firstNumber} + ${secondNumber} =`;
        break;
    }

    this._correctAnswer = this.getRandomNumber(2);
    console.log(this._answers.length);
    this._answers[0] = actionResult == 0 ? (actionResult + 5 + this.getRandomNumber(actionResult + 5)).toString() : this.getRandomNumber(actionResult - 1).toString();
    this._answers[1] = (actionResult + 1 + this.getRandomNumber(actionResult + 1)).toString();
    this._answers[2] = (actionResult + 5 + this.getRandomNumber(actionResult + 5)).toString();
    this._answers[this._correctAnswer] = actionResult.toString();
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
}
