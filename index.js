const svg = d3.select("#map-svg");

function getSize() {
    return { width: window.innerWidth, height: window.innerHeight };
}

let { width, height } = getSize();

svg.attr("viewBox", `0 0 ${width} ${height}`);

const projection = d3.geoEquirectangular()
    .rotate([-11.3, 0]);

const path = d3.geoPath().projection(projection);

d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
    .then(world => {
        const allCountries = topojson.feature(world, world.objects.countries);
        const countries = {
            type: "FeatureCollection",
            features: allCountries.features.filter(d => d.id !== "010")
        };
        projection.fitSize([width, height], countries);
        svg.selectAll("path.land")
            .data(countries.features)
            .enter()
            .append("path")
            .attr("class", "land")
            .attr("d", path);
    })
    .catch(err => {
        console.error("Failed to load world map data:", err);
    });

window.addEventListener("resize", () => {
    ({ width, height } = getSize());
    svg.attr("viewBox", `0 0 ${width} ${height}`);
    const data = svg.selectAll("path.land").data();
    projection.fitSize([width, height], { type: "FeatureCollection", features: data });
    svg.selectAll("path.land").attr("d", path);
});