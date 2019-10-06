var w = window.innerWidth, h = window.innerHeight;

var force = d3.layout.force()
		.size([w, h])
		.charge(-400)
		.linkDistance(40)
		.on("tick", tick);

var drag = force.drag()
		.on("dragstart", dragstart);

var svg = d3.select("body").append("svg")
		.attr("width", w)
		.attr("height", h);

var link = svg.selectAll(".link"),
		node = svg.selectAll(".node");

d3.json("/assets/data.json", function(error, graph) {
	if (error) throw error;

	force
		.nodes(graph.nodes)
		.links(graph.links)
		.start();

	link = link.data(graph.links)
		.enter().append("line")
		.attr("class", "link");

	node = node.data(graph.nodes)
		.enter().append("svg:text")
    	.text(function(d) { console.log(d.x); return d.x })
    	.style("fill", "#000").style("font-family", "Helvetica").style("font-size", 20)
		.attr("class", "node")
		.attr("r", 12)
		.on("dblclick", dblclick)
		.call(drag);
	// node.append("svg:text")
 //    	.text(function(d) { console.log(d.x); return d.x })
 //    	.style("fill", "#000").style("font-family", "Helvetica").style("font-size", 20);
});

function tick() {
	link.attr("x1", function(d) { return d.source.x; })
		.attr("y1", function(d) { return d.source.y; })
		.attr("x2", function(d) { return d.target.x; })
		.attr("y2", function(d) { return d.target.y; });

	node.attr("cx", function(d) { return d.x; })
		.attr("cy", function(d) { return d.y; });
}

function dblclick(d) {
	d3.select(this).classed("fixed", d.fixed = false);
}

function dragstart(d) {
	d3.select(this).classed("fixed", d.fixed = true);
}
