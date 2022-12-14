
// ---------------------------------------- HORIZONTAL BAR CHART WITH AVG SALARY BY EDUCATIONAL LEVEL

function horizontalBarChart() {
    // set the dimensions and margins of the graph
    var margin = { top: 70, right: 150, bottom: 150, left: 270 },
        w = 700,
        h = 500;
    height = h - h * (margin.top / 1000) - h * (margin.bottom / 1000);
    width = w - w * (margin.right / 1000) - w * (margin.left / 1000);

    let svg = d3.select("div#horizontal_bar_chart")
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 700 500")
        .classed("svg-content", true)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Parse the Data
    d3.csv("../dataset/education_level_average_salary.csv", function (data) {

        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, 300000])
            .range([0, width]);
        svg.append("g")
            .attr("class", "axisWhite")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .attr("fill", "grey");

        // Y axis
        var y = d3.scaleBand()
            .range([0, height])
            .domain(data.map(function (d) { return d.edLevel; }))
            .padding(.15);
        svg.append("g")
            .attr("class", "axisWhite")
            .call(d3.axisLeft(y))
            .selectAll("text")
            .attr("transform", "translate(0,0)")
            .style("text-anchor", "end")
            .attr("fill", "grey");

        //Bars
        svg.selectAll("myRect")
            .data(data)
            .enter()
            .append("rect")
            .on("mouseover", onMouseOver) // Add listener for event
            .on("mouseout", onMouseOut)
            .attr("x", x(0))
            .attr("y", function (d) { return y(d.edLevel); })
            .attr("width", function (d) { return x(0); })
            .attr("height", y.bandwidth())
            .attr("fill", "#69b3a2")

        // Animation
        svg.selectAll("rect")
            .transition()
            .duration(800)
            .attr("y", function (d) { return y(d.edLevel); })
            .attr("width", function (d) { return x(d.avgSalary); })
            .delay(function (d, i) { console.log(i); return (i * 100) })

    })

    // Title
    svg.append('text')
        .attr('x', width / 3)
        .attr('y', -50)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', '24px')
        .text('Average salary by educational level')
        .attr("fill", "white");

    // X label
    svg.append('text')
        .attr('x', width + 10)
        .attr('y', height + 10)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', '12')
        .text('$')
        .attr("fill", "white");

    // Y label
    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(-70,-5)rotate(0)')
        .style('font-family', 'Helvetica')
        .style('font-size', '12')
        .text('Educational Level')
        .attr("fill", "white");



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
    function onMouseOut(d, i) {
        d3.select('#tooltip').classed('hidden', true);
    }

}


// ---------------------------------------- BAR CHART WITH AVG SALARY BY GENDER


function bar_chart_gender() {
    // set the dimensions and margins of the graph
    var margin2 = { top: 50, right: 200, bottom: 200, left: 200 },
        w2 = 2000,
        h2 = 800;
    height2 = h2 - h2 * (margin2.top / 1000) - h2 * (margin2.bottom / 1000);
    width2 = w2 - w2 * (margin2.right / 1000) - w2 * (margin2.left / 1000);

    // append the svg object to the body of the page
    let svg = d3.select("div#bar_chart_gender")
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 2000 800")
        .classed("svg-content", true)
        .append("g")
        .attr("transform",
            "translate(" + margin2.left + "," + margin2.top + ")");

    // Parse the Data
    d3.csv("../dataset/job_salary.csv", function (data) {

        // List of subgroups = header of the csv files = soil condition here
        var subgroups = data.columns.slice(1)

        // List of groups = species here = value of the first column called group -> I show them on the X axis
        var groups = d3.map(data, function (d) { return (d.job) }).keys()

        // Add X axis
        var x = d3.scaleBand()
            .domain(groups)
            .range([0, width2])
            .padding([0.4])
        svg.append("g")
            .attr("class", "axisWhite")
            .attr("transform", "translate(0," + height2 + ")")
            .call(d3.axisBottom(x).tickSize(0))
            .selectAll("text")
            .attr("transform", "translate(-5,0)rotate(-35)")
            .style("text-anchor", "end")
            .style('font-size', '12px')
            .attr("fill", "grey");

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 150000])
            .range([height2, 0]);
        svg.append("g")
            .attr("class", "axisWhite")
            .call(d3.axisLeft(y))
            .selectAll("text")
            .attr("transform", "translate(0,0)")
            .style("text-anchor", "end")
            .style('font-size', '12px')
            .attr("fill", "grey");

        // Another scale for subgroup position?
        var xSubgroup = d3.scaleBand()
            .domain(subgroups)
            .range([0, x.bandwidth()])
            .padding([0.05])

        // color palette = one color per subgroup
        var color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(['#69b3a2', '#4d99ff', '#ff96e1'])

        // Show the bars
        svg.append("g")
            .selectAll("g")
            // Enter in data = loop group per group
            .data(data)
            .enter()
            .append("g")
            .attr("transform", function (d) { return "translate(" + x(d.job) + ",0)"; })
            .selectAll("rect")
            .data(function (d) { return subgroups.map(function (key) { return { key: key, value: d[key] }; }); })
            .enter().append("rect")
            .attr("x", function (d) { return xSubgroup(d.key); })
            .attr("y", function (d) { return y(d.value); })
            .attr("width", xSubgroup.bandwidth())
            .attr("height", function (d) { return 0; })
            .attr("fill", function (d) { return color(d.key); });

        // Animation
        svg.selectAll("rect")
            .transition()
            .duration(800)
            .attr("x", function (d) { return xSubgroup(d.key); })
            .attr("height", function (d) { return height2 - y(d.value); })
            .delay(function (d, i) { console.log(i); return (i * 25) })

    })

    // Title
    svg.append('text')
        .attr('x', width2 / 2)
        .attr('y', -30)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', '24px')
        .text('Average salary per job and gender')
        .attr("fill", "white");

    // X label
    svg.append('text')
        .attr('x', width2 + 50)
        .attr('y', height2 + 20)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', '16')
        .text('Developer Type')
        .attr("fill", "white");

    // Y label
    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(-30,-5)rotate(0)')
        .style('font-family', 'Helvetica')
        .style('font-size', '16')
        .text('Average Salary')
        .attr("fill", "white");

    svg.append("circle")
        .attr("cx", width2)
        .attr("cy", 130)
        .attr("r", 8)
        .style("fill", "#69b3a2")
    svg.append("circle")
        .attr("cx", width2)
        .attr("cy", 160)
        .attr("r", 8)
        .style("fill", "#4d99ff")
    svg.append("circle")
        .attr("cx", width2)
        .attr("cy", 190)
        .attr("r", 8)
        .style("fill", "#ff96e1")

    svg.append("text")
        .attr("x", width2 + 15)
        .attr("y", 130)
        .text("Total")
        .style("font-size", "16px")
        .attr("alignment-baseline", "middle")
        .style("fill", "white")
    svg.append("text")
        .attr("x", width2 + 15)
        .attr("y", 160)
        .text("Male")
        .style("font-size", "16px")
        .attr("alignment-baseline", "middle")
        .style("fill", "white")
    svg.append("text")
        .attr("x", width2 + 15)
        .attr("y", 190)
        .text("Female")
        .style("font-size", "16px")
        .attr("alignment-baseline", "middle")
        .style("fill", "white")

}

// ---------------------------------------- SCATTER PLOT WITH SALARIES AND COMPANY SIZE


function scatter() {
    // set the dimensions and margins of the graph
    var margin7 = { top: 70, right: 100, bottom: 100, left: 150 },
        w7 = 600,
        h7 = 450;
    height7 = h7 - h7 * (margin7.top / 1000) - h7 * (margin7.bottom / 1000);
    width7 = w7 - w7 * (margin7.right / 1000) - w7 * (margin7.left / 1000);

    // append the svg object to the body of the page
    let svg = d3.select("div#scatter")
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 700 570")
        .classed("svg-content", true)
        .append("g")
        .attr("transform", "translate(" + margin7.left + "," + margin7.top + ")");


    //Read the data
    d3.csv("../dataset/orgsize_salary.csv", function (data) {

        // Add X axis
        var x = d3.scaleBand()
            .domain(data.map(function (d) { return d.orgsize; }))
            .range([0, width7]);
        svg.append("g")
            .attr("class", "axisWhite")
            .attr("transform", "translate(0," + height7 + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(0,0)rotate(-25)")
            .style("text-anchor", "end")
            .style('font-size', '12px')
            .attr("fill", "grey");

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 500000])
            .range([height7, 0]);
        svg.append("g")
            .attr("class", "axisWhite")
            .call(d3.axisLeft(y))
            .selectAll("text")
            .attr("transform", "translate(0,0)")
            .style("text-anchor", "end")
            .style('font-size', '12px')
            .attr("fill", "grey");

        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .on("mouseover", onMouseOver2) // Add listener for event
            .on("mouseout", onMouseOut2)
            .attr("transform", "translate(26,0)")
            .attr("cx", function (d) { return x(d.orgsize); })
            .attr("cy", function (d) { return y(d.salary); })
            .attr("r", 5)
            .style("fill", "#ff0000")

        d3.csv("../dataset/orgsize_salaryALL.csv", function (data2) {
            // Add dots
            svg.append('g')
                .selectAll("dot")
                .data(data2)
                .enter()
                .append("circle")
                .attr("transform", "translate(26,0)")
                .attr("cx", function (d) { return x(d.orgsize); })
                .attr("cy", function (d) { return y(d.salary); })
                .attr("r", 1.5)
                .style("fill", "#69b3a2")
        })

        function onMouseOver2(d, i) {
            // Get bar's xy values, ,then augment for the tooltip
            var xPos = width7 * 2.75 + margin7.left;
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
        function onMouseOut2(d, i) {
            d3.select('#tooltip2').classed('hidden', true);
        }
    })

    // Title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -50)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', '24px')
        .text('Salary by company size')
        .attr("fill", "white");

    // X label
    svg.append('text')
        .attr('x', width + 70)
        .attr('y', height + 25)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', '12')
        .text('Company size')
        .attr("fill", "white");

    // Y label
    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(0,-10)')
        .style('font-family', 'Helvetica')
        .style('font-size', '12')
        .text('$')
        .attr("fill", "white");

    svg.append("circle")
        .attr("cx", width7 + 15)
        .attr("cy", 130)
        .attr("r", 6)
        .style("fill", "#ff0000")
    svg.append("circle")
        .attr("cx", width7 + 15)
        .attr("cy", 160)
        .attr("r", 6)
        .style("fill", "#69b3a2")

    svg.append("text")
        .attr("x", width7 + 30)
        .attr("y", 130)
        .text("Average Salary")
        .style("font-size", "10px")
        .attr("alignment-baseline", "middle")
        .style("fill", "white")
    svg.append("text")
        .attr("x", width7 + 30)
        .attr("y", 160)
        .text("Independent")
        .style("font-size", "10px")
        .attr("alignment-baseline", "middle")
        .style("fill", "white")


}


// ---------------------------------------- PIE CHART WITH NUMBER OF ANWSERS BY AGE


function piechart() {

    var data = [
        { age: "Under 18 years old", number: 3866 },
        { age: "18-24 years old", number: 16646 },
        { age: "25-34 years old", number: 28112 },
        { age: "35-44 years old", number: 13988 },
        { age: "45-54 years old", number: 5281 },
        { age: "55-64 years old", number: 1978 },
        { age: "65 years or older", number: 554 },
        { age: "Prefer not to say", number: 521 },
    ];
    var text = "";

    var width = 434;
    var height = 434;
    var thickness = 40;
    var duration = 750;

    var radius = Math.min(width, height) / 2;
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    let svg = d3.select("div#piechart")
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 434 434")
        .classed("svg-content", true)
        .attr('class', 'pie pie-w')
        .attr("transform", "translate(" + 50 + "," + 0 + ")");



    var g = svg.append('g')
        .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

    var arc = d3.arc()
        .innerRadius(radius - thickness)
        .outerRadius(radius);

    var pie = d3.pie()
        .value(function (d) { return d.number; })
        .sort(null);



    var path = g.selectAll('path')
        .data(pie(data))
        .enter()
        .append("g")
        .attr('class', 'test')
        .on("mouseover", function (d) {
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
        .append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => color(i))
        .on("mouseover", function (d) {
            d3.select(this)
                .style("cursor", "pointer")
                .style("fill", "black");
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .style("cursor", "none")
                .style("fill", color(this._current));
        })
        .each(function (d, i) { this._current = i; });


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
        .style('margin-top', '50px')
        .style('margin-left', '70px');

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


function heatmap() {

    // set the dimensions and margins of the graph
    var margin8 = { top: 75, right: 100, bottom: 100, left: 175 },
        w8 = 500,
        h8 = 500;
    height8 = h8 - h8 * (margin8.top / 1000) - h8 * (margin8.bottom / 1000);
    width8 = w8 - w8 * (margin8.right / 1000) - w8 * (margin8.left / 1000);

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
        "Security professional"]

    var myVars = ["0.5", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
        "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
        "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
        "31", "32", "33", "34", "35", "36", "37", "38", "39", "40",
        "41", "42", "43", "44", "45", "46", "47", "48", "49", "50",
        "60"]

    // Build X scales and axis:
    var x = d3.scaleBand()
        .range([0, width8])
        .domain(myGroups)
        .padding(0.01);
    svg.append("g")
        .attr("class", "axisWhite")
        .attr("transform", "translate(0," + height8 + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-50)")
        .style("text-anchor", "end")
        .style('font-size', '10px')
        .attr("fill", "grey");

    // Build X scales and axis:
    var y = d3.scaleBand()
        .range([height8, 0])
        .domain(myVars)
        .padding(0.01);
    svg.append("g")
        .attr("class", "axisWhite")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .attr("transform", "translate(0,0)rotate(0)")
        .style("text-anchor", "end")
        .style('font-size', '10px')
        .attr("fill", "grey");

    // Build color scale
    var myColor = d3.scaleLinear()
        .range(["white", "#69b3a2"])
        .domain([1, 50000])

    //Read the data
    d3.csv("../dataset/job_salary_experience.csv", function (data) {

        svg.selectAll()
            .data(data, function (d) { return d.group + ':' + d.variable; })
            .enter()
            .append("rect")
            .attr("x", function (d) { return x(d.group) })
            .attr("y", function (d) { return y(d.variable) })
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", function (d) { return myColor(d.value) })

    })

    // Title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -50)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', '22px')
        .text('Salary comparison per job and years of experience')
        .attr("fill", "white");

    // X label
    svg.append('text')
        .attr('x', width - 10)
        .attr('y', height + 30)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', '12')
        .text('Jobs')
        .attr("fill", "white");

    // Y label
    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(-20,-10)rotate(0)')
        .style('font-family', 'Helvetica')
        .style('font-size', '12')
        .text('Years of Experience')
        .attr("fill", "white");

    svg.append("circle")
        .attr("cx", -150)
        .attr("cy", 130)
        .attr("r", 6)
        .style("fill", "black")
    svg.append("circle")
        .attr("cx", -150)
        .attr("cy", 160)
        .attr("r", 6)
        .style("fill", "white")

    svg.append("text")
        .attr("x", -140)
        .attr("y", 130)
        .text("Highest Salary")
        .style("font-size", "12px")
        .attr("alignment-baseline", "middle")
        .style("fill", "white")
    svg.append("text")
        .attr("x", -140)
        .attr("y", 160)
        .text("Lowest Salary")
        .style("font-size", "12px")
        .attr("alignment-baseline", "middle")
        .style("fill", "white")

}




function onChangeSelection() {

}

horizontalBarChart();
bar_chart_gender();
piechart();
scatter();
heatmap();