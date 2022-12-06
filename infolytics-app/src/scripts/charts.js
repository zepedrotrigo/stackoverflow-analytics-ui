function horizontalBarChart() {
    // set the dimensions and margins of the graph
    var margin = {top: 50, right: 100, bottom: 150, left: 250},
    w = document.getElementById('horizontal_bar_chart').offsetWidth;
    h = document.getElementById('horizontal_bar_chart').offsetHeight;
    height = h - h*(margin.top/1000) - h*(margin.bottom/1000);
    width = w - w*(margin.right/1000) - w*(margin.left/1000);

    // append the svg object to the body of the page
    var svg = d3.select("#horizontal_bar_chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    var country = document.getElementById("country").value;
    
    // Parse the Data
    d3.csv("../edLevel_avgSalary.csv", function(data) {

    // Add X axis
    var x = d3.scaleLinear()
    .domain([0, 300000])
    .range([ 0, width]);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end")
    .attr("fill", "grey" );

    // Y axis
    var y = d3.scaleBand()
    .range([ 0, height ])
    .domain(data.map(function(d) { return d.edLevel; }))
    .padding(.15);
    svg.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .attr("transform", "translate(0,0)")
    .style("text-anchor", "end")
    .attr("fill", "grey" );

    //Bars
    svg.selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
    .on("mouseover", onMouseOver) // Add listener for event
    .on("mouseout", onMouseOut)
    .attr("x", x(0) )
    .attr("y", function(d) { return y(d.edLevel); })
    .attr("width", function(d) { return x(0); })
    .attr("height", y.bandwidth() )
    .attr("fill", "#69b3a2")

    // Animation
    svg.selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", function(d) { return y(d.edLevel); })
    .attr("width", function(d) { return x(d.avgSalary); })
    .delay(function(d,i){console.log(i) ; return(i*100)})

    })

    // Title
    svg.append('text')
    .attr('x', width/3)
    .attr('y', -30)
    .attr('text-anchor', 'middle')
    .style('font-family', 'Helvetica')
    .style('font-size', '24px')
    .text('Average Salary by Educational Level')
    .attr("fill", "white" );

    // X label
    svg.append('text')
    .attr('x', width + 30)
    .attr('y', height + 45)
    .attr('text-anchor', 'middle')
    .style('font-family', 'Helvetica')
    .style('font-size', '12')
    .text('Average Salary')
    .attr("fill", "white" );
    
    // Y label
    svg.append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', 'translate(-20,-5)rotate(0)')
    .style('font-family', 'Helvetica')
    .style('font-size', '12')
    .text('Educational Level')
    .attr("fill", "white" );

    

    function onMouseOver(d, i) {
        // Get bar's xy values, ,then augment for the tooltip
        var xPos = 1500;
        var yPos = 25;

        // Update Tooltip's position and value
        d3.select('#tooltip')
            .style('left', xPos + 'px')
            .style('top', yPos + 'px')
            .select('#textLabel')
            .text(d.edLevel)
        
        d3.select('#tooltip')
            .style('left', xPos + 'px')
            .style('top', yPos + 'px')
            .select('#value')
            .text(d.avgSalary)
            
        
        d3.select('#tooltip').classed('hidden', false);

    }

    // Mouseout event handler
    function onMouseOut(d, i){
        d3.select('#tooltip').classed('hidden', true);
    }

}

function bar_chart_gender(){
    // set the dimensions and margins of the graph
    var margin2 = {top: 50, right: 200, bottom: 400, left: 150},
    w2 = document.getElementById('bar_chart_gender').offsetWidth;
    h2 = document.getElementById('bar_chart_gender').offsetHeight;
    height2 = h2 - h2*(margin2.top/1000) - h2*(margin2.bottom/1000);
    width2 = w2 - w2*(margin2.right/1000) - w2*(margin2.left/1000);

    // append the svg object to the body of the page
    var svg = d3.select("#bar_chart_gender")
    .append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin2.left + "," + margin2.top + ")");

    // Parse the Data
    d3.csv("../job_salary.csv", function(data) {

    // List of subgroups = header of the csv files = soil condition here
    var subgroups = data.columns.slice(1)

    // List of groups = species here = value of the first column called group -> I show them on the X axis
    var groups = d3.map(data, function(d){return(d.job)}).keys()

    // Add X axis
    var x = d3.scaleBand()
    .domain(groups)
    .range([0, width2])
    .padding([0.4])
    svg.append("g")
    .attr("transform", "translate(0," + height2 + ")")
    .call(d3.axisBottom(x).tickSize(0))
    .selectAll("text")
    .attr("transform", "translate(-5,0)rotate(-35)")
    .style("text-anchor", "end")
    .attr("fill", "grey" );

    // Add Y axis
    var y = d3.scaleLinear()
    .domain([0, 250000])
    .range([ height2, 0 ]);
    svg.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .attr("transform", "translate(0,0)")
    .style("text-anchor", "end")
    .attr("fill", "grey" );

    // Another scale for subgroup position?
    var xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05])

    // color palette = one color per subgroup
    var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#0eab00','#4d91ff','#ff96e1'])

    // Show the bars
    svg.append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(data)
    .enter()
    .append("g")
    .attr("transform", function(d) { return "translate(" + x(d.job) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
    .attr("x", function(d) { return xSubgroup(d.key); })
    .attr("y", function(d) { return y(d.value); })
    .attr("width", xSubgroup.bandwidth())
    .attr("height", function(d) { return height2 - y(d.value); })
    .attr("fill", function(d) { return color(d.key); });

    })

    // Title
    svg.append('text')
    .attr('x', width/3)
    .attr('y', -30)
    .attr('text-anchor', 'middle')
    .style('font-family', 'Helvetica')
    .style('font-size', '24px')
    .text('Average Salary per Developer Type by Gender')
    .attr("fill", "white" );

    // X label
    svg.append('text')
    .attr('x', width*2.65)
    .attr('y', height)
    .attr('text-anchor', 'middle')
    .style('font-family', 'Helvetica')
    .style('font-size', '12')
    .text('Developer Type')
    .attr("fill", "white" );
    
    // Y label
    svg.append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', 'translate(-20,-5)rotate(0)')
    .style('font-family', 'Helvetica')
    .style('font-size', '12')
    .text('Average Salary')
    .attr("fill", "white" );
}

function onChangeSelection(){
    
}

horizontalBarChart();
bar_chart_gender();