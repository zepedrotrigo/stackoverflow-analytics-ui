/* -------------------------------------------------------------------------- */
/*                                     Map                                    */
/* -------------------------------------------------------------------------- */

let width = 800,
	height = 434;

let projection = d3.geoRobinson()
	.center([770, 0])
	.scale(150)

let svg = d3.select("div#svg-map-container")
	.append("svg")
	.attr("preserveAspectRatio", "xMinYMin meet")
	.attr("viewBox", "0 0 800 434")
	.classed("svg-content", true);

let path = d3.geoPath()
	.projection(projection);

let g = svg.append("g");

/* -------------------------------------------------------------------------- */
/*                            Data and color scale                            */
/* -------------------------------------------------------------------------- */

let data = d3.map();
let colorScale = d3.scaleThreshold()
	.domain([5000, 10000, 25000, 50000, 75000, 150000])
	.range(d3.schemeBlues[7]);


/* -------------------------------------------------------------------------- */
/*                                Set tooltips                                */
/* -------------------------------------------------------------------------- */

const tip = d3.tip()
	.attr('class', 'd3-tip')
	.offset([-10, 0])
	.html(d => `<strong>Country: </strong><span class='details'>${d.properties.name}<br></span><strong>Avg. Salary: </strong><span class='details'>${d.AvgSalary} $</span>`);

svg.call(tip);


/* -------------------------------------------------------------------------- */
/*                         Load external data and boot                        */
/* -------------------------------------------------------------------------- */
d3.queue()
	.defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
	.defer(d3.csv, "../dataset/avg_salary_by_country.csv", function (d) { data.set(d.Code, +d.AvgSalary); })
	.await(ready);

function ready(error, topo) {
	update_bar_plot(); // draws the bar plot
	let paragraph = document.getElementById("selected-countries");
	paragraph.textContent += "Portugal, Spain, France, "
	localStorage.clear();
	localStorage.setItem("selectedCountries", ["Portugal", "Spain", "France"])

	let mouseOver = function (d) {
		tip.show(d);
		d3.selectAll(".Country")
			.transition()
			.duration(200)
			.style("opacity", .5)
		d3.select(this)
			.transition()
			.duration(200)
			.style("opacity", 1)
			.style("stroke", "black")
	}

	let mouseLeave = function (d) {
		tip.hide(d);
		d3.selectAll(".Country")
			.transition()
			.duration(200)
			.style("opacity", .8)
		d3.select(this)
			.transition()
			.duration(200)
			.style("stroke", "transparent")
	}

	let mouseClick = function (d) {
		let prevSelectedCountries = localStorage.getItem("selectedCountries").split(',');
		if (prevSelectedCountries[0] === null || prevSelectedCountries[0].trim() === "")
			prevSelectedCountries = []

		let country = d.properties.name;
		if (prevSelectedCountries.includes(country)) {
			const index = prevSelectedCountries.indexOf(country);
			if (index !== -1) prevSelectedCountries.splice(index, 1);
			paragraph.textContent = paragraph.textContent.replace(country + ", ", "");
		} else {
			prevSelectedCountries.push(country);
			paragraph.textContent += country + ", ";
		}
		localStorage.setItem("selectedCountries", prevSelectedCountries);
		update_bar_plot();
	}

	// Draw the map
	g.selectAll("path")
		.data(topo.features)
		.enter()
		.append("path")
		// draw each country
		.attr("d", d3.geoPath()
			.projection(projection)
		)
		// set the color of each country
		.attr("fill", function (d) {
			d.AvgSalary = data.get(d.id) || 0;
			return colorScale(d.AvgSalary);
		})
		.style("stroke", "transparent")
		.attr("class", function (d) { return "Country" })
		.style("opacity", .8)
		.on("mouseover", mouseOver)
		.on("mouseleave", mouseLeave)
		.on("click", mouseClick)


	// zoom
	var zoom = d3.zoom()
		.scaleExtent([1, 8])
		.on('zoom', function () {
			g.selectAll('path')
				.attr('transform', d3.event.transform);
		});

	svg.call(zoom);
}

/* -------------------------------------------------------------------------- */
/*                             Draw/Update BarPlot                            */
/* -------------------------------------------------------------------------- */

/* --------------------- Populate Select input elements --------------------- */
let jobs = ["Academicresearcher", "Blockchain", "Cloudinfrastructureengineer", "Dataorbusinessanalyst", "Datascientistormachinelearningspecialist", "Databaseadministrator", "Designer", "DevOpsspecialist", "DeveloperQAortest", "Developerback-end", "Developerdesktoporenterpriseapplications", "Developerembeddedapplicationsordevices", "Developerfront-end", "Developerfull-stack", "Developergameorgraphics", "Developermobile", "Educator", "Engineerdata", "Engineersitereliability", "Engineeringmanager", "Marketingorsalesprofessional", "NA", "Other(pleasespecify):", "Productmanager", "Projectmanager", "Scientist", "Securityprofessional", "SeniorExecutive(C-SuiteVPetc.)", "Student", "Systemadministrator"]
for (let n = 0; n < 3; n++) {
	var select = document.getElementById('jobs' + n);

	for (let i = 0; i < jobs.length; i++) {
		const opt = document.createElement('option');
		opt.value = i;
		opt.innerHTML = jobs[i];
		select.appendChild(opt);
	}
	select.value = 12 + n;
}

// set the dimensions and margins of the graph
let margin = { top: 5, right: 30, bottom: 100, left: 50 },
	w = 460 - margin.left - margin.right,
	h = 460 - margin.top - margin.bottom;

let svg2 = d3.select("div#grouped_barplot")
	.append("svg")
	.attr("preserveAspectRatio", "xMinYMin meet")
	.attr("viewBox", "0 0 460 460")
	.classed("svg-content", true)
	.append("g")
	.attr("transform",
		"translate(" + margin.left + "," + margin.top + ")");

function update_bar_plot() {
	try {
		svg2.selectAll('*').remove();
	} catch (error) {
		console.log("no svg2 to remove")
	}



	// Parse the Data
	d3.csv("../dataset/avg_salary_by_country_by_job.csv", function (data) {
		/* ------------------------- Get selected country/job inputs ------------------------ */

		let selected_country_indexes = [0] // needs to be initialized with 0 because first CSV column is "Jobs" and not the Country's name
		let selected_job_indexes = []

		for (let n = 0; n < 3; n++) {
			var opt = document.getElementById("jobs" + n).value;
			selected_job_indexes.push(opt)
		}

		let selectedCountries = localStorage.getItem("selectedCountries").split(',');
		for (let [k, v] of selectedCountries.entries()) {
			selected_country_indexes.push(data.columns.indexOf(v))
		}

		/* ------------------------- Keep only selected data ------------------------ */

		let new_data = [];
		new_data.columns = [];
		let max_y = 0;
		for (const country_idx of selected_country_indexes)
			new_data.columns.push(data.columns[country_idx])

		for (const job_idx of selected_job_indexes) {
			let myMap = { "Job": data[job_idx].Job }

			for (const country_idx of selected_country_indexes) {
				let keyName = data.columns[country_idx]
				let value = data[job_idx][keyName]
				myMap[keyName] = value

				if (!isNaN(value) && parseInt(value) > max_y)
					max_y = value
			}
			new_data.push(myMap);
		}

		data = new_data;

		/* -------------------------------- Draw Plot ------------------------------- */

		// List of countries = header of the csv files = soil condition here
		let countries = data.columns.slice(1)

		// List of jobs = species here = value of the first column called Job -> I show them on the X axis
		let jobs = d3.map(data, function (d) { return (d.Job) }).keys()

		// Add X axis
		let x = d3.scaleBand()
			.domain(jobs)
			.range([0, w])
			.padding([0.2])
		svg2.append("g")
			.attr("class", "axisWhite")
			.attr("transform", "translate(0," + h + ")")
			.call(d3.axisBottom(x).tickSize(0))
			.selectAll("text")
			.attr("transform", "translate(0,15)rotate(-10)");

		svg2.append("text")
			.attr("class", "y label")
			.attr("text-anchor", "end")
			.attr("y", -5)
			.attr("x", -10)
			.attr("dy", ".75em")
			.text("$")
			.style('fill', 'white');

		// Add Y axis
		let y = d3.scaleLinear()
			.domain([0, max_y * 1.15])
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
			.range(["#7ac1d5", "#c6dca0", "#f0cca9", "#f0d1e2", "#ff9aa2", "#ffffff"]);

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


		// Add one dot in the legend for each name.
		if (!countries.includes(undefined)) {
			var size = 20
			svg2.selectAll("mydots")
				.data(countries)
				.enter()
				.append("rect")
				.attr("x", 300)
				.attr("y", function (d, i) { return 5 + i * (size + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
				.attr("width", size)
				.attr("height", size)
				.style("fill", function (d) { return color(d) })

			// Add one dot in the legend for each name.
			svg2.selectAll("mylabels")
				.data(countries)
				.enter()
				.append("text")
				.attr("x", 300 + size * 1.2)
				.attr("y", function (d, i) { return 5 + i * (size + 5) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
				.style("fill", function (d) { return color(d) })
				.text(function (d) { return d })
				.attr("text-anchor", "left")
				.style("alignment-baseline", "middle")
		}
	})
}