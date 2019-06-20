import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as cloud from 'd3-cloud';
import { MyRandom } from '../car-race/car-race.component';

@Component({
    selector: 'app-tag-cloud',
    templateUrl: './tag-cloud.component.html',
    styleUrls: ['./tag-cloud.component.css']
})
export class TagCloudComponent implements OnInit {

    layout;
    // colors = ['navy blue', 'ao', 'tiffany blue', 'maroon', 'patriarch', 'cinnamon',
    //     'silver', 'gray', 'blue', 'green', 'cyan', 'red', 'magenta', 'yellow', '#3582E8', 'black',
    //     'ivory', 'beige', 'brown', 'wheat', 'tan', 'khaki', 'silver', 'gray',
    //     'charcoal', 'blue', 'navy blue', 'royal blue', 'azure', 'cyan', 'aquamarine',
    //     'teal', 'forest green', 'olive', 'chartreuse', 'gold', 'yellow', 'lime',
    //     'coral', 'goldenrod', 'salmon', 'hot pink', 'puce', 'fuchsia', 'mauve',
    //     'lavender', 'plum', 'red', 'maroon', 'indigo', 'crimson'];

    constructor() { }

    ngOnInit() {
        this.drawCloud();
    }

    public drawCloud() {
        const wordsArray = ['Angular', 'jQuery', 'HTML', 'CSS', 'JavaScript', 'TypeScript',
            'PHP', 'SVG', 'Canvas', 'Web-application', 'C#', 'MySQL',
            'PostgreSQL', 'd3', 'RxJS', 'Shopify', 'WordPress', 'SilverStripe', 'Bitrix',
            '1C', 'React', 'Vue', 'ModX']
            .map(d => ({
                text: d, size: 10 + Math.ceil(10 + Math.random() * 100),
                color: `rgb(255,255,230,1)`
                // MyRandom.getRandomColor()
                // this.colors[Math.round(this.colors.length * Math.random())]
            }));
        const wordScale = d3.scaleLinear().domain([10, 110]).range([1, 60]);
        const randomRotate = d3.scaleLinear().domain([0, 1]).range([-60, 60]);
        d3.select('svg').remove();
        this.layout = cloud()
            .size([1000, 500])
            .words(wordsArray)
            .padding(5)
            .rotate(() => randomRotate(Math.random()))
            .font('Impact')
            .fontSize(d => wordScale(d.size))
            .on('end', function draw(words) {
                const wordG = d3.select('#cloud').append('svg')
                    .attr('width', this.size()[0])
                    .attr('height', this.size()[1])
                    .append('g')
                    .attr('id', 'wordCloudG')
                    .attr('transform', `translate(${this.size()[0] / 2}, ${this.size()[1] / 2})`);

                wordG.selectAll('text')
                    .data(words)
                    .enter()
                    .append('text')
                    .style('font-size', d => `${d.size}px`)
                    .style('fill', d => d.color)
                    .style('font-family', 'Impact')
                    .style('mix-blend-mode', 'overlay')
                    .style('cursor', 'pointer')
                    .attr('text-anchor', 'middle')
                    .attr('class', 'scale-size-tag')
                    .attr('transform', d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
                    .text(d => d.text);
            })
            .start();
    }
}
