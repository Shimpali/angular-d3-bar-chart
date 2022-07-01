import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import * as d3 from 'd3';

export interface ChartMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

@Component({
  selector: 'app-bar-chart',
  template: '<div class="d3-chart" #chart></div>',
  styleUrls: ['./bar-chart.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class BarChartComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('chart') private chartContainer: ElementRef<HTMLElement>;
  @Input() private data: Array<any>;
  private margin: ChartMargin = { top: 20, bottom: 20, left: 20, right: 20 };
  private chart: any;
  private width: number;
  private height: number;
  private xScale: d3.ScaleBand<string>;
  private yScale: d3.ScaleLinear<number, number, never>;
  private xAxis: any;
  private yAxis: any;
  private svg: any;
  private tooltip: any;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.initSvg();
    this.initAxis();
    this.drawAxis();
    this.createChart();

    if (this.data) {
      this.updateScales();
      this.updateAxis();
      this.updateChart();
    }

    this.handleMouseOver();
    this.handleMouseOut();
    this.handleClick();
  }

  ngOnChanges() {
    if (this.chart) {
      this.updateScales();
      this.updateAxis();
      this.updateChart();
    }
  }

  private initSvg() {
    const element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
    this.svg = d3
      .select(element)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .style('overflow', 'visible');

    this.tooltip = d3
      .select(element)
      .append('div')
      .attr('class', 'chart-tooltip')
      .style('opacity', 0);
  }

  private initAxis() {
    // define X & Y domains
    const xDomain = this.data.map((d) => d[0]);
    const yDomain = [0, d3.max(this.data, (d) => d[1])];

    // create scales
    this.xScale = d3
      .scaleBand()
      .domain(xDomain)
      .rangeRound([0, this.width])
      .padding(0.8);
    this.yScale = d3.scaleLinear().domain(yDomain).rangeRound([this.height, 0]);
  }

  private drawAxis() {
    this.xAxis = this.svg
      .append('g')
      .attr('class', 'axis axis-x')
      .attr(
        'transform',
        `translate(${this.margin.left}, ${this.margin.top + this.height})`
      )
      .call(d3.axisBottom(this.xScale).tickSize(0));
    this.yAxis = this.svg
      .append('g')
      .attr('class', 'axis axis-y')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
      .call(d3.axisLeft(this.yScale).tickSize(0));
  }

  createChart() {
    this.chart = this.svg
      .append('g')
      .attr('class', 'bars')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
  }

  updateScales() {
    this.xScale.domain(this.data.map((d) => d[0]));
    this.yScale.domain([0, d3.max(this.data, (d) => d[1])]);
  }

  updateAxis() {
    this.xAxis.transition().call(d3.axisBottom(this.xScale).tickSize(0));
    this.yAxis.transition().call(d3.axisLeft(this.yScale).tickSize(0));
  }

  updateChart() {
    const update = this.chart.selectAll('.bar').data(this.data);

    // remove exiting bars
    update.exit().remove();

    if (this.chart.selectAll('.bar').empty()) {
      this.svg
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('viewBox', `0 0 ${this.width} ${this.height}`) // For responsive chart
        .style('overflow', 'visible');
    }

    // update existing bars
    this.chart
      .selectAll('.bar')
      .transition()
      .attr('x', (d) => this.xScale(d[0]))
      .attr('y', (d) => this.yScale(d[1]))
      .attr('width', (d) => this.xScale.bandwidth())
      .attr('height', (d) => this.height - this.yScale(d[1]))
      .style('fill', '#006699');

    // add new bars
    update
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => this.xScale(d[0]))
      .attr('y', (d) => this.yScale(0))
      .attr('width', this.xScale.bandwidth())
      .attr('height', 0)
      .style('fill', '#006699')
      .transition()
      .delay((d, i) => i * 10)
      .attr('y', (d) => this.yScale(d[1]))
      .attr('height', (d) => this.height - this.yScale(d[1]));
  }

  handleMouseOver(): void {
    this.chart
      .selectAll('.bar')
      .on('mouseover', (event: MouseEvent, d: any) => {
        this.tooltip.transition().duration(100).style('opacity', 0.7);
        this.tooltip
          .text(`${d[0]} : ${d[1]}`)
          .style('left', `${event?.pageX - 20}px`)
          .style('top', `${event?.pageY}px`);

        this.changeDetectorRef.detectChanges();
      });
  }

  handleMouseOut(): void {
    this.chart.selectAll('.bar').on('mouseout', (event: MouseEvent, d: any) => {
      this.tooltip.transition().duration(50).style('opacity', 0);
      this.changeDetectorRef.detectChanges();
    });
  }

  handleClick(): void {
    this.chart.selectAll('.bar').on('click', (event: MouseEvent, d: any) => {
      console.log(d);
    });
  }
}
