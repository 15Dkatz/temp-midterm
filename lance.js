var l_sections = {
  0: {
    path: './lance_data/GroupedBarsData.csv'
  },
  1: {
    path: './lance_data/WestAddBars.csv'
  },
  2: {
    path: './lance_data/PresidioBars.csv'
  },
  3: {
    path: './lance_data/LomoBars.csv'
  },
  4: {
    path: './lance_data/InnerRichBars.csv'
  },
  5: {
    path: './lance_data/HaightBars.csv'
  }
}

function renderLanceD3(section) {



  var svg = d3.select("#bars");

  svg.selectAll("*").remove();

  var margin = {top: 35, right: 20, bottom: 50, left: 50},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");



  var x0 = d3.scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.1);

  var x1 = d3.scaleBand()
      .padding(0.05);

  var y = d3.scaleLinear()
      .rangeRound([height, 0]);

  var z = d3.scaleOrdinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  var data = l_sections[section].path;

  console.log('data', data);

  d3.csv(data, function(d, i, columns) {
    for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
    return d;
  }, function(error, data) {
    if (error) throw error;

    var keys = data.columns.slice(1);

    x0.domain(data.map(function(d) { return d.District; }));
    x1.domain(keys).rangeRound([0, x0.bandwidth()]);
    y.domain([0, 0.8]).nice();



    g.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).tickFormat(d3.format(".0%")).tickSizeInner(-width))
        .selectAll(".tick:not(:first-of-type) line").style("stroke", "#cececf")




    g.append("g")
      .selectAll("g")
      .data(data)
      .enter().append("g")
        .attr("transform", function(d) { return "translate(" + x0(d.District) + ",0)"; })
      .selectAll("rect")
      .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
      .enter().append("rect")
        .attr("x", function(d) { return x1(d.key); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", x1.bandwidth())
        .attr("height", function(d) { return height - y(d.value); })
        .attr("fill", function(d) { return z(d.key); });

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x0))
        .selectAll(".tick text")
        .attr("class", "lance-tick");

     g.append("text")
      	.attr("y", 0- margin.left)
      	.attr("x", 0 - (height/2))
      	.attr("transform", "rotate(-90)")
      	.attr("dy", "0.71em")
      	.attr("fill", "#000")
      	.style("font-size", "14px")
      	.text("Percent of Total Calls");


  	g.append("text")
     			.attr("transform","translate(" + (width/2) + " ," +(height + margin.top + 5) + ")")
          .style("text-anchor", "middle")
          .style("font-size", "14px")
          .text("District")
          .attr("class", "lance-label");

    g.append("text")
         .attr("x", (width / 2))
          .attr("y", 0 - (margin.top / 2))
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .style("font-family", "sans-serif")
          .text("Proportion of Call-Types per District");


    var legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d) { return d; });
  });

}


function lanceChangeData(x) {
  console.log('changing data in Lance', x);
  renderLanceD3(x);
}

lanceChangeData(0);
