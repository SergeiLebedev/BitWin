import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MathSettings } from './math-settings';

@Injectable({
  providedIn: 'root'
})
export class MathService {
  private _mathSettings = new BehaviorSubject<MathSettings>(new MathSettings());

  constructor() { }

  public getMathSettings(): Observable<MathSettings> {
    return this._mathSettings.asObservable();
  }

  public setMathSettings(mathSettings: MathSettings): void {
    this._mathSettings.next(mathSettings)
  }
}
