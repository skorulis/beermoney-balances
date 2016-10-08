replaceVersionNumber();

readSiteDataArray(function (result) {
	readMetaData(function(meta) {
		var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result));
		$("#export").attr("href",dataStr);
		var graphs = $("#graphs");

		if(result.length > 1) {
			graphs.append('<h2 class="graph-name">All sites</h2>');
			graphs.append('<svg id="graph-all" width="960" height="500"></svg>');
			createGraph(result,meta,true)
			graphs.append("<hr>")	
		}

		result.forEach(function(site) {
			if (site.entries.length > 1) {
				var id = "graph-" + site.name;
				graphs.append('<h2 class="graph-name">'+site.name+"</h2>");
				graphs.append('<svg id="'+ id + '" width="960" height="500"></svg>');

				createGraph([site],meta, false);
				createHistory(site,meta,graphs);
				graphs.append("<hr>")	
			}
		});
	});

});

function createHistory(site,allMeta,element) {
	var innerHtml = '<div class="time-wrapper"> <table><tr class="time-header">';
	var timestamp = (new Date()).getTime()/1000;
	var totals = [];
	totals.push({name:"Last hour",time:3600,total:0})
	totals.push({name:"Last 3 hours",time:3*3600,total:0})
	totals.push({name:"Last 8 hours",time:8*3600,total:0})
	totals.push({name:"Last 24 hours",time:24*3600,total:0})
	totals.push({name:"Last 7 days",time:7*24*3600,total:0})

	console.log(timestamp);
	var previous = null;
	site.entries.forEach(function (e) {
		var change = e.b;
		if(previous) {
			change = e.b - previous.b;
		}
		if (change > 0) {
			totals.forEach(function(t) {
				if (timestamp - e.t < t.time) {
					t.total += change;
				}
			});	
		}

		previous = e;
	});
	var decimals = allMeta[site.name].fractions ? 2 : 0;
	
	totals.forEach(function (t) {
		innerHtml += "<td>" + t.name + "</td>";
	});
	innerHtml += '</tr><tr class="time-values">';
	totals.forEach(function (t) {
		innerHtml += "<td>" + t.total.toFixed(decimals) + "</td>";
	});


	innerHtml += "</table></div>"; 

	element.append(innerHtml);
}


function createGraph(siteList,allMeta, useUSD) {
	var svg;
	if (siteList.length == 1) {
		console.log("graph " + siteList[0].name);
		svg = d3.select("#graph-" + siteList[0].name);
	} else {
		svg = d3.select("#graph-all");
	}
	var margin = {top: 20, right: 80, bottom: 30, left: 50},
	width = svg.attr("width") - margin.left - margin.right,
	height = svg.attr("height") - margin.top - margin.bottom,
	g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var x = d3.scaleTime().range([0, width]);
	var y = d3.scaleLinear().range([height, 0]);
	var z = d3.scaleOrdinal(d3.schemeCategory10);

	var yExtant = [1000000,0];
    var xExtant = [new Date(),0];

	var line = d3.line()
	  .x(function(d) { return x(d.date); })
	  .y(function(d) { 
	  	if (useUSD) {
	  		return y(d.usd);
	  	} else {
	  		return y(d.b); 	
	  	}
	  });


	siteList.forEach(function(site) {
		var meta = allMeta[site.name];
		site.entries.forEach(function(e) {
			e.date = new Date(e.t*1000);
			e.usd = e.b / meta.conversion;
		});

		var tempX = d3.extent(site.entries, function(d) {return d.date;});
		var tempY = d3.extent(site.entries, function(d) {
		if (useUSD) {
			return d.usd;
		} else {
			return d.b;
		}
		}); 
		console.log(tempY);

		xExtant[0] = Math.min(xExtant[0],tempX[0]);
        xExtant[1] = Math.max(xExtant[1],tempX[1]);

        yExtant[0] = Math.min(yExtant[0],tempY[0]);
        yExtant[1] = Math.max(yExtant[1],tempY[1]);
	});
          
          console.log(yExtant);
	x.domain(xExtant);
	y.domain(yExtant);
	z.domain(siteList.map(function(c) { return c.name; }));

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
	  .data(siteList)
	  .enter().append("g")
	  .attr("class", "site");

	site.append("path")
	  .attr("class", "line")
	  .attr("d", function(d) { return line(d.entries); })
	  .style("stroke", function(d) { return z(d.name);  });

	if(useUSD) {
		site.append("text")
	      .datum(function(d) { return {name: d.name, value: d.entries[d.entries.length - 1]}; })
	      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.usd) + ")"; })
	      .attr("x", 3)
	      .attr("dy", "0.35em")
	      .style("font", "10px sans-serif")
	      .style("fill", function(d) { return z(d.name);  })
	      .text(function(d) { return d.name; });	
	}
}

ga('send', 'pageview', "/full.html");