// DonutChart

var DonutChart = function() {
	// Set defaults vars
	var height = 450,
		width = 960,
		margin = {top: 10, right: 10, bottom: 10, left: 10},
		radius = Math.min(width, height) / 2,
		title = 'Chart Title',
		color = d3.scaleOrdinal(d3.schemeCategory20c);
	

	// Internal function that gets returned
	var chart = function(selection) {
		// Constructs an arc generator
		var arc = d3.arc()
			.innerRadius(radius * 0.8)
			.outerRadius(radius * 0.6);

		// The outerArc is used in caculating text label positions
		var outerArc = d3.arc()
			.outerRadius(radius * 0.9)
			.innerRadius(radius * 0.9);

		// Creates a new pie generator
		var pie = d3.pie()
			.value(function(d) { return d.value; })   // change the attribute name if needed
			.sort(null);

		// For each selected element, perform the function (optional)
		selection.each(function(data) {
			var element = d3.select(this);
			var svg = element.selectAll('svg').data(data);
		
			var svgEnter = svg.enter()
				.append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom);

			svgEnter.append('text')
				.attr('transform', 'translate(' + (width / 2) + ',' + 10 + ')')
				.text(title)
				.attr('class', 'chart-title');

			svgEnter.append('g')
				.attr('class', 'sliceLabel')
				.attr('width', width)
				.attr('height', height)
				.attr('transform', 'translate(' + (width / 2) + ',' + height / 2 + ')');


			svgEnter.append('g')
				.attr('transform', 'translate(' + (width  / 2) + ',' + height/2 + ')')
				.attr('class', 'chartG');

			svgEnter.append('g')
				.attr('class', 'lines')
				.attr('transform', 'translate(' + (width  / 2) + ',' + height/2 + ')');

			// Draw donut chart
			var path = element.select('.chartG').selectAll('path')
				.data(pie(data[0]));
				
				path.enter().append('path')
				.attr('fill', function(d) { return color(d.data.key); })
				.transition()
				.delay(function(d,i) { return i * 800; })
				.duration(800)
				.attrTween('d', function(d) {
					var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
					return function(t) {
						d.endAngle = i(t);
						return arc(d);
					}
				});

			path.exit().remove();

			// Add text labels
			var label = element.select('.sliceLabel').selectAll('text')
				.data(pie(data[0]));

				label.enter()
				.append('text')
				//.attr('transform', function(d) {return 'translate(' + arc.centroid(d) + ')'; })
				.transition()
				.delay(function(d,i) { return i * 800; })
				.duration(800)
				.attr('transform', labelTransform)
				.attr('dy', '.35em')
				//.text(function(d) { return d.data.key; })
				.text(function(d) { return (d.data.key) + ': ' + (d.data.value); })
				.style('fill', '#000')
				.style('text-anchor', function(d) {
					return (midAngle(d)) < Math.PI ? 'start' : 'end';
				});
			label.exit().remove();

			// For positioning text labels
			function labelTransform(d, i) {
				var pos = outerArc.centroid(d);
				pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1: -1);
				return 'translate(' + pos + ')';
			};

			// Calculate the midAngel for positioning text labels
			function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle) / 2; }
			
			// Add lines connecting text labels to the slices of the donut chart
			var polyline = element.select('.lines').selectAll('polyline')
				.data(pie(data[0]))
				.enter().append('polyline')
				.transition()
				.delay(function(d,i) { return i * 800; })
				.attr('points', calculatePoints)
				.attr('fill', 'none')
				.attr('stroke-width', 1)
				.attr('stroke', '#808080');

			// Caculate the exact position to draw polylines
			function calculatePoints(d) {
				var pos = outerArc.centroid(d);
				pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
				return [arc.centroid(d), outerArc.centroid(d), pos];
			}
		});
	};

	// Getter and setter functions
	chart.height = function(value) {
		if (!arguments.length) return height;
		height = value;
		return chart;
	};

	chart.width = function(value) {
		if (!arguments.length) return width;
		width = value;
		return chart;
	};

	chart.radius = function(value) {
		if (!arguments.length) return radius;
		radius = value;
		return chart;
	};

	chart.color = function(value) {
		if (!arguments.length) return color;
		color = value;
		return chart;
	};

	chart.title = function(value) {
		if (!arguments.length) return title;
		title = value;
		return chart;
	};

	return chart;
};