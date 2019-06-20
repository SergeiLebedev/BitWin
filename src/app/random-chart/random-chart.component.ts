import { Component, OnInit } from '@angular/core';
import { ChartDataContainer, ExtendedChartOptions, ChartPoint, DataSeries, CommonEnums, PieChartDataContainer } from '../chart/chart';

@Component({
    selector: 'app-random-chart',
    templateUrl: './random-chart.component.html',
    styleUrls: ['./random-chart.component.css']
})
export class RandomChartComponent implements OnInit {

    public charts = [];
    public pieCharts = [];

    constructor() { }

    ngOnInit() {
        this.onAddChart();

        setInterval(() => {
            this.updateChartsOnDataRangeChanged();
            this.updatePieCharts();
        }, 5000);
    }

    onAddChart() {
        this.charts.push(this.createUpdateChart());
    }

    onCloseChart(object) {
        const foundIndex = this.charts.findIndex(item => item.chartId === object.chartId);
        if (foundIndex > -1) {
            this.charts.splice(foundIndex, 1);
        }
    }

    private updateChartsOnDataRangeChanged() {
        if (this.charts.length > 0) {
            let index = this.charts.length - 1;
            while (index >= 0) {
                this.charts[index] = this.createUpdateChart();
                index--;
            }
        }
    }

    createUpdateChart() {
        // chart apperance
        const options = new ExtendedChartOptions();
        options.drawName = true;
        options.name = `Chart`;
        do {
            options.drawLine = this.getRandomBoolean();
            options.drawDots = this.getRandomBoolean();
            options.drawBar = this.getRandomBoolean();
        } while (!options.drawLine && !options.drawDots && !options.drawBar);

        if (options.drawLine) {
            options.lineType = this.getRandomNumber(4);
            options.lineColor = this.getRandomColor();
            options.lineAnimationTime = 500 + this.getRandomNumber(3000);
            options.lineWidth = `${this.getRandomNumber(3)}px`;
        }
        if (options.drawBar) {
            options.barBorderWidth = 1;
            options.barAnimationTime = 500 + this.getRandomNumber(3000);
            options.barColor = this.getRandomColor();
            options.barOpacity = `${this.getRandomNumber()}`;
        }
        if (options.drawDots) {
            options.dotType = this.getRandomNumber(3);
            options.dotAnimationTime = 500 + this.getRandomNumber(3000);
            options.dotBorderRadius = this.getRandomNumber(10);
            options.dotBorderWidth = this.getRandomNumber(6);
            options.dotColor = this.getRandomColor();
            options.dotOpacity = `${this.getRandomNumber()}`;
            options.dotBorderSquareSideLength = this.getRandomNumber(14);
            options.dotCrossLength = this.getRandomNumber(6);
        }
        options.drawMin = this.getRandomBoolean();
        options.drawMax = options.drawMin;
        options.textMinMaxColor = this.getRandomColor();
        options.drawLegend = true;
        options.legendTextColor = this.getRandomColor();
        options.drawGrid = this.getRandomBoolean();
        options.drawXAxisTitle = true;
        options.drawYAxisTitle = options.drawXAxisTitle;
        options.drawYTicks = true;
        options.drawXTicks = options.drawYTicks;
        options.axisesTextColor = this.getRandomColor();
        options.axisesColor = this.getRandomColor();
        options.drawAllPoints = true;
        options.cssStyle = { 'min-height': '100%', 'min-width': '250px' };
        options.nameOfTitleField = CommonEnums.NamesOfTitleField.pointXY;

        // chart data
        const chartDataPoints = [];
        for (let index = 0; index < Math.ceil(5 + Math.random() * 10); index++) {
            chartDataPoints.push(
                new ChartPoint(
                    this.getRandomNumber(this.getRandomNumber(1000)),
                    this.getRandomNumber(this.getRandomNumber(1000))));
        }

        const chart = new ChartDataContainer(`Change Points`, null, options);
        chart.dataArray.push(new DataSeries(chartDataPoints, null, 'legend'));
        chart.prepareData();
        chart.loading = false;
        return chart;
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


    onAddPieChart() {
        this.pieCharts.push(new PieChartDataContainer());
    }

    onClosePieChart(index) {
        this.pieCharts.splice(index, 1);
    }

    updatePieCharts() {
        const length = this.pieCharts.length;
        this.pieCharts = [];
        for (let index = 0; index < length; index++) {
            this.pieCharts.push(new PieChartDataContainer());
        }
    }

}
