import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import * as d3 from 'd3';
import { DataService } from '../data.service';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit{

  constructor(private http: HttpClient, private dataService: DataService){}

  ngOnInit(): void {
    // If there is no data stored in data service
    if (this.dataService.isBudgetDataEmpty()) {
      this.dataService.getBudgetData().subscribe((data: any) => {
        // Generating D3JS Donut Chart
        this.populateD3jsChart(data.myBudget);
        this.dataService.setBudgetData(data.myBudget);
        // Generating Pie Chart
        this.createChart(this.dataService.getDataSource());
      });
    } // If data is already stored in data service
    else {
      const existingData = this.dataService.getStoredBudgetData();
      this.populateD3jsChart(existingData);
      this.createChart(this.dataService.getDataSource());
    }
  }
  // Pie Chart Code
  createChart(dataSource: any){
    var ctx = document.getElementById('myChart') as HTMLCanvasElement;

    var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: dataSource
    });
  }
  // D3js Chart Code
  populateD3jsChart(data: any[]): void {
    // set the dimensions and margins of the graph
    const width: number = 420;
    const height: number = 420;
    const margin: number = 40;
    const budgetValues = data.map((d: any) => d.budget);

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    const radius: number = Math.min(width, height) / 2 - margin;

    // append the svg object to the div called 'my_dataviz'
    const svg: any = d3.select("#d3jsChart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // set the color scale
    const color = d3.scaleOrdinal()
    .range(d3.schemeDark2);

    // Compute the position of each group on the pie:
    const pie = d3.pie()
    .sort(null) // Do not sort group by size
    .value((d, i) => budgetValues[i]);

    const data_ready = pie(data);

    // The arc generator
    const arc = d3.arc()
    .innerRadius(radius * 0.45)         // This is the size of the donut hole
    .outerRadius(radius * 0.8);

    // Another arc that won't be drawn. Just for labels positioning
    const outerArc = d3.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
    .selectAll('allSlices')
    .data(data_ready)
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function (d: any) { return (color(d.data.title)) })
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 0.7);

    // Add the polylines between chart and labels:
    svg
    .selectAll('allPolylines')
    .data(data_ready)
    .enter()
    .append('polyline')
    .attr("stroke", "black")
    .style("fill", "none")
    .attr("stroke-width", 1)
    .attr('points', function (d: any) {
        var posA = arc.centroid(d); // line insertion in the slice
        var posB = outerArc.centroid(d); // line break: we use the other arc generator that has been built only for that
        var posC = outerArc.centroid(d); // Label position = almost the same as posB
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // we need the angle to see if the X position will be at the extreme right or extreme left
        posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
        return [posA, posB, posC];
    });

    // Add the polylines between chart and labels:
    svg
    .selectAll('allLabels')
    .data(data_ready)
    .enter()
    .append('text')
    .text(function (d: any) { return d.data.title; })
    .attr('transform', function (d: any) {
        var pos = outerArc.centroid(d);
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
        return 'translate(' + pos + ')';
    })
    .style('text-anchor', function (d: any) {
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return (midangle < Math.PI ? 'start' : 'end');
    });
  }
}
