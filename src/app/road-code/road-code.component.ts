import { Component, OnInit } from '@angular/core';
import { Test, Questions } from './questions';

@Component({
    selector: 'app-road-code',
    templateUrl: './road-code.component.html',
    styleUrls: ['./road-code.component.css']
})
export class RoadCodeComponent implements OnInit {

    tests = new Array<Test>();
    currentTest: Test;
    currentQuestion: number;
    currentAnswer: string;
    rightAnswers: number;
    wrongAnswers: number;
    picturesPath = '/assets/driver_test/';
    questionsNumber = 35;

    constructor() { }

    ngOnInit() {
        const questions = new Questions().questions;
        let questionsLeft = questions.length;
        let questionsForTest = this.questionsNumber;
        for (let index = 0; index < questions.length; index += this.questionsNumber) {
            const test = new Test();
            questionsLeft -= this.questionsNumber;
            questionsForTest = Math.min(this.questionsNumber, questionsLeft);
            if (questionsForTest >= this.questionsNumber) {
                for (let i = index; i < index + questionsForTest; i++) {
                    test.questions.push(questions[i]);
                }
                this.tests.push(test);
            } else if (questionsForTest > 0) {
                let testIndex = 0;
                for (let i = index; i < index + questionsForTest; i++) {
                    this.tests[testIndex].questions.push(questions[i]);
                    testIndex++;
                    if (testIndex > this.tests.length) { testIndex = 0; }
                }
            }
        }
    }

    startTest(test: Test) {
        this.currentTest = test;
        this.currentTest.mixTest();
        this.currentQuestion = 0;
        this.currentAnswer = '';
        this.rightAnswers = 0;
        this.wrongAnswers = 0;
        this.currentTest.questions.forEach(question => question.checked = false);
    }

    nextQuestion() {
        this.currentQuestion = this.currentQuestion < this.questionsNumber ? this.currentQuestion + 1 : this.currentQuestion;
        this.currentAnswer = '';
    }

    checkAnswer(i: number) {
        if (!this.currentTest.questions[this.currentQuestion].checked) {
            this.currentTest.questions[this.currentQuestion].checked = true;

            this.currentAnswer = i.toString();
            if (this.currentTest.questions[this.currentQuestion].answer === this.currentAnswer) {
                this.rightAnswers++;
            } else {
                this.wrongAnswers++;
            }
        }
    }
}
