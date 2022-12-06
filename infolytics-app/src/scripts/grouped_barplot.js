// set the dimensions and margins of the graph
let margin = { top: 10, right: 30, bottom: 20, left: 50 },
	w = 460 - margin.left - margin.right,
	h = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
let svg2 = d3.select("#grouped_barplot")
	.append("svg")
	.attr("width", w + margin.left + margin.right)
	.attr("height", h + margin.top + margin.bottom)
	.append("g")
	.attr("transform",
		"translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("../dataset/avg_salary_by_country_by_job.csv", function (data) {
	console.log(data)

	selected_job_indexes = [3,12]
	selected_country_indexes = [0,59,60,61]

    let new_data = [];
    new_data.columns = [];
    for (const country_idx of selected_country_indexes)
        new_data.columns.push(data.columns[country_idx])
    
    for (const job_idx of selected_job_indexes) {
        let myMap = { "Job": data[job_idx].Job }

        for (const country_idx of selected_country_indexes) {
            let keyName = data.columns[country_idx]
            let value = data[job_idx][keyName]
            myMap[keyName] = value;
        }
        new_data.push(myMap);
    }

    data = new_data;
    console.log(data);



	// List of countries = header of the csv files = soil condition here
	let countries = data.columns.slice(1)

	// List of jobs = species here = value of the first column called Job -> I show them on the X axis
	let jobs = d3.map(data, function (d) { return (d.Job) }).keys()
	console.log("countries:\n",countries)
	console.log("jobs:\n",jobs)

	// Add X axis
	let x = d3.scaleBand()
		.domain(jobs)
		.range([0, w])
		.padding([0.2])
	svg2.append("g")
		.attr("class", "axisWhite")
		.attr("transform", "translate(0," + h + ")")
		.call(d3.axisBottom(x).tickSize(0));

	// Add Y axis
	let y = d3.scaleLinear()
		.domain([0, 300000])
		.range([h, 0]);
	svg2.append("g")
		.attr("class", "axisWhite")
		.call(d3.axisLeft(y));

	// Another scale for subgroup position?
	let xSubgroup = d3.scaleBand()
		.domain(countries)
		.range([0, x.bandwidth()])
		.padding([0.05])

	// color palette = one color per subgroup
	let color = d3.scaleOrdinal()
		.domain(countries)
		.range(d3.schemeBlues[3]);

	// Show the bars
	svg2.append("g")
		.selectAll("g")
		// Enter in data = loop Job per Job
		.data(data)
		.enter()
		.append("g")
		.attr("transform", function (d) { return "translate(" + x(d.Job) + ",0)"; })
		.selectAll("rect")
		.data(function (d) { return countries.map(function (key) { return { key: key, value: d[key] }; }); })
		.enter().append("rect")
		.attr("x", function (d) { return xSubgroup(d.key); })
		.attr("y", function (d) { return y(d.value); })
		.attr("width", xSubgroup.bandwidth())
		.attr("height", function (d) { return h - y(d.value); })
		.attr("fill", function (d) { return color(d.key); });

})