import * as d3 from 'd3';

var x, y, xAxis, yAxis, svg, height;

export const BarChart = (element) => {
    // set the dimensions and margins of the graph
    var margin = { top: 30, right: 30, bottom: 70, left: 60 };
    var width = 460 - margin.left - margin.right;
    height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    svg = d3.select(element)
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Initialize the X axis
    x = d3.scaleBand()
    .range([ 0, width ])
    .padding(0.2);
    xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")

    // Initialize the Y axis
    y = d3.scaleLinear()
    .range([ height, 0]);
    yAxis = svg.append("g")
    .attr("class", "myYaxis")

    update('var1');
}

// A function that create / update the plot for a given variable:
export const update = (selectedVar) => {
    // Parse the Data
    d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/barplot_change_data.csv", function(data) {
  
      // X axis
      x.domain(data.map(function(d) { return d.group; }))
      xAxis.transition().duration(1000).call(d3.axisBottom(x))
  
      // Add Y axis
      y.domain([0, d3.max(data, function(d) { return +d[selectedVar] }) ]);
      yAxis.transition().duration(1000).call(d3.axisLeft(y));
  
      // variable u: map data to existing bars
      var u = svg.selectAll("rect")
        .data(data)
  
      // update bars
      u
        .enter()
        .append("rect")
        .merge(u)
        .transition()
        .duration(1000)
          .attr("x", function(d) { return x(d.group); })
          .attr("y", function(d) { return y(d[selectedVar]); })
          .attr("width", x.bandwidth())
          .attr("height", function(d) { return height - y(d[selectedVar]); })
          .attr("fill", "#69b3a2")
    })
  
  }