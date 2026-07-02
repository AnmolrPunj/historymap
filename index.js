const svg = d3.select("#map-svg");
const tooltip = d3.select("#tooltip");

function getSize() {
    return { width: window.innerWidth, height: window.innerHeight };
}

let width, height;
({ width, height } = getSize());

const WORLD_WIDTH = width * 1.08;

svg.attr("viewBox", `0 0 ${WORLD_WIDTH} ${height}`);

const projection = d3.geoMercator()
    .rotate([-11.3, 0])
    .scale(WORLD_WIDTH / (2.1 * Math.PI))
    .translate([WORLD_WIDTH / 2, height / 1.5]);

const path = d3.geoPath().projection(projection);

const CITIES = [
    { name: "Leningrad", lat: 59.94, lng: 30.31 },
    { name: "Stalingrad", lat: 48.71, lng: 44.51 },
    { name: "Moscow", lat: 55.75, lng: 37.62 },
    { name: "Berlin", lat: 52.52, lng: 13.40 },
    { name: "London", lat: 51.51, lng: -0.13 },
    { name: "Paris", lat: 48.86, lng: 2.35 },
    { name: "Rome", lat: 41.90, lng: 12.50 },
    { name: "Warsaw", lat: 52.23, lng: 21.01 },
    { name: "Tokyo", lat: 35.68, lng: 139.69 },
    { name: "Chongqing", lat: 29.56, lng: 106.55 },
    { name: "Singapore", lat: 1.35, lng: 103.82 },
    { name: "Manila", lat: 14.60, lng: 120.98 },
    { name: "Honolulu", lat: 21.31, lng: -157.86 },
    { name: "Cairo", lat: 30.04, lng: 31.24 },
    { name: "Darwin", lat: -12.46, lng: 130.84 },
    { name: "Washington", lat: 38.91, lng: -77.04 }
];

const AXIS_POWERS = new Set(["Germany", "Italy", "Japan", "Empire of Japan", "Manchukuo"]);
const ALLIED_POWERS = new Set(["United Kingdom", "Britain", "France", "USSR", "Soviet Union", "United States", "China", "Chinese Warlords", "Netherlands", "Belgium", "Australia", "Canada", "New Zealand", "Union of South Africa", "British Raj"]);

function countryFill(d) {
    const s = d.properties.SUBJECTO || d.properties.NAME;
    if (AXIS_POWERS.has(s)) return "#ddc2b0";
    if (ALLIED_POWERS.has(s)) return "#ccd4c4";
    return "#e8e2d0";
}

function labelPoint(d) {
    if (d.geometry.type === "Polygon") return path.centroid(d);
    let best = null;
    let bestArea = -1;
    for (const coords of d.geometry.coordinates) {
        const poly = { type: "Polygon", coordinates: coords };
        const a = d3.geoArea(poly);
        if (a > bestArea) {
            bestArea = a;
            best = poly;
        }
    }
    return path.centroid(best);
}

let g;
let labelLayer;
let zoom;
let activeBattle = null;
let currentTransform = d3.zoomIdentity;

function positionTooltip(t) {
    if (!activeBattle) return;

    const pt = t.apply(activeBattle.__p);

    if (
        pt[0] < 0 ||
        pt[0] > width ||
        pt[1] < 0 ||
        pt[1] > height
    ) {
        tooltip.style("display", "none");
        return;
    }

    tooltip.style("display", "block");

    const node = tooltip.node();
    const tw = node.offsetWidth;
    const th = node.offsetHeight;

    let x = pt[0] + 14;
    let y = pt[1] + 14;

    if (x + tw > width - 8) x = pt[0] - tw - 14;
    if (y + th > height - 8) y = height - th - 8;
    if (x < 8) x = 8;
    if (y < 8) y = 8;

    tooltip
        .style("left", x + "px")
        .style("top", y + "px");
}

function updateOverlay(t) {
    const k = t.k;
    g.selectAll("path.river").style("opacity", k >= 2 ? 1 : 0);
    labelLayer.selectAll("text.country-label")
        .attr("x", d => t.apply(d.__lp)[0])
        .attr("y", d => t.apply(d.__lp)[1])
        .style("opacity", k >= 2.5 ? 1 : 0);
    labelLayer.selectAll("circle.city")
        .attr("cx", c => t.apply(c.__p)[0])
        .attr("cy", c => t.apply(c.__p)[1])
        .style("opacity", k >= 2.5 ? 1 : 0);
    labelLayer.selectAll("text.city-label")
        .attr("x", c => t.apply(c.__p)[0] + 6)
        .attr("y", c => t.apply(c.__p)[1] - 6)
        .style("opacity", k >= 2.5 ? 1 : 0);
    labelLayer.selectAll("circle.battle")
        .attr("cx", b => t.apply(b.__p)[0])
        .attr("cy", b => t.apply(b.__p)[1]);
    positionTooltip(t);
}

Promise.all([
    d3.json("https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_1938.geojson"),
    d3.json("https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_rivers_lake_centerlines.geojson"),
    d3.json("https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_lakes.geojson")
])
    .then(([world, rivers, lakes]) => {
        const countries = {
            type: "FeatureCollection",
            features: world.features.filter(d => {
                if (d.properties.NAME === "Antarctica" || d.properties.SUBJECTO === "Antarctica") return false;
                const b = d3.geoBounds(d);
                return b[1][1] > -60;
            })
        };

        console.log("SUBJECTO values:", [...new Set(countries.features.map(d => d.properties.SUBJECTO))].sort());

        g = svg.append("g");
        labelLayer = svg.append("g");

        g.selectAll("path.land")
            .data(countries.features)
            .enter()
            .append("path")
            .attr("class", "land")
            .style("fill", countryFill)
            .attr("d", path);

        g.selectAll("path.lake")
            .data(lakes.features)
            .enter()
            .append("path")
            .attr("class", "lake")
            .attr("d", path);

        g.selectAll("path.river")
            .data(rivers.features)
            .enter()
            .append("path")
            .attr("class", "river")
            .style("opacity", 0)
            .attr("d", path);

        const labelled = countries.features.filter(d => d.properties.NAME && d3.geoArea(d) > 0.002);
        labelled.forEach(d => { d.__lp = labelPoint(d); });

        labelLayer.selectAll("text.country-label")
            .data(labelled)
            .enter()
            .append("text")
            .attr("class", "country-label")
            .attr("x", d => d.__lp[0])
            .attr("y", d => d.__lp[1])
            .style("opacity", 0)
            .text(d => d.properties.NAME);

        CITIES.forEach(c => { c.__p = projection([c.lng, c.lat]); });

        labelLayer.selectAll("circle.city")
            .data(CITIES)
            .enter()
            .append("circle")
            .attr("class", "city")
            .attr("cx", c => c.__p[0])
            .attr("cy", c => c.__p[1])
            .attr("r", 2)
            .style("opacity", 0);

        labelLayer.selectAll("text.city-label")
            .data(CITIES)
            .enter()
            .append("text")
            .attr("class", "city-label")
            .attr("x", c => c.__p[0] + 6)
            .attr("y", c => c.__p[1] - 6)
            .style("opacity", 0)
            .text(c => c.name);

        const southY = projection([0, -60])[1];
        const northY = projection([0, 82])[1];

        zoom = d3.zoom()
            .scaleExtent([1, 12])
            .extent([[0, 0], [width, height]])
            .translateExtent([[0, 0], [WORLD_WIDTH, height]])
            .on("zoom", (event) => {
                let t = event.transform;

                if (t.k <= 1.001) {
                    t = d3.zoomIdentity;
                    currentTransform = t;
                    g.attr("transform", t);
                    updateOverlay(t);
                    return;
                }

                currentTransform = t;
                g.attr("transform", t);
                updateOverlay(t);
            });

        svg.call(zoom);

        svg.on("click", () => {
            activeBattle = null;
            tooltip.style("display", "none");
        });

        return d3.json("data.json");
    })
    .then(battles => {
        const valid = battles.filter(b => b.lat !== null && b.lng !== null);
        valid.forEach(b => { b.__p = projection([b.lng, b.lat]); });

        labelLayer.selectAll("circle.battle")
            .data(valid)
            .enter()
            .append("circle")
            .attr("class", "battle")
            .attr("r", 5)
            .on("click", (event, b) => {
                event.stopPropagation();

                if (activeBattle === b) {
                    activeBattle = null;
                    tooltip.style("display", "none");
                    return;
                }

                activeBattle = b;

                tooltip
                    .style("display", "block")
                    .html(`
                        <span id="tt-close">×</span>
                        <h3>${b.name}</h3>
                        <div class="dates">${b.dates}</div>
                        ${b.summary}
                    `);

                const k = 5;

                svg.transition()
                    .duration(750)
                    .call(
                        zoom.transform,
                        d3.zoomIdentity
                            .translate(width / 2, height / 2)
                            .scale(k)
                            .translate(-b.__p[0], -b.__p[1])
                    );
            });

        updateOverlay(currentTransform);
    })
    .catch(err => {
        console.error("Failed to load map data:", err);
    });

tooltip.on("click", (e) => {
    if (e.target.id === "tt-close") {
        activeBattle = null;
        tooltip.style("display", "none");
    }
});

window.addEventListener("resize", () => {
    ({ width, height } = getSize());

    const WORLD_WIDTH = width * 1.08;

    svg.attr("viewBox", `0 0 ${WORLD_WIDTH} ${height}`);

    projection
        .rotate([-11.3, 0])
        .scale(WORLD_WIDTH / (2.1 * Math.PI))
        .translate([WORLD_WIDTH / 2, height / 1.5]);

    g.selectAll("path.land").attr("d", path);
    g.selectAll("path.lake").attr("d", path);
    g.selectAll("path.river").attr("d", path);

    labelLayer.selectAll("text.country-label").each(d => {
        d.__lp = labelPoint(d);
    });

    CITIES.forEach(c => {
        c.__p = projection([c.lng, c.lat]);
    });

    labelLayer.selectAll("circle.battle").each(b => {
        b.__p = projection([b.lng, b.lat]);
    });

    updateOverlay(currentTransform);
});