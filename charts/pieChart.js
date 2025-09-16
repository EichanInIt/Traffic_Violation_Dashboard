function createPieChart(data, container) {
    const width = 300, height = 300, radius = Math.min(width, height) / 2;

    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    const svg = d3.select(container)
        .append('svg')
        .attr('width', width + 150)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${radius},${height / 2})`);

    const color = d3.scaleOrdinal()
        .domain(['Police', 'Camera'])
        .range(['#1E3A8A', '#0D9488']);

    const pie = d3.pie().value(d => d.amount);
    const arc = d3.arc().innerRadius(radius * 0.5).outerRadius(radius * 0.8);

    const arcs = svg.selectAll('arc')
        .data(pie(data))
        .enter().append('g');

    arcs.append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.method))
        .attr('stroke', 'white')
        .style('stroke-width', '2px')
        .on('mouseover', function(event, d) {
            d3.select(this).transition().duration(200).attr('transform', 'scale(1.05)');
            tooltip.transition().duration(200).style('opacity', .9);
            tooltip.html(`Method: ${d.data.method}<br/>Fines: ${d.data.amount.toLocaleString()}`)
                .style('left', `${event.pageX}px`)
                .style('top', `${event.pageY - 28}px`);
        })
        .on('mouseout', function() {
            d3.select(this).transition().duration(200).attr('transform', 'scale(1)');
            tooltip.transition().duration(500).style('opacity', 0);
        });


    // Add legend
    const legend = d3.select(container)
        .select('svg')
        .append('g')
        .attr('transform', `translate(${width}, 30)`);

    legend.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', 0)
        .attr('y', (d, i) => i * 20)
        .attr('width', 14)
        .attr('height', 14)
        .attr('fill', d => color(d.method));

    legend.selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .attr('x', 20)
        .attr('y', (d, i) => i * 20 + 12)
        .text(d => d.method)
        .attr('font-size', '12px')
        .attr('fill', '#1f2937');
}
