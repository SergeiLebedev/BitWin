import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-pie-chart',
    templateUrl: './pie-chart.component.html',
    styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit, AfterViewInit {

    private static counter = 0;
    // @Input() chart: ChartDataContainer;
    // @Input() loading: boolean;
    @Input() resize: boolean;
    @Output() callback = new EventEmitter();
    slices: PieChartSlice[];
    private svgChart;
    private svgLegend;
    chartId: string;
    legendId: string;

    constructor() { }

    ngOnInit() {
        this.chartId = 'pie-chart-' + (++PieChartComponent.counter);
        this.legendId = 'pie-legend-' + PieChartComponent.counter;
    }

    ngAfterViewInit() {
        this.svgChart = d3.select('#' + this.chartId);
        this.svgLegend = d3.select('#' + this.legendId);

        const area = this.svgChart.node().getBoundingClientRect();
        const gChart = this.svgChart.append('g').attr('id', 'chart-main-' + this.chartId).attr('transform', `translate(${100},${100})`);

        this.drawPieChart();
    }

    drawPieChart() {
        // this.slices = new Array<PieChartSlice>();
        // let percent = this.getRandomNumber(100);
        // this.slices.push(new PieChartSlice(percent, this.getRandomColor()));
        // percent = this.getRandomNumber(100 - percent);
        // this.slices.push(new PieChartSlice(percent, this.getRandomColor()));
        // percent = 100 - percent;
        // this.slices.push(new PieChartSlice(percent, this.getRandomColor()));

        // this.svgChart.append('g');
        const arcGenerator = d3.arc();
        arcGenerator
            .innerRadius(this.getRandomNumber(50))
            .outerRadius(80)
            .padAngle(.02)
            .padRadius(80)
            .cornerRadius(this.getRandomNumber(10));

        const arcData = [];
        // [   { startAngle: 0, endAngle: 0.2 },
        //     { startAngle: 0.2, endAngle: 0.6 },
        //     { startAngle: 0.6, endAngle: 1.4 },
        //     { startAngle: 1.4, endAngle: 3 },
        //     { startAngle: 3, endAngle: 2 * Math.PI }
        // ];

        let startAngle = 0;
        let endAngle = 0;
        const pi2 = 2 * Math.PI;
        while (endAngle < pi2) {
            endAngle = Math.ceil(Math.random() * 10) / 10;
            endAngle = startAngle + endAngle < pi2 ? startAngle + endAngle : pi2;
            arcData.push({ startAngle: startAngle, endAngle: endAngle });
            startAngle = endAngle;
        }

        d3.select('#chart-main-' + this.chartId)
            .selectAll('path')
            .data(arcData)
            .enter()
            .append('path')
            .attr('d', arcGenerator)
            .style('fill', d => this.getRandomColor());


    }

    getRandomNumber(limit = 1) {
        return Math.ceil(Math.random() * limit);
    }

    getRandomColor() {
        return `rgb(${this.getRandomNumber(255)},${this.getRandomNumber(255)},${this.getRandomNumber(255)})`;
    }

}

class PieChartSlice {
    percent: number; // 0-1
    color;
    constructor(percent, color) {
        this.percent = percent;
        this.color = color;
    }
}
