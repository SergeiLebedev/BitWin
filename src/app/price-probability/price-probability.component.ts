import { Component, OnInit } from '@angular/core';
import { ChartDataContainer, ExtendedChartOptions, CommonEnums, DataSeries, ChartPoint } from '../chart/chart';

@Component({
    selector: 'app-price-probability',
    templateUrl: './price-probability.component.html',
    styleUrls: ['./price-probability.component.css']
})
export class PriceProbabilityComponent implements OnInit {
    public chart: ChartDataContainer;
    chartId = 'price-probability';

    constructor() { }

    ngOnInit() {
        this.createUpdateChart();
    }

    createUpdateChart() {
        // chart apperance
        const options = new ExtendedChartOptions();
        options.drawName = true;
        options.name = `Price probability`;
        options.drawLine = true;
        options.lineType = CommonEnums.LineType.CurveCardinal;
        options.lineColor = this.getRandomColor();
        options.lineAnimationTime = 500 + this.getRandomNumber(3000);
        options.lineWidth = `${this.getRandomNumber(3)}px`;

        options.drawDots = true;
        options.dotType = CommonEnums.DotType.CIRCLE;
        options.dotAnimationTime = 500;
        options.dotBorderRadius = this.getRandomNumber(3);
        options.dotBorderWidth = this.getRandomNumber(2);
        options.dotColor = this.getRandomColor();
        options.dotOpacity = `${this.getRandomNumber()}`;

        options.drawMin = false;
        options.drawMax = true;
        options.textMinMaxColor = this.getRandomColor();
        options.drawLegend = true;
        options.legendTextColor = options.lineColor;
        options.drawGrid = true;
        options.drawXAxisTitle = true;
        options.rotateXticks = true;
        options.drawYAxisTitle = options.drawXAxisTitle;
        options.drawYTicks = true;
        options.drawXTicks = options.drawYTicks;
        options.axisesTextColor = this.getRandomColor();
        options.axisesColor = this.getRandomColor();
        options.drawAllPoints = true;
        options.cssStyle = { 'min-height': '100%', 'min-width': '250px' };
        options.nameOfTitleField = CommonEnums.NamesOfTitleField.yPoint;

        // chart data
        const chartDataPoints = [];
        // const x = 7;
        // const y = 15000;
        // for (let index = 1 - x; index < x; index++) {
        //     chartDataPoints.push(new ChartPoint(x + index, y * this.f(index)));
        // }
        const x = 7;
        const y = 100;
        for (let index = 1 - x; index < x; index++) {
            chartDataPoints.push(new ChartPoint(300 * (x + index), y * this.f(index)));
        }

        this.chart = new ChartDataContainer(`Price probability`, null, options, this.chartId);
        this.chart.dataArray.push(new DataSeries(chartDataPoints, null, 'Project cost', '$', 'N'));
        this.chart.prepareData();
        this.chart.loading = false;
    }

    // Gaussian Distribution
    f(x) {
        const m = 0;
        const sigma = 3;
        return (Math.exp(-1 * Math.pow(x - m, 2) / (2 * Math.pow(sigma, 2)))) / (sigma * Math.sqrt(2 * Math.PI));
    }

    getRandomBoolean() {
        return Math.random() < 0.5;
    }

    getRandomColor(): string {
        return `rgb(${this.getRandomNumber(255)}, ${this.getRandomNumber(255)}, ${this.getRandomNumber(255)})`;
    }

    getRandomNumber(limit: number = 1) {
        return Math.ceil(Math.random() * limit);
    }

}
