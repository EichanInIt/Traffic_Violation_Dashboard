// Initialize dashboard for mobile use fines
document.addEventListener('DOMContentLoaded', async function () {
    // Load data
    await loadData();

    // Initial state
    let currentYear = 2008;
    let currentState = '';
    let selectedMethods = ['Police issued', 'Fixed or mobile camera'];
    let selectedAgeGroup = 'All ages';

    // Update functions
    function updateMetrics(filteredData) {
        const totalAmount = d3.sum(filteredData, d => d.amount);
        const totalCount = d3.sum(filteredData, d => d.count);
        const avgAmount = totalCount > 0 ? totalAmount / totalCount : 0;

        document.getElementById('totalFines').textContent = totalAmount.toLocaleString();
<<<<<<< Updated upstream
        document.getElementById('totalCount').textContent = totalCount.toLocaleString();
=======
        //document.getElementById('totalCount').textContent = totalCount.toLocaleString();
>>>>>>> Stashed changes
        document.getElementById('averageFine').textContent = Math.round(avgAmount).toLocaleString();
    }

    function updateSummaryTable(allData) {
        const tbody = document.querySelector("#summaryTable tbody");
        tbody.innerHTML = "";

        const grouped = d3.group(allData, d => d.state);
        grouped.forEach((entries, state) => {
            const total = d3.sum(entries, d => d.amount);
            const methodCounts = d3.rollup(entries, v => v.length, d => d.method);
            const mostCommon = Array.from(methodCounts).sort((a, b) => b[1] - a[1])[0][0];
            const row = `<tr>
                <td>${state}</td>
                <td>${mostCommon}</td>
                <td>${total.toLocaleString()}</td>
            </tr>`;
            tbody.innerHTML += row;
        });
    }

    function updateCharts() {
        // Clear existing charts
        document.getElementById('pieChart').innerHTML = '';
        document.getElementById('barChart').innerHTML = '';
        document.getElementById('lineChart').innerHTML = '';
        document.getElementById('mapChart').innerHTML = '';

        // Filter data
        let filteredData = finesData.filter(d => {
            return (
                d.year === currentYear &&
                selectedMethods.includes(d.method) &&
                (selectedAgeGroup === 'All ages' || d.age_group === selectedAgeGroup)
            );
        });

        const stateData = currentState ? filteredData.filter(d => d.state === currentState) : filteredData;

        // Update metrics
        updateMetrics(stateData);

        // Prepare data for charts
        const pieData = d3.group(stateData, d => d.method);
        const pieChartData = Array.from(pieData, ([method, data]) => ({
            method,
            amount: d3.sum(data, d => d.amount)
        }));

        const barData = Array.from(d3.group(filteredData, d => d.state), ([state, data]) => ({
            state,
            amount: d3.sum(data, d => d.amount)
        }));

        const lineData = Array.from(d3.group(finesData, d => d.year), ([year, data]) => ({
            year,
            amount: d3.sum(data, d => d.amount)
        }));

        // Create charts
        createPieChart(pieChartData, '#pieChart');
        createBarChart(barData, '#barChart');
        createLineChart(lineData, '#lineChart');
        createMapChartFromSVG('images/australia.svg', barData, '#mapChart');

        // Update state summary table
        updateSummaryTable(filteredData);
    }

    // Event listeners
    document.getElementById('yearFilter').addEventListener('input', function (e) {
        currentYear = parseInt(e.target.value);
        document.getElementById('yearLabel').textContent = currentYear;
        updateCharts();
    });

    document.querySelectorAll('.checkbox-group input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            selectedMethods = Array.from(document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked'))
                .map(cb => cb.value);
            updateCharts();
        });
    });

    document.querySelectorAll('.age-button').forEach(button => {
        button.addEventListener('click', function () {
            document.querySelectorAll('.age-button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            selectedAgeGroup = this.dataset.age;
            updateCharts();
        });
    });

    // Initial render
    updateCharts();
});

// Download Report functionality
document.getElementById('downloadData').addEventListener('click', function () {
    html2canvas(document.querySelector('.dashboard')).then(canvas => {
        const link = document.createElement('a');
        link.download = 'Traffic_Fines_Report.png';
        link.href = canvas.toDataURL();
        link.click();
    });
});
