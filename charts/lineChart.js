function createLineChart(data, container) {
    const margin = {top: 20, right: 20, bottom: 30, left: 60};
    const width = 1000 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    const svg = d3.select(container)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const line = d3.line()
        .x(d => x(new Date(d.year, 0)))
        .y(d => y(d.amount));

    x.domain(d3.extent(data, d => new Date(d.year, 0)));
    y.domain([0, d3.max(data, d => d.amount)]);

    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));
    svg.append('g')
        .call(d3.axisLeft(y));
    // X Axis Label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + 30)
        .text("Year");

    // Y Axis Label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -50)
        .text("Total Fines");

    svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#1E3A8A')
        .attr('stroke-width', 2)
        .attr('d', line);

    svg.selectAll('.dot')
        .data(data)
        .enter().append('circle')
        .attr('class', 'dot')
        .attr('cx', d => x(new Date(d.year, 0)))
        .attr('cy', d => y(d.amount))
        .attr('r', 5)
        .attr('fill', '#1E3A8A')
        .on('mouseover', function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('r', 8)
                .attr('fill', '#2563EB');
            
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            tooltip.html(`Year: ${d.year}<br/>Fines: ${d.amount.toLocaleString()}`)
                .style('left', (event.pageX) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('r', 5)
                .attr('fill', '#1E3A8A');
            
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        });
}
