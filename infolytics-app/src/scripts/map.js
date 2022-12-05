// Set tooltips
const tip = d3.tip()
	.attr('class', 'd3-tip')
	.offset([-10, 0])
	.html(d => `<strong>Country: </strong><span class='details'>${d.properties.name}<br></span><strong>Avg. Salary: </strong><span class='details'>${d.AvgSalary} $</span>`);

// The svg
var svg = d3.select("svg"),
	width = +svg.attr("width"),
	height = +svg.attr("height");

// Map and projection
var path = d3.geoPath();
var projection = d3.geoRobinson()
	.scale(150)
	.center([50,0])

// Data and color scale
var data = d3.map();
var colorScale = d3.scaleThreshold()
	.domain([5000, 10000, 25000, 50000, 75000, 150000])
	.range(d3.schemeBlues[7]);

svg.call(tip);

// Load external data and boot
d3.queue()
	.defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
	.defer(d3.csv, "../dataset/avg_salary_by_country.csv", function(d) { data.set(d.Code, +d.AvgSalary); })
	.await(ready);

function ready(error, topo) {

  let mouseOver = function(d) {
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

  let mouseLeave = function(d) {
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

  let mouseClick = function(d) {
	console.log(d);
	let country = d.properties.name

	if (country in localStorage) {
		localStorage.removeItem(country);
	} else {
		localStorage.setItem(country, true);
	}
}

// Draw the map
svg.append("g")
.selectAll("path")
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
	.attr("class", function(d){ return "Country" } )
	.style("opacity", .8)
	.on("mouseover", mouseOver )
	.on("mouseleave", mouseLeave )
	.on("click", mouseClick)
}