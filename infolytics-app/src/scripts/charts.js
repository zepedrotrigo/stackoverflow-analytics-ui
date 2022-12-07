
// ---------------------------------------- HORIZONTAL BAR CHART WITH AVG SALARY BY EDUCATIONAL LEVEL

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
        var xPos = width + margin.left;
        var yPos = margin.bottom;

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


// ---------------------------------------- BAR CHART WITH AVG SALARY BY GENDER


function bar_chart_gender(){
    // set the dimensions and margins of the graph
    var margin2 = {top: 50, right: 200, bottom: 200, left: 200},
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
    .style('font-size', '12px')
    .attr("fill", "grey" );

    // Add Y axis
    var y = d3.scaleLinear()
    .domain([0, 150000])
    .range([ height2, 0 ]);
    svg.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .attr("transform", "translate(0,0)")
    .style("text-anchor", "end")
    .style('font-size', '12px')
    .attr("fill", "grey" );

    // Another scale for subgroup position?
    var xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05])

    // color palette = one color per subgroup
    var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#69b3a2','#4d99ff','#ff96e1'])

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
    .attr("height", function(d) { return 0; })
    .attr("fill", function(d) { return color(d.key); });

    // Animation
    svg.selectAll("rect")
    .transition()
    .duration(800)
    .attr("x", function(d) { return xSubgroup(d.key); })
    .attr("height", function(d) { return height2 - y(d.value); })
    .delay(function(d,i){console.log(i) ; return(i*25)})

    })

    // Title
    svg.append('text')
    .attr('x', width2/2)
    .attr('y', -30)
    .attr('text-anchor', 'middle')
    .style('font-family', 'Helvetica')
    .style('font-size', '24px')
    .text('Average Salary by Developer Type')
    .attr("fill", "white" );

    // X label
    svg.append('text')
    .attr('x', width2 + 50)
    .attr('y', height2 + 20)
    .attr('text-anchor', 'middle')
    .style('font-family', 'Helvetica')
    .style('font-size', '16')
    .text('Developer Type')
    .attr("fill", "white" );
    
    // Y label
    svg.append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', 'translate(-30,-5)rotate(0)')
    .style('font-family', 'Helvetica')
    .style('font-size', '16')
    .text('Average Salary')
    .attr("fill", "white" );

    svg.append("circle")
    .attr("cx",width2)
    .attr("cy",130)
    .attr("r", 8)
    .style("fill", "#69b3a2")
    svg.append("circle")
    .attr("cx",width2)
    .attr("cy",160)
    .attr("r", 8)
    .style("fill", "#4d99ff")
    svg.append("circle")
    .attr("cx",width2)
    .attr("cy",190)
    .attr("r", 8)
    .style("fill", "#ff96e1")

    svg.append("text")
    .attr("x", width2+15)
    .attr("y", 130)
    .text("Total")
    .style("font-size", "16px")
    .attr("alignment-baseline","middle")
    .style("fill", "white")
    svg.append("text")
    .attr("x", width2+15)
    .attr("y", 160)
    .text("Male")
    .style("font-size", "16px")
    .attr("alignment-baseline","middle")
    .style("fill", "white")
    svg.append("text")
    .attr("x", width2+15)
    .attr("y", 190)
    .text("Female")
    .style("font-size", "16px")
    .attr("alignment-baseline","middle")
    .style("fill", "white")

}


// ---------------------------------------- HPARALLEL GRAPH


function parralel(){
    // set the dimensions and margins of the graph
    var margin3 = {top: 50, right: 100, bottom: 100, left: 100},
    w3 = document.getElementById('parralel').offsetWidth;
    h3 = document.getElementById('parralel').offsetHeight;
    height3 = h3 - h3*(margin3.top/1000) - h3*(margin3.bottom/1000);
    width3 = w3 - w3*(margin3.right/1000) - w3*(margin3.left/1000);

    // append the svg object to the body of the page
    var svg = d3.select("#parralel")
    .append("svg")
    .attr("width", width3 + margin3.left + margin3.right)
    .attr("height", height3 + margin3.top + margin3.bottom)
    .append("g")
    .attr("transform",
            "translate(" + margin3.left + "," + margin3.top + ")");

    // Parse the Data
    d3.csv("../job_salary_experience.csv", function(data) {

    // Color scale: give me a specie name, I return a color
    var color = d3.scaleOrdinal()
        .domain(["Data scientist or machine learning specialist",
        "Developer  front-end",
        "Engineer  data",
        "Engineer  site reliability",
        "Developer  full-stack",
        "Developer  back-end",
        "Developer  desktop or enterprise applications",
        "Developer  QA or test",
        "Student",
        "Developer  mobileEducator",
        "Engineering manager",
        "Database administrator",
        "Academic researcher",
        "DevOps specialist",
        "Other",
        "Developer  embedded applications or devices",
        "Developer  game or graphics",
        "Project manager",
        "Cloud infrastructure engineer",
        "Data or business analyst",
        "Designer",
        "Scientist",
        "Product manager",
        "Senior Executive",
        "System administrator",
        "Blockchain",
        "Marketing or sales professional",
        "Security professional" ])
        .range(['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
        '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
        '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
        '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
        '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
        '#66664D'])

    // Here I set the list of dimension manually to control the order of axis:
    dimensions = ["avgsalary","experience","jobX"]

    // For each dimension, I build a linear scale. I store all in a y object
    var y = {"avgsalary":600000,"experience":65,"jobX":26}
    for (i in dimensions) {
        name = dimensions[i]
        y[name] = d3.scaleLinear()
        .domain( [0,y[name]] ) // --> Same axis range for each group
        // --> different axis range for each group --> .domain( [d3.extent(data, function(d) { return +d[name]; })] )
        .range([height3, 0])
    }

    // Build the X scale -> it find the best position for each Y axis
    x = d3.scalePoint()
        .range([0, width3])
        .domain(dimensions);

    // Highlight the specie that is hovered
    var highlight = function(d){

        selected_specie = d.job

        // first every group turns grey
        d3.selectAll(".line")
        .transition().duration(200)
        .style("stroke", "lightgrey")
        .style("opacity", "0.2")
        // Second the hovered specie takes its color
        d3.selectAll("." + selected_specie)
        .transition().duration(200)
        .style("stroke", color(selected_specie))
        .style("opacity", "1")
    }

    // Unhighlight
    var doNotHighlight = function(d){
        d3.selectAll(".line")
        .transition().duration(200).delay(1000)
        .style("stroke", function(d){ return( color(d.job))} )
        .style("opacity", "1")
    }

    // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
    function path(d) {
        return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
    }

    // Draw the lines
    svg
        .selectAll("myPath")
        .data(data)
        .enter()
        .append("path")
        .attr("class", function (d) { return "line " + d.job } ) // 2 class for each line: 'line' and the group name
        .attr("d",  path)
        .style("fill", "none" )
        .style("stroke", function(d){ return( color(d.job))} )
        .style("opacity", 0.5)
        .on("mouseover", highlight)
        .on("mouseleave", doNotHighlight )

    // Draw the axis:
    svg.selectAll("myAxis")
        // For each dimension of the dataset I add a 'g' element:
        .data(dimensions).enter()
        .append("g")
        .attr("class", "axis")
        // I translate this element to its right position on the x axis
        .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
        // And I build the axis with the call function
        .each(function(d) { d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d])); })
        // Add axis title
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function(d) { return d; })
        .style("fill", "grey")

    })

    // Title
    svg.append('text')
    .attr('x', width/2 + 50)
    .attr('y', -30)
    .attr('text-anchor', 'middle')
    .style('font-family', 'Helvetica')
    .style('font-size', '24px')
    .text('Average Salary by Years of Experience and Job')
    .attr("fill", "white" );
    
}


// ---------------------------------------- BUBBLE CHART


function bubble(){
    // set the dimensions and margins of the graph
    var margin4 = {top: 100, right: 25, bottom: 100, left: 25},
    w4 = document.getElementById('bubble').offsetWidth;
    h4 = document.getElementById('bubble').offsetHeight;
    height4 = h4 - h4*(margin4.top/1000) - h4*(margin4.bottom/1000);
    width4 = w4 - w4*(margin4.right/1000) - w4*(margin4.left/1000);

    // append the svg object to the body of the page
    var svg = d3.select("#bubble")
    .append("svg")
    .attr("width", width4 + margin4.left + margin4.right)
    .attr("height", height4 + margin4.top + margin4.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin4.left + "," + margin4.top + ")");

    //Read the data
    d3.csv("../job_salary_experience.csv", function(data) {

    // Add X axis
    var x = d3.scaleLinear()
    .domain([0, 65])
    .range([ 0, width4 ]);
    svg.append("g")
    .attr("transform", "translate(0," + height4 + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(0,0)")
    .style("text-anchor", "end")
    .style('font-size', '12px')
    .attr("fill", "grey" );

    // Add Y axis
    var y = d3.scaleLinear()
    .domain([0, 30])
    .range([ height4, 0]);
    svg.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .attr("transform", "translate(0,0)")
    .style("text-anchor", "end")
    .style('font-size', '12px')
    .attr("fill", "grey" );

    // Add a scale for bubble size
    var z = d3.scaleLinear()
    .domain([0, 750000])
    .range([ 4, 30]);

    // Add a scale for bubble color
    var myColor = d3.scaleOrdinal()
    .domain(["Data scientist or machine learning specialist",
    "Developer  front-end",
    "Engineer  data",
    "Engineer  site reliability",
    "Developer  full-stack",
    "Developer  back-end",
    "Developer  desktop or enterprise applications",
    "Developer  QA or test",
    "Student",
    "Engineering manager",
    "Database administrator",
    "Academic researcher",
    "DevOps specialist",
    "Other",
    "Developer  embedded applications or devices",
    "Developer  game or graphics",
    "Project manager",
    "Cloud infrastructure engineer",
    "Data or business analyst",
    "Designer",
    "Scientist",
    "Product manager",
    "Senior Executive",
    "System administrator",
    "Blockchain",
    "Marketing or sales professional",
    "Security professional" ])
    .range(d3.schemeSet2);

    // Add dots
    svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return x(d.experience); } )
    .attr("cy", function (d) { return y(d.jobX); } )
    .attr("r", function (d) { return z(d.avgsalary); } )
    .style("fill", function (d) { return myColor(d.job); } )
    .style("opacity", "0.7")
    .attr("stroke", "white")
    .style("stroke-width", "2px")

    })
}


// ---------------------------------------- SCATTER PLOT WITH SALARIES AND COMPANY SIZE


function scatter(){
    // set the dimensions and margins of the graph
    var margin7 = {top: 50, right: 100, bottom: 100, left: 150},
    w7 = document.getElementById('scatter').offsetWidth;
    h7 = document.getElementById('scatter').offsetHeight;
    height7 = h7 - h7*(margin7.top/1000) - h7*(margin7.bottom/1000);
    width7 = w7 - w7*(margin7.right/1000) - w7*(margin7.left/1000);

    // append the svg object to the body of the page
    var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", width7 + margin7.left + margin7.right)
    .attr("height", height7 + margin7.top + margin7.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin7.left + "," + margin7.top + ")");

    //Read the data
    d3.csv("../orgsize_salary.csv", function(data) {

        // Add X axis
        var x = d3.scaleBand()
        .domain(data.map(function(d){ return d.orgsize; }))
        .range([ 0, width7 ]);
        svg.append("g")
        .attr("transform", "translate(0," + height7 + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(0,0)rotate(-25)")
        .style("text-anchor", "end")
        .style('font-size', '12px')
        .attr("fill", "grey" );

        // Add Y axis
        var y = d3.scaleLinear()
        .domain([0, 500000])
        .range([ height7, 0]);
        svg.append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .attr("transform", "translate(0,0)")
        .style("text-anchor", "end")
        .style('font-size', '12px')
        .attr("fill", "grey" );

        // Add dots
        svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .on("mouseover", onMouseOver2) // Add listener for event
        .on("mouseout", onMouseOut2)
        .attr("transform", "translate(26,0)")
        .attr("cx", function (d) { return x(d.orgsize); } )
        .attr("cy", function (d) { return y(d.salary); } )
        .attr("r", 5)
        .style("fill", "#ff0000")
        
        d3.csv("../orgsize_salaryALL.csv", function(data2) {
            // Add dots
            svg.append('g')
            .selectAll("dot")
            .data(data2)
            .enter()
            .append("circle")
            .attr("transform", "translate(26,0)")
            .attr("cx", function (d) { return x(d.orgsize); } )
            .attr("cy", function (d) { return y(d.salary); } )
            .attr("r", 1.5)
            .style("fill", "#69b3a2")
        })

        function onMouseOver2(d, i) {
            // Get bar's xy values, ,then augment for the tooltip
            var xPos = width7*2.75 + margin7.left;
            var yPos = margin7.top + margin7.bottom;
    
            // Update Tooltip's position and value
            d3.select('#tooltip2')
                .style('left', xPos + 'px')
                .style('top', yPos + 'px')
                .select('#textLabel2')
                .text(d.orgsize)
            
            d3.select('#tooltip2')
                .style('left', xPos + 'px')
                .style('top', yPos + 'px')
                .select('#value2')
                .text(d.salary)
                
            
            d3.select('#tooltip2').classed('hidden', false);
    
        }
    
        // Mouseout event handler
        function onMouseOut2(d, i){
            d3.select('#tooltip2').classed('hidden', true);
        }
    })

    // Title
    svg.append('text')
    .attr('x', width/2)
    .attr('y', -30)
    .attr('text-anchor', 'middle')
    .style('font-family', 'Helvetica')
    .style('font-size', '24px')
    .text('Salary by Company Size')
    .attr("fill", "white" );

    // X label
    svg.append('text')
    .attr('x', width + 100)
    .attr('y', height + 45)
    .attr('text-anchor', 'middle')
    .style('font-family', 'Helvetica')
    .style('font-size', '12')
    .text('Company Size')
    .attr("fill", "white" );
    
    // Y label
    svg.append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', 'translate(-10,-15)')
    .style('font-family', 'Helvetica')
    .style('font-size', '12')
    .text('Salary')
    .attr("fill", "white" );

    svg.append("circle")
    .attr("cx",width7+15)
    .attr("cy",130)
    .attr("r", 6)
    .style("fill", "#ff0000")
    svg.append("circle")
    .attr("cx",width7+15)
    .attr("cy",160)
    .attr("r", 6)
    .style("fill", "#69b3a2")

    svg.append("text")
    .attr("x", width7+30)
    .attr("y", 130)
    .text("Average Salary")
    .style("font-size", "10px")
    .attr("alignment-baseline","middle")
    .style("fill", "white")
    svg.append("text")
    .attr("x", width7+30)
    .attr("y", 160)
    .text("Independent")
    .style("font-size", "10px")
    .attr("alignment-baseline","middle")
    .style("fill", "white")


}


// ---------------------------------------- PIE CHART WITH NUMBER OF ANWSERS BY AGE


function piechart(){

    var data = [
        {age: "Under 18 years old", number: 3866},
        {age: "18-24 years old", number: 16646},
        {age: "25-34 years old", number: 28112},
        {age: "35-44 years old", number: 13988},
        {age: "45-54 years old", number: 5281},
        {age: "55-64 years old", number: 1978},
        {age: "65 years or older", number: 554},
        {age: "Prefer not to say", number: 521},
    ];
      var text = "";
      
      var width = 400;
      var height = 400;
      var thickness = 40;
      var duration = 750;
      
      var radius = Math.min(width, height) / 2;
      var color = d3.scaleOrdinal(d3.schemeCategory10);
      
      var svg = d3.select("#piechart")
      .append('svg')
      .attr('class', 'pie')
      .attr('width', width)
      .attr('height', height);
      
      var g = svg.append('g')
      .attr('transform', 'translate(' + (width/2) + ',' + (height/2) + ')');
      
      var arc = d3.arc()
      .innerRadius(radius - thickness)
      .outerRadius(radius);
      
      var pie = d3.pie()
      .value(function(d) { return d.number; })
      .sort(null);
      
      
      
      var path = g.selectAll('path')
      .data(pie(data))
      .enter()
      .append("g")
      .attr('class', 'test')
      .on("mouseover", function(d) {
            let g = d3.select('.text-group');
       
            g.select(".name-text")
              .text(`${d.data.age}`)
              .attr('text-anchor', 'middle')
              .attr('dy', '-1.2em');
        
            g.select(".value-text")
              .text(`${d.data.number}`)
              .attr('text-anchor', 'middle')
              .attr('dy', '.6em');
          })
        .on("mouseout", function(d) {
            // d3.select(this)
            //   .style("cursor", "none")  
            //   .style("fill", color(this._current));
          })
        .append('path')
        .attr('d', arc)
        .attr('fill', (d,i) => color(i))
        .on("mouseover", function(d) {
            d3.select(this)     
              .style("cursor", "pointer")
              .style("fill", "black");
          })
        .on("mouseout", function(d) {
            d3.select(this)
              .style("cursor", "none")  
              .style("fill", color(this._current));
          })
        .each(function(d, i) { this._current = i; });
      
      
      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '.35em')
        .text(text);
      
        let x = d3.select('.test')
              .style("cursor", "pointer")
              .style("fill", "black")
              .append("g")
              .attr("class", "text-group");
       
            x.append("text")
              .attr("class", "name-text")
              .text(`${data[0].age}`)
              .attr('text-anchor', 'middle')
              .attr('dy', '-1.2em');
        
            x.append("text")
              .attr("class", "value-text")
              .text(`${data[0].number}`)
              .attr('text-anchor', 'middle')
              .attr('dy', '.6em');

              let legend = d3.select("#piechart").append('div')
              .attr('class', 'legend')
              .style('margin-top', '30px');
        
        // LEGEND
        let keys = legend.selectAll('.key')
                    .data(data)
                    .enter().append('div')
                    .attr('class', 'key')
                    .style('display', 'flex')
                    .style('align-items', 'center')
                    .style('margin-right', '20px');
        
                keys.append('div')
                    .attr('class', 'symbol')
                    .style('height', '20px')
                    .style('width', '20px')
                    .style('margin', '5px 5px')
                    .style('background-color', (d, i) => color(i));
        
                keys.append('div')
                    .attr('class', 'name')
                    .text(d => `${d.age} (${d.number})`);
        
                keys.exit().remove();
}


// ---------------------------------------- HEATMAP


function heatmap(){

    // set the dimensions and margins of the graph
    var margin8 = {top: 75, right: 100, bottom: 100, left: 175},
    w8 = document.getElementById('heatmap').offsetWidth;
    h8 = document.getElementById('heatmap').offsetHeight;
    height8 = h8 - h8*(margin8.top/1000) - h8*(margin8.bottom/1000);
    width8 = w8 - w8*(margin8.right/1000) - w8*(margin8.left/1000);

    // append the svg object to the body of the page
    var svg = d3.select("#heatmap")
    .append("svg")
    .attr("width", width8 + margin8.left + margin8.right)
    .attr("height", height8 + margin8.top + margin8.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin8.left + "," + margin8.top + ")");

    // Labels of row and columns
    var myGroups = ["Data scientist or machine learning specialist",
    "Developer  front-end",
    "Engineer  data",
    "Engineer  site reliability",
    "Developer  full-stack",
    "Developer  back-end",
    "Developer  desktop or enterprise applications",
    "Developer  QA or test",
    "Student",
    "Engineering manager",
    "Database administrator",
    "Academic researcher",
    "DevOps specialist",
    "Other",
    "Developer  embedded applications or devices",
    "Developer  game or graphics",
    "Project manager",
    "Cloud infrastructure engineer",
    "Data or business analyst",
    "Designer",
    "Scientist",
    "Product manager",
    "Senior Executive",
    "System administrator",
    "Blockchain",
    "Marketing or sales professional",
    "Security professional" ]

    var myVars = ["0.5","1","2","3","4","5","6","7","8","9","10",
    "11","12","13","14","15","16","17","18","19","20",
    "21","22","23","24","25","26","27","28","29","30",
    "31","32","33","34","35","36","37","38","39","40",
    "41","42","43","44","45","46","47","48","49","50",
    "60"]

    // Build X scales and axis:
    var x = d3.scaleBand()
    .range([ 0, width8 ])
    .domain(myGroups)
    .padding(0.01);
    svg.append("g")
    .attr("transform", "translate(0," + height8 + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(0,0)rotate(-25)")
    .style("text-anchor", "end")
    .style('font-size', '10px')
    .attr("fill", "grey" );

    // Build X scales and axis:
    var y = d3.scaleBand()
    .range([ height8, 0 ])
    .domain(myVars)
    .padding(0.01);
    svg.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .attr("transform", "translate(0,0)rotate(0)")
    .style("text-anchor", "end")
    .style('font-size', '10px')
    .attr("fill", "grey" );

    // Build color scale
    var myColor = d3.scaleLinear()
    .range(["white", "#69b3a2"])
    .domain([1,50000])

    //Read the data
    d3.csv("../job_salary_experience.csv", function(data) {

    svg.selectAll()
        .data(data, function(d) {return d.group+':'+d.variable;})
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.group) })
        .attr("y", function(d) { return y(d.variable) })
        .attr("width", x.bandwidth() )
        .attr("height", y.bandwidth() )
        .style("fill", function(d) { return myColor(d.value)} )

    })

    // Title
    svg.append('text')
    .attr('x', width/2)
    .attr('y', -35)
    .attr('text-anchor', 'middle')
    .style('font-family', 'Helvetica')
    .style('font-size', '22px')
    .text('Salary (per year) by Developer Type according with Years of Experience')
    .attr("fill", "white" );

    // X label
    svg.append('text')
    .attr('x', width + 100)
    .attr('y', height + 30)
    .attr('text-anchor', 'middle')
    .style('font-family', 'Helvetica')
    .style('font-size', '12')
    .text('Developer Type')
    .attr("fill", "white" );
    
    // Y label
    svg.append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', 'translate(-20,-10)rotate(0)')
    .style('font-family', 'Helvetica')
    .style('font-size', '12')
    .text('Years of Experience')
    .attr("fill", "white" );

    svg.append("circle")
    .attr("cx",-150)
    .attr("cy",130)
    .attr("r", 6)
    .style("fill", "black")
    svg.append("circle")
    .attr("cx",-150)
    .attr("cy",160)
    .attr("r", 6)
    .style("fill", "white")

    svg.append("text")
    .attr("x", -140)
    .attr("y", 130)
    .text("Highest Salary")
    .style("font-size", "12px")
    .attr("alignment-baseline","middle")
    .style("fill", "white")
    svg.append("text")
    .attr("x", -140)
    .attr("y", 160)
    .text("Lowest Salary")
    .style("font-size", "12px")
    .attr("alignment-baseline","middle")
    .style("fill", "white")

}




function onChangeSelection(){
    
}

horizontalBarChart();
bar_chart_gender();
piechart();
scatter();
heatmap();