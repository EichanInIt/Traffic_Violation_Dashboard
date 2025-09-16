// Utility functions for creating D3.js charts
function createPieChart(data, container) {
    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    // Create tooltip
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal()
        .domain(['Police', 'Camera'])
        .range(['#1E3A8A', '#0D9488']);

    const pie = d3.pie()
        .value(d => d.amount);

    const arc = d3.arc()
        .innerRadius(radius * 0.5)
        .outerRadius(radius * 0.8);

    const arcs = svg.selectAll('arc')
        .data(pie(data))
        .enter()
        .append('g');

    arcs.append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.method))
        .attr('stroke', 'white')
        .style('stroke-width', '2px')
        .on('mouseover', function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('transform', `scale(1.05)`);
            
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            tooltip.html(`${d.data.method}<br/>$${d.data.amount.toLocaleString()}`)
                .style('left', (event.pageX) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('transform', `scale(1)`);
            
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        });

    arcs.append('text')
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .text(d => d.data.method);
}

function createBarChart(data, container) {
    const margin = {top: 20, right: 20, bottom: 30, left: 60};
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Create tooltip
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    const svg = d3.select(container)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .range([height, 0]);

    x.domain(data.map(d => d.state));
    y.domain([0, d3.max(data, d => d.amount)]);

    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append('g')
        .call(d3.axisLeft(y));

    svg.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.state))
        .attr('width', x.bandwidth())
        .attr('y', d => y(d.amount))
        .attr('height', d => height - y(d.amount))
        .attr('fill', '#1E3A8A')
        .on('mouseover', function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('fill', '#2563EB');
            
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            tooltip.html(`${d.state}<br/>$${d.amount.toLocaleString()}`)
                .style('left', (event.pageX) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('fill', '#1E3A8A');
            
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        });
}

function createLineChart(data, container) {
    const margin = {top: 20, right: 20, bottom: 30, left: 60};
    const width = 1000 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Create tooltip
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    const svg = d3.select(container)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
        .range([0, width]);

    const y = d3.scaleLinear()
        .range([height, 0]);

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

    // Add the line
    const path = svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#1E3A8A')
        .attr('stroke-width', 2)
        .attr('d', line);

    // Add dots
    const dots = svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
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
            tooltip.html(`Year: ${d.year}<br/>$${d.amount.toLocaleString()}`)
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

function createMapChart(geoData, data, container) {
    const width = 1000;
    const height = 600;

    // Create tooltip
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const projection = d3.geoMercator()
        .center([134, -28])
        .scale(1000)
        .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    const color = d3.scaleSequential(d3.interpolateBlues)
        .domain([0, d3.max(data, d => d.amount)]);

    svg.selectAll('path')
        .data(geoData.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', d => {
            const stateData = data.find(f => f.state === d.properties.STATE_CODE);
            return stateData ? color(stateData.amount) : '#ccc';
        })
        .attr('stroke', 'white')
        .attr('stroke-width', 0.5)
        .on('mouseover', function(event, d) {
            const stateData = data.find(f => f.state === d.properties.STATE_CODE);
            
            d3.select(this)
                .transition()
                .duration(200)
                .attr('stroke-width', 2)
                .attr('stroke', '#2563EB');
            
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            tooltip.html(`${d.properties.STATE_NAME}<br/>$${stateData ? stateData.amount.toLocaleString() : 'No data'}`)
                .style('left', (event.pageX) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('stroke-width', 0.5)
                .attr('stroke', 'white');
            
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        });
}