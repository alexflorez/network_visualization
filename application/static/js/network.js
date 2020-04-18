var width = 960,
    height = 500,
    radius = 5;

var svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("/data_json")
    .then( function(graph) {
        var max = d3.max(graph.nodes, d => d.group);

        var fill = d3.scaleSequential( t => d3.interpolateSinebow(2/3-3*t/4) )
            .domain( [0, max] );

        var simulation = d3.forceSimulation(graph.nodes)
            .force("link", d3.forceLink(graph.links)
                .id(d => d.id).distance(25))
            .force("charge", d3.forceManyBody().strength(-25))
            .force("center", d3.forceCenter(width/2, height/2));

        var links = d3.select("#links")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.5)
            .selectAll("line")
            .data(graph.links)
            .join("line")
            .attr("stroke-width", d => Math.sqrt(d.value));

        var nodes = d3.select("#nodes")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(graph.nodes)
            .join("circle")
            .attr("r", radius)
            .attr("fill", d => fill(d.group))
            .call(drag(simulation));

        simulation.on("tick", tick);

        function tick() {
            links.attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
            
            nodes.attr("cx", d => { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
                .attr("cy", d => { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });
        }

        function drag(simulation) {
            function dragstarted(d) {
                if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
            }

            function dragged(d) {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            }

            function dragended(d) {
                if (!d3.event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
            }

            return d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
        }  
});
