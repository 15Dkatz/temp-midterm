var m_sections = {
  0: {
    path: './michael_data/project2.csv'
  },
  1: {
    path: './michael_data/westernAddition.csv'
  },
  2: {
    path: './michael_data/presidio.csv'
  },
  3: {
    path: './michael_data/loneMountain.csv'
  },
  4: {
    path: './michael_data/innerRichmond.csv'
  },
  5: {
    path: './michael_data/haightAshbury.csv'
  }
}

function m_renderd3(section) {
  var orig_div = document.getElementById('lines');
  console.log('orig_div', orig_div);
  while (orig_div.hasChildNodes()) {
    orig_div.removeChild(orig_div.lastChild)
  }
  var translate = function(x,y){
    return "translate(" + String(x) + "," + String(y) + ")";
  }

  var margin = {
  	top: 10,
  	right: 20,
  	bottom: 20,
  	left: 25
  },
  	width = 960 - margin.left - margin.right,
  	height = 100 - margin.top - margin.bottom;

  var parseDate = d3.timeParse("%m/%d/%Y");

  var x = d3.scaleTime()
  		.range([0, width])
  		.nice();

  var y = d3.scaleLinear()
  		//.range([500 - margin.top - margin.bottom, 0])
  		.range([height,0])
  		.nice();

  var line = d3.line()
  		.curve(d3.curveBasis)
  		.x(function(d) {return x(d.callDate);})
  		.y(function(d) {return y(d.Freq) });

  var xAxis = d3.axisBottom(x)
  	.ticks(5);

  var yAxis = d3.axisLeft(y)
  	.ticks(5);



  var data_path = m_sections[section].path;

  console.log('data m', data_path);

  d3.csv(data_path, function(error, data){
    data.forEach(function(d){
		d.callDate = parseDate(d.callDate);
		d.Freq = +d.Freq;
	});
	if(error) throw error;

	var neighborhoods = d3.nest()
		.key(function(d) {return d.neighborhood; })
		.key(function(d) {return d.callType;})
		.entries(data);

  console.log(neighborhoods.length, "neighborhoods length");


  //
  // var orig_div = d3.select("#lines");
  // orig_div.selectAll("*").remove();

	neighborhoods.forEach(function(s){
		s.maxVal = d3.max(s.values, function(d){ return d.Freq;});
	});

	x.domain(d3.extent(data, function(d) { return d.callDate}));
	y.domain([0, d3.max(data, function(d){ return d.Freq})]);

	//console.table(neighborhoods)
//console.log(neighborhoods.map(function(d){return d.values[0].values;}));
//console.log(neighborhoods.map(function(d){return d.values;}));

  if (neighborhoods.length === 1) {
    height = 500 - margin.top - margin.bottom
    y.range([500 - margin.top - margin.bottom, 0])
  }


	var svg = d3.select("#lines").selectAll("svg");

  console.log('neighborhoods', neighborhoods);
			svg.data(neighborhoods.map(function(d){return d.values}))
			.enter().append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom),
			g = svg.append("g")
				.attr("transform", translate(margin.left, margin.top));

    g.append("path")
    		.attr("class", "line")
    					.style("stroke", "red")
    					.attr("d", function(d) {
    						// console.log(d[0].values)
    						return line(d[0].values);});

    g.append("path")
    		.attr("class", "line2")
    					.attr("d", function(d) {
    						return line(d[1].values);});

    g.append("g")
    		.attr("class", "x axis")
    		//.style({'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'})
    		.attr("transform", translate(0, height))
    		.call(xAxis);

    g.append("g")
    		.attr("class", "y axis")
    		//.style({'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'})
    		.call(yAxis);

    g.append("text")
    	.text(function(d) {
    		// console.log(d[0].values[0].neighborhood, "d")
    		return d[0].values[0].neighborhood; })
      .attr("x", 800)
      .attr("y", 0);
  })
}

function michaelChangeData(x) {

  m_renderd3(x);
  m_renderd3(x);
}

// michaelChangeData(0);
