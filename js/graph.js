console.log("Creating graphs");

readSiteDataArray(function (result) {
	var graphs = $("#graphs");

	result.forEach(function(site) {
		if (site.entries.length > 1) {
			var id = "graph-" + site.name;
			graphs.append("<h2>"+site.name+"</h2>");
			graphs.append('<svg id="'+ id + '" width="960" height="500"></svg>');
			createGraph(site);	
		}
	});
	
});


function createGraph(singleSite) {
	var svg = d3.select("#graph-" + singleSite.name),
	margin = {top: 20, right: 80, bottom: 30, left: 50},
	width = svg.attr("width") - margin.left - margin.right,
	height = svg.attr("height") - margin.top - margin.bottom,
	g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var x = d3.scaleTime().range([0, width]);
	var y = d3.scaleLinear().range([height, 0]);
	var z = d3.scaleOrdinal(d3.schemeCategory10);

	var line = d3.line()
	  .x(function(d) { return x(d.date); })
	  .y(function(d) { return y(d.b); });

	var entries = singleSite.entries;
	var entriesArray = [];

	entries.forEach(function(e) {
		e.date = new Date(e.t*1000);
	});

	entriesArray.push( {name:singleSite.name,values:entries});

	var xExtant = d3.extent(entries, function(d) {return d.date;});
	var yExtant = d3.extent(entries, function(d) {return d.b;}); 

          
	x.domain(xExtant);
	y.domain(yExtant);


	g.append("g")
	  .attr("class", "axis axis--x")
	  .attr("transform", "translate(0," + height + ")")
	  .call(d3.axisBottom(x));

	g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("Balance");

	var site = g.selectAll(".site")
	  .data(entriesArray)
	  .enter().append("g")
	  .attr("class", "site");

	site.append("path")
	  .attr("class", "line")
	  .attr("d", function(d) { return line(d.values); })
	  .style("stroke", function(d) { return "FF0000"  });
}

