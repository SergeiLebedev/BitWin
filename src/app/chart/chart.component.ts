import { Component, OnInit, Input, AfterViewInit, OnChanges, Output, EventEmitter } from '@angular/core';
import * as d3 from 'd3';
import { ChartBuilder } from './chart-builder';
import { ChartDataContainer, CommonEnums, ExtendedChartOptions } from './chart';

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.css']
})

export class ChartComponent implements OnInit, OnChanges, AfterViewInit {
    private static counter = 0;
    @Input() chart: ChartDataContainer;
    @Input() loading: boolean;
    @Input() resize: boolean;
    @Output() callback = new EventEmitter();
    private svgChart;
    private svgLegend;
    private chartBuilder: ChartBuilder;
    private viewInit = false;
    chartId: string;
    legendId: string;

    constructor() { }

    ngOnInit() {
        this.chartId = 'chart-' + (++ChartComponent.counter);
        this.legendId = 'legend-' + ChartComponent.counter;
    }

    ngAfterViewInit() {
        this.svgChart = d3.select('#' + this.chartId);
        this.svgLegend = d3.select('#' + this.legendId);
    }

    ngOnChanges() {
        if (this.viewInit) {
            this.chartBuilder.clearChart();
        }

        if (this.chart.dataArray && this.chart.dataArray.length > 0) {
            setTimeout(() => {
                if (this.chart.options) {
                    this.draw();
                } else {
                    this.drawChart();
                }
                this.viewInit = true;
            }, 300);
        }
    }

    private drawChart() {
        switch (this.chart.type) {
            case CommonEnums.ChartType.LineChart:
                this.drawLineChart();
                break;
            case CommonEnums.ChartType.BarChart:
                this.drawBarsChart();
                break;
            case CommonEnums.ChartType.CrossDotChart:
                this.drawCrossDotChart();
                break;
            case CommonEnums.ChartType.SquareDotChart:
                this.drawSquareDotsChart();
                break;
            case CommonEnums.ChartType.CircleDotChart:
                this.drawCircleDotsChart();
                break;
            case CommonEnums.ChartType.MixedChart:
                this.drawAllChart();
                break;
        }
    }

    private drawLineChart() {
        const options = new ExtendedChartOptions();
        options.drawName = false;
        options.name = this.chart.name;
        options.drawLine = true;
        options.lineType = CommonEnums.LineType.CurveLinear;
        options.drawDots = true;
        options.dotType = CommonEnums.DotType.CIRCLE;
        options.drawMin = true;
        options.drawMax = true;
        options.drawLegend = true;
        options.drawXAxisTitle = false;
        options.drawYAxisTitle = false;

        this.draw(options);
    }

    private drawCrossDotChart() {
        const options = new ExtendedChartOptions();
        options.drawName = false;
        options.name = this.chart.name;
        options.drawDots = true;
        options.dotType = CommonEnums.DotType.CROSS;
        options.dotBorderWidth = 3;
        options.drawMin = true;
        options.drawMax = true;
        options.textMinMaxColor = '#000000';
        options.drawLegend = true;
        options.drawXAxisTitle = false;
        options.drawYAxisTitle = true;
        options.dotAnimationTime = 2000;
        options.drawAllPoints = false;

        this.draw(options);
    }

    private drawSquareDotsChart() {
        const options = new ExtendedChartOptions();
        options.drawName = false;
        options.name = this.chart.name;
        options.drawDots = true;
        options.dotType = CommonEnums.DotType.SQUARE;
        options.drawMin = true;
        options.drawMax = true;
        options.drawLegend = true;
        options.drawXAxisTitle = false;
        options.drawYAxisTitle = false;

        this.draw(options);
    }

    private drawCircleDotsChart() {
        const options = new ExtendedChartOptions();
        options.drawName = false;
        options.name = this.chart.name;
        options.drawDots = true;
        options.dotType = CommonEnums.DotType.CIRCLE;
        options.drawMin = true;
        options.drawMax = true;
        options.drawLegend = true;
        options.drawXAxisTitle = false;
        options.drawYAxisTitle = false;

        this.draw(options);
    }

    private drawBarsChart() {
        const options = new ExtendedChartOptions();
        options.drawName = false;
        options.name = this.chart.name;
        options.drawBar = true;
        options.barBorderWidth = 1;
        options.drawMin = true;
        options.drawMax = true;
        options.textMinMaxColor = '#000000';
        options.drawLegend = false;
        options.drawGrid = false;
        options.drawXAxisTitle = false;
        options.drawYAxisTitle = false;
        options.drawAllPoints = false;

        this.draw(options);
    }

    private drawAllChart() {
        const options = new ExtendedChartOptions();
        options.drawName = true;
        options.name = this.chart.name;
        options.drawLine = true;
        options.lineType = CommonEnums.LineType.StraightPath;
        options.lineColor = options.colors[this.chart.chartId % 10];
        options.drawDots = true;
        options.dotType = CommonEnums.DotType.CROSS;
        options.dotColor = options.colors[1 + this.chart.chartId % 10];
        options.drawBar = true;
        options.barWidth = 5;
        options.barColor = options.colors[2 + this.chart.chartId % 10];
        options.drawMin = true;
        options.drawMax = true;
        options.drawLegend = true;

        this.draw(options);
    }

    draw(options = null) {
        if (options && !this.chart.options) {
            this.chart.options = options;
        }

        const self = this;
        this.chartBuilder = new ChartBuilder((element, action) => {
            self.callback.emit({object: element.object, action: action});
        });
        this.chartBuilder.drawChart(this.chart, this.svgChart, this.svgLegend);
    }

    getDefaultCSSStyle() {
        const options = new ExtendedChartOptions();
        return options.cssStyle;
    }

    public onMouseEnter(element) {
        this.chartBuilder.onMouseOver(element);
    }

    public onMouseLeave(element) {
        this.chartBuilder.onMouseOut(element);
    }
}
