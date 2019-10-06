var w = window.innerWidth, h = window.innerHeight;

var labelDistance = 50;

var linkDistance = 500;
var fontSize = 20;

if (w < 600) {
	linkDistance = 150;
	fontSize = 12;
}

var vis = d3.select("body").append("svg:svg").attr("width", w).attr("height", h);

var nodes = [];
var labelAnchors = [];
var labelAnchorLinks = [];
var links = [];

var myPosts = [].slice.call(document.querySelectorAll('.post-info'));

// Creating our nodes, which have a label, url and tags
for (let i = 0; i < myPosts.length; i++) {
	console.log(myPosts[i].querySelector('.post-title').innerText);
	var node = {
		label : myPosts[i].querySelector('.post-title').innerText,
		url: myPosts[i].querySelector('.post-url').innerText,
		tags: [].slice.call(myPosts[i].querySelectorAll('.tag'))
	};
	nodes.push(node);
	// WHY DO WE NEED TO PUSH THIS TWICE WHAT THE FUCK???
	labelAnchors.push({
		node : node
	});
	labelAnchors.push({
		node : node
	});
}

for(var i = 0; i < nodes.length; i++) {
	for(var j = 0; j < i; j++) {
		if(Math.random() >= 0.95) {
			links.push({
			source : i,
			target : j,
			weight : Math.random()
			});
		}
	}
	labelAnchorLinks.push({
		source : i * 2,
		target : i * 2 + 1,
		weight : 0
	});
};

var force = d3.
	layout.
	force().
	size([w, h]).
	nodes(nodes).
	links(links).
	gravity(10).
	linkDistance(7).
	charge(0).
	linkStrength(function(x) {
	return x.weight * 0
});

force.start();

var force2 = d3.layout.force().nodes(labelAnchors).links(labelAnchorLinks).gravity(1).linkDistance(linkDistance).linkStrength(10).charge(0).size([w, h]);
force2.start();

var link = vis.selectAll("line.link").data(links).enter().append("svg:line").attr("class", "link").style("stroke", "#CCC");

var node = vis.selectAll("g.node").data(force.nodes()).enter().append("svg:g").attr("class", "node");
node.append("rect")
	.attr("x", 0)
	.attr("y", -50)
	.attr("height", 7)
	.attr("width", 7)
	.style("fill", "#0000");;
	node.call(force.drag);


var anchorLink = vis.selectAll("line.anchorLink").data(labelAnchorLinks).enter().append("svg:line").attr("class", "anchorLink").style("stroke", "#000");

// This is our anchor node!
// It is black!
var anchorNode = vis.selectAll("g.anchorNode").data(force2.nodes()).enter().append("svg:g").attr("class", "anchorNode");
// This is a 0 by 0 sized circle around our node.. i'm not sure why it is there??
anchorNode.append("svg:ellipse").attr("rx", 0).attr("ry", 0).style("fill", "#555");

// This is the link! it's an invisible rectangle
// around our node!
anchorNode.append("a")
	.attr("xlink:href", function(d, i) {
	return i % 2 == 0 ? "" : d.node.url
}).append("rect")
	.attr("x", 50)
	.attr("y", -50)
	.attr("height", 100)
	.attr("width", 200)
	.style("fill", "#0000");

anchorNode.append("svg:text").text(function(d, i) {
	return i % 2 == 0 ? "" : d.node.label
}).style("fill", "#000").style("font-family", "Helvetica").style("font-size", fontSize);


var updateLink = function() {
	this.attr("x1", function(d) {
		return d.source.x;
	}).attr("y1", function(d) {
		return d.source.y;
	}).attr("x2", function(d) {
		return d.target.x;
	}).attr("y2", function(d) {
		return d.target.y;
	});
}

var updateNode = function() {
	this.attr("transform", function(d) {
		return "translate(" + d.x + "," + d.y + ")";
	});
}

force.on("tick", function() {
	force2.start();

	node.call(updateNode);

	anchorNode.each(function(d, i) {
		if(i % 2 == 0) {
			d.x = d.node.x;
			d.y = d.node.y;
		} else {
			var b = this.childNodes[1].getBBox();

			var diffX = d.x - d.node.x;
			var diffY = d.y - d.node.y;

			var dist = Math.sqrt(diffX * diffX + diffY * diffY);

			var shiftX = b.width * (diffX - dist) / (dist * 2);
			shiftX = Math.max(-b.width, Math.min(0, shiftX));
			var shiftY = 5;
			this.childNodes[1].setAttribute("transform", "translate(" + shiftX + "," + shiftY + ")");
		}
	});

	anchorNode.call(updateNode);

	link.call(updateLink);
	anchorLink.call(updateLink);

});
