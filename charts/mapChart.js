function createMapChartFromSVG(svgPath, data, containerId) {
    d3.xml(svgPath).then(svgData => {
        const importedNode = document.importNode(svgData.documentElement, true);
        const container = document.querySelector(containerId);
        container.innerHTML = '';
        container.appendChild(importedNode);

        const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        const maxVal = d3.max(data, d => d.amount);
        const minVal = d3.min(data, d => d.amount);
        const color = d3.scaleSequential()
            .domain([minVal, maxVal])
            .interpolator(d3.interpolateBlues);

        data.forEach(d => {
            const stateId = `AU-${d.state}`;
            const region = container.querySelector(`#${stateId}`);
            if (region) {
                region.style.fill = color(d.amount);
                region.addEventListener('mouseover', function(event) {
                    tooltip.transition().duration(200).style('opacity', 0.9);
                    tooltip.html(`State: ${stateId.replace("AU-", "")}<br/>Fines: ${d.amount.toLocaleString()}`)
                        .style('left', `${event.pageX}px`)
                        .style('top', `${event.pageY - 28}px`);
                    this.style.stroke = '#2563EB';
                    this.style.strokeWidth = '2px';
                });
                region.addEventListener('mouseout', function() {
                    tooltip.transition().duration(500).style('opacity', 0);
                    this.style.stroke = 'white';
                    this.style.strokeWidth = '0.5px';
                });
            }
        });

        const legendLabels = container.parentElement.querySelector('.legend-labels');
        if (legendLabels) {
            legendLabels.children[0].textContent = `${Math.round(minVal).toLocaleString()}`;
            legendLabels.children[1].textContent = `${Math.round(maxVal).toLocaleString()}`;
        }
    }).catch(err => console.error('Error loading SVG map:', err));
}
