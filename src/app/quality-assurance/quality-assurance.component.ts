import { Component, OnInit } from '@angular/core';
import { ChartDataContainer, ExtendedChartOptions, CommonEnums, DataSeries, ChartPoint } from '../chart/chart';

@Component({
    selector: 'app-quality-assurance',
    templateUrl: './quality-assurance.component.html',
    styleUrls: ['./quality-assurance.component.css']
})
export class QualityAssuranceComponent implements OnInit {

    public chart: ChartDataContainer;
    chartId = 'quality-assuarance';

    constructor() { }

    ngOnInit() {
        this.createUpdateChart();
    }

    createUpdateChart() {
        // chart apperance
        const options = new ExtendedChartOptions();
        options.drawName = true;
        options.name = `Quality assuarance`;
        options.drawLine = true;
        options.lineType = CommonEnums.LineType.CurveBasis;
        options.lineColor = this.getRandomColor();
        options.lineAnimationTime = 500 + this.getRandomNumber(3000);
        options.lineWidth = `${3 + this.getRandomNumber(3)}px`;

        options.drawBar = true;
        options.barBorderWidth = 1;
        options.barAnimationTime = 500 + this.getRandomNumber(3000);
        options.barColor = this.getRandomColor();
        options.barOpacity = `${this.getRandomNumber()}`;

        options.drawDots = false;
        options.dotType = CommonEnums.DotType.CIRCLE;
        options.dotAnimationTime = 0;
        options.dotBorderRadius = this.getRandomNumber(3);
        options.dotBorderWidth = this.getRandomNumber(2);
        options.dotColor = this.getRandomColor();
        options.dotOpacity = `${this.getRandomNumber()}`;

        options.drawMin = false;
        options.drawMax = false;
        options.textMinMaxColor = this.getRandomColor();
        options.drawLegend = true;
        options.legendTextColor = options.lineColor;
        options.drawGrid = true;
        options.drawXAxisTitle = true;
        options.drawYAxisTitle = options.drawXAxisTitle;
        options.drawYTicks = false;
        options.drawXTicks = options.drawYTicks;
        options.additionalTextForPoint = true;
        options.additionalTextForPointSize = '1rem';
        options.axisesTextColor = this.getRandomColor();
        options.axisesColor = this.getRandomColor();
        options.drawAllPoints = true;
        options.cssStyle = { 'min-height': '100%', 'min-width': '250px' };
        options.addValueTitles = false;
        options.nameOfTitleField = CommonEnums.NamesOfTitleField.title;

        // chart data
        const chartDataPoints = [];
        // const x = 6.5;
        // for (let index = x; index <= 8; index += 0.5) {
        //     chartDataPoints.push(new ChartPoint(index, this.f(index)));
        // }
        // chartDataPoints.push(new ChartPoint(8.5, this.f(8.5), null, null, false));
        chartDataPoints.push(new ChartPoint(1, 10, null, ''));
        chartDataPoints.push(new ChartPoint(2, 20, null, 'UI'));
        chartDataPoints.push(new ChartPoint(3, 40, null, 'CE'));
        chartDataPoints.push(new ChartPoint(4, 80, null, 'Ts'));
        chartDataPoints.push(new ChartPoint(5, 300, null, 'SP', false));

        this.chart = new ChartDataContainer(`Quality assuarance`, null, options, this.chartId);
        this.chart.dataArray.push(new DataSeries(chartDataPoints, null, 'Quality', 'step', 'QA'));
        this.chart.prepareData();
        this.chart.loading = false;
    }

    f(x) {
        const a = 1;
        const b = 4;
        const c = 0;
        const d = 1;
        const z = 1;
        return a * Math.pow(b, z * x + c) + d;
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
