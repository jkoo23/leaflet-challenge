//store API endpoint as queryURL
let queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

    // Create base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

// Create a baseMaps object.
    let baseMaps = {
        "Street Map": street,
    };

// Create map
    let myMap = L.map("map", {
        center: [38,-110],
        zoom: 5,
        layers: [street]
    });

//perform GET request to the query URL
d3.json(queryURL).then(function (data) {
// Once we get a response, send the data.features object to the createFeatures function.
    console.log(data)

L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, styleinfo(feature));
    },
    onEachFeature: function (feature,layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Mag:${feature.properties.mag}`);
    }
}).addTo(myMap);

function styleinfo (feature) {
    return {
    radius: feature.properties.mag*6,
    fillColor: color(feature.geometry.coordinates[2]),
    color:"black",
    fillOpacity: 0.8
    };
}

function color (depth) {
        switch (true) {
          case depth > 90:
            return '#bd0026';
          case depth > 70:
            return '#f03b20';
          case depth > 50:
            return '#fd8d3c';
          case depth > 30:
            return '#feb24c';
          case depth > 10:
            return '#fed976';
          default:
            return '#ffffb2';
        }
}

function getColorLegend() {
    const legendContent = `
        <div class="legend">
            <p>Depth Legend</p>
            <div class="legend-item" style=\'background-color:#bd0026\'> > 90 km</div>
            <div class="legend-item" style=\'background-color:#f03b20\'> 71-90 km</div>
            <div class="legend-item" style=\'background-color:#fd8d3c\'> 51-70 km</div>
            <div class="legend-item" style=\'background-color:#feb24c\'> 31-50 km</div>
            <div class="legend-item" style=\'background-color:#fed976\'> 11-30 km</div>
            <div class="legend-item" style=\'background-color:#ffffb2\'> <= 10 km</div>
        </div>
    `;
    return legendContent;
}

// Create a custom legend control and add it to the map
const legend = L.control({ position: 'bottomright' });

legend.onAdd = function () {
    const div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = getColorLegend();
    return div;
};

legend.addTo(myMap);
})

