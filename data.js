// Load CSV data
async function loadData() {
    try {
        const speedData = await d3.csv('data/speed_fines.csv');
        const mobileData = await d3.csv('data/mobile_fines.csv');
        
        // Parse and transform data structure
        const parseData = (data) => {
            return data.map(d => ({
                year: new Date(d.START_DATE).getFullYear(),
                state: d.JURISDICTION,
                method: d.DETECTION_METHOD,
                age_group: d.AGE_GROUP || 'All ages',
                metric: d.METRIC,
                amount: +d.FINES,
                count: 1
            }));
        };

        window.speedFinesData = parseData(speedData);
        window.mobileFinesData = parseData(mobileData);
        
        // Initialize charts based on the current page
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage === 'mobile.html') {
            window.finesData = window.mobileFinesData;
        } else {
            window.finesData = window.speedFinesData;
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

const australiaGeoData = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: { STATE_NAME: "New South Wales", STATE_CODE: "NSW" },
            geometry: {
                type: "Polygon",
                coordinates: [[[147.0, -33.0], [153.0, -33.0], [153.0, -29.0], [147.0, -29.0], [147.0, -33.0]]]
            }
        },
        {
            type: "Feature",
            properties: { STATE_NAME: "Victoria", STATE_CODE: "VIC" },
            geometry: {
                type: "Polygon",
                coordinates: [[[143.0, -38.0], [150.0, -38.0], [150.0, -34.0], [143.0, -34.0], [143.0, -38.0]]]
            }
        },
        {
            type: "Feature",
            properties: { STATE_NAME: "Queensland", STATE_CODE: "QLD" },
            geometry: {
                type: "Polygon",
                coordinates: [[[142.0, -26.0], [153.0, -26.0], [153.0, -10.0], [142.0, -10.0], [142.0, -26.0]]]
            }
        },
        {
            type: "Feature",
            properties: { STATE_NAME: "South Australia", STATE_CODE: "SA" },
            geometry: {
                type: "Polygon",
                coordinates: [[[129.0, -26.0], [141.0, -26.0], [141.0, -38.0], [129.0, -38.0], [129.0, -26.0]]]
            }
        },
        {
            type: "Feature",
            properties: { STATE_NAME: "Western Australia", STATE_CODE: "WA" },
            geometry: {
                type: "Polygon",
                coordinates: [[[112.0, -14.0], [129.0, -14.0], [129.0, -35.0], [112.0, -35.0], [112.0, -14.0]]]
            }
        },
        {
            type: "Feature",
            properties: { STATE_NAME: "Tasmania", STATE_CODE: "TAS" },
            geometry: {
                type: "Polygon",
                coordinates: [[[144.0, -40.0], [148.0, -40.0], [148.0, -42.0], [144.0, -42.0], [144.0, -40.0]]]
            }
        },
        {
            type: "Feature",
            properties: { STATE_NAME: "Northern Territory", STATE_CODE: "NT" },
            geometry: {
                type: "Polygon",
                coordinates: [[[129.0, -11.0], [138.0, -11.0], [138.0, -26.0], [129.0, -26.0], [129.0, -11.0]]]
            }
        },
        {
            type: "Feature",
            properties: { STATE_NAME: "Australian Capital Territory", STATE_CODE: "ACT" },
            geometry: {
                type: "Polygon",
                coordinates: [[[148.0, -35.0], [149.0, -35.0], [149.0, -36.0], [148.0, -36.0], [148.0, -35.0]]]
            }
        }
    ]
};