const svg = d3.select("#map-svg");
const tooltip = d3.select("#tooltip");
const onboarding = d3.select("#onboarding");

const ONBOARDING_KEY = "ww2map_onboarding_seen";

function dismissOnboarding() {
    onboarding.style("display", "none");
    try {
        localStorage.setItem(ONBOARDING_KEY, "true");
    } catch (e) {
    }
}

function initOnboarding() {
    let seen = false;
    try {
        seen = localStorage.getItem(ONBOARDING_KEY) === "true";
    } catch (e) {
        seen = false;
    }
    if (seen) {
        onboarding.style("display", "none");
        return;
    }
    onboarding.style("display", "flex");
    onboarding.on("click", (e) => {
        if (e.target.id === "onboarding-close" || e.target.id === "onboarding" || e.target.id === "onboarding-dismiss") {
            dismissOnboarding();
        }
    });
}

initOnboarding();

function getSize() {
    return { width: window.innerWidth, height: window.innerHeight };
}

let width, height;
({ width, height } = getSize());

svg.attr("viewBox", `0 0 ${width} ${height}`);

const projection = d3.geoMercator()
    .rotate([-11.3, 0])
    .scale(width / (2.1 * Math.PI))
    .translate([width / 2, height / 1.5]);

const path = d3.geoPath().projection(projection);

const CITIES = [
    { name: "Leningrad", lat: 59.94, lng: 30.31 },
    { name: "Stalingrad", lat: 48.71, lng: 44.51 },
    { name: "Moscow", lat: 55.75, lng: 37.62 },
    { name: "Kiev", lat: 50.45, lng: 30.52 },
    { name: "Kursk", lat: 51.73, lng: 36.19 },
    { name: "Berlin", lat: 52.52, lng: 13.40 },
    { name: "Hamburg", lat: 53.55, lng: 9.99 },
    { name: "Munich", lat: 48.14, lng: 11.58 },
    { name: "London", lat: 51.51, lng: -0.13 },
    { name: "Paris", lat: 48.86, lng: 2.35 },
    { name: "Rome", lat: 41.90, lng: 12.50 },
    { name: "Warsaw", lat: 52.23, lng: 21.01 },
    { name: "Vienna", lat: 48.21, lng: 16.37 },
    { name: "Amsterdam", lat: 52.37, lng: 4.90 },
    { name: "Brussels", lat: 50.85, lng: 4.35 },
    { name: "Stockholm", lat: 59.33, lng: 18.07 },
    { name: "Helsinki", lat: 60.17, lng: 24.94 },
    { name: "Oslo", lat: 59.91, lng: 10.75 },
    { name: "Copenhagen", lat: 55.68, lng: 12.57 },
    { name: "Bucharest", lat: 44.43, lng: 26.10 },
    { name: "Budapest", lat: 47.50, lng: 19.04 },
    { name: "Prague", lat: 50.08, lng: 14.44 },
    { name: "Belgrade", lat: 44.80, lng: 20.46 },
    { name: "Athens", lat: 37.98, lng: 23.73 },
    { name: "Ankara", lat: 39.93, lng: 32.86 },
    { name: "Tehran", lat: 35.69, lng: 51.39 },
    { name: "Baghdad", lat: 33.34, lng: 44.40 },
    { name: "Tokyo", lat: 35.68, lng: 139.69 },
    { name: "Hiroshima", lat: 34.39, lng: 132.45 },
    { name: "Nagasaki", lat: 32.75, lng: 129.88 },
    { name: "Osaka", lat: 34.69, lng: 135.50 },
    { name: "Seoul", lat: 37.57, lng: 126.98 },
    { name: "Nanjing", lat: 32.06, lng: 118.80 },
    { name: "Chongqing", lat: 29.56, lng: 106.55 },
    { name: "Beijing", lat: 39.91, lng: 116.39 },
    { name: "Shanghai", lat: 31.23, lng: 121.47 },
    { name: "Vladivostok", lat: 43.11, lng: 131.87 },
    { name: "Singapore", lat: 1.35, lng: 103.82 },
    { name: "Manila", lat: 14.60, lng: 120.98 },
    { name: "Rangoon", lat: 16.87, lng: 96.19 },
    { name: "Bangkok", lat: 13.75, lng: 100.52 },
    { name: "Hanoi", lat: 21.03, lng: 105.85 },
    { name: "Jakarta", lat: -6.21, lng: 106.85 },
    { name: "Calcutta", lat: 22.57, lng: 88.36 },
    { name: "Bombay", lat: 18.96, lng: 72.82 },
    { name: "Karachi", lat: 24.86, lng: 67.01 },
    { name: "Colombo", lat: 6.93, lng: 79.85 },
    { name: "Honolulu", lat: 21.31, lng: -157.86 },
    { name: "Cairo", lat: 30.04, lng: 31.24 },
    { name: "Alexandria", lat: 31.20, lng: 29.92 },
    { name: "Tobruk", lat: 32.08, lng: 23.98 },
    { name: "Addis Ababa", lat: 9.03, lng: 38.74 },
    { name: "Nairobi", lat: -1.29, lng: 36.82 },
    { name: "Dakar", lat: 14.72, lng: -17.47 },
    { name: "Lagos", lat: 6.52, lng: 3.38 },
    { name: "Johannesburg", lat: -26.20, lng: 28.04 },
    { name: "Darwin", lat: -12.46, lng: 130.84 },
    { name: "Sydney", lat: -33.87, lng: 151.21 },
    { name: "Melbourne", lat: -37.81, lng: 144.96 },
    { name: "Brisbane", lat: -27.47, lng: 153.02 },
    { name: "Perth", lat: -31.95, lng: 115.86 },
    { name: "Canberra", lat: -35.28, lng: 149.13 },
    { name: "Washington", lat: 38.91, lng: -77.04 },
    { name: "New York", lat: 40.71, lng: -74.01 },
    { name: "Los Angeles", lat: 34.05, lng: -118.24 },
    { name: "Chicago", lat: 41.88, lng: -87.63 },
    { name: "Buenos Aires", lat: -34.61, lng: -58.38 },
    { name: "Rio de Janeiro", lat: -22.91, lng: -43.17 },
    { name: "Mexico City", lat: 19.43, lng: -99.13 },
    { name: "Ottawa", lat: 45.42, lng: -75.69 },
    { name: "Toronto", lat: 43.65, lng: -79.38 },
    { name: "Vancouver", lat: 49.25, lng: -123.12 }
];

const LABEL_OVERRIDES = {
    "Empire of Japan": [135.50, 34.69],
    "United States": [-98.58, 39.83],
    "Australia": [134.49, -25.73],
    "Canada": [-96.82, 60.00],
    "USSR": [60.00, 55.00],
    "Brazil": [-51.93, -14.24],
    "China": [104.19, 35.86],
    "Chinese Warlords": [104.19, 35.86]
};

const AXIS_POWERS = new Set(["Germany", "Italy", "Japan", "Empire of Japan", "Manchukuo"]);
const ALLIED_POWERS = new Set([
    "United Kingdom", "Britain", "France", "USSR", "Soviet Union",
    "United States", "China", "Chinese Warlords", "Netherlands", "Belgium",
    "Australia", "Canada", "New Zealand", "Union of South Africa", "British Raj",
    "French Indo-China", "Cambodia", "Laos", "Syria (France)", "Morocco (France)",
    "Algeria (France)", "Tunisia (France)", "Madagascar (France)"
]);

const COUNTRIES_WITH_CITIES = new Set([
    "USSR", "United States", "China", "Chinese Warlords", "Empire of Japan",
    "Australia", "Canada", "Brazil", "Germany", "France", "United Kingdom",
    "Italy", "British Raj", "French Indo-China"
]);

function countryFill(d) {
    const s = d.properties.SUBJECTO || d.properties.NAME;
    if (AXIS_POWERS.has(s)) return "#ddc2b0";
    if (ALLIED_POWERS.has(s)) return "#ccd4c4";
    return "#e8e2d0";
}

function labelPoint(d) {
    const override = LABEL_OVERRIDES[d.properties.NAME];
    if (override) return projection(override);
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
let rafPending = false;
let validBattles = [];
let isAutoZooming = false;
let tooltipSide = null;
let countriesData = null;

const isMobile = window.innerWidth < 768;
const MOBILE_DEFAULT_ZOOM = 2.5;
const MOBILE_AUTO_ZOOM_K = 4;

const ZOOM_MAX = 8;
const AUTO_ZOOM_K = 6;
const BATTLE_LABEL_MIN_ZOOM = 2;
const BATTLE_R_MIN = 4;
const BATTLE_R_MAX = 8;
const CITY_SUPPRESS_PX = 70;
const PAN_MARGIN = 60;

function battleRadius(k) {
    const ratio = (k - 1) / (ZOOM_MAX - 1);
    return BATTLE_R_MIN + (BATTLE_R_MAX - BATTLE_R_MIN) * ratio;
}

function isCitySuppressed(c, t) {
    const cp = t.apply(c.__p);
    for (const b of validBattles) {
        const bp = t.apply(b.__p);
        const dx = cp[0] - bp[0];
        const dy = cp[1] - bp[1];
        if (Math.sqrt(dx * dx + dy * dy) < CITY_SUPPRESS_PX) return true;
    }
    return false;
}

function renderTooltip(b) {
    tooltip
        .style("display", "block")
        .html(`<span id="tt-close">×</span><h3>${b.name}</h3><div class="dates">${b.dates}</div><div id="tt-summary">${b.summary}</div><a id="tt-readmore" href="info/index.html?id=${b.id}">Read more →</a>`);
}

function computeFinalTransform(b) {
    const zoomK = isMobile ? MOBILE_AUTO_ZOOM_K : AUTO_ZOOM_K;
    return d3.zoomIdentity.translate(width / 2, height / 2).scale(zoomK).translate(-b.__p[0], -b.__p[1]);
}

function pickTooltipSide(t, pt, tw, th) {
    const options = [
        { dx: 1, dy: 1 },
        { dx: -1, dy: 1 },
        { dx: 1, dy: -1 },
        { dx: -1, dy: -1 }
    ];
    let best = options[0];
    let bestCount = Infinity;
    for (const o of options) {
        const cx = o.dx === 1 ? pt[0] + 14 : pt[0] - tw - 14;
        const cy = o.dy === 1 ? pt[1] + 14 : pt[1] - th - 14;
        let count = 0;
        for (const b of validBattles) {
            if (b === activeBattle) continue;
            const bp = t.apply(b.__p);
            if (bp[0] >= cx && bp[0] <= cx + tw && bp[1] >= cy && bp[1] <= cy + th) count++;
        }
        if (count < bestCount) {
            bestCount = count;
            best = o;
        }
    }
    return best;
}

function positionTooltip(t) {
    if (!activeBattle) return;
    const pt = t.apply(activeBattle.__p);
    if (!isAutoZooming && (t.k < 2 || pt[0] < 0 || pt[0] > width || pt[1] < 0 || pt[1] > height)) {
        activeBattle = null;
        tooltipSide = null;
        tooltip.style("display", "none");
        return;
    }
    const node = tooltip.node();
    const tw = node.offsetWidth;
    const th = node.offsetHeight;
    if (!tooltipSide) {
        tooltipSide = pickTooltipSide(t, pt, tw, th);
    }
    let x = tooltipSide.dx === 1 ? pt[0] + 14 : pt[0] - tw - 14;
    let y = tooltipSide.dy === 1 ? pt[1] + 14 : pt[1] - th - 14;
    if (x + tw > width - 8) x = width - tw - 8;
    if (y + th > height - 8) y = height - th - 8;
    if (x < 8) x = 8;
    if (y < 8) y = 8;
    tooltip.style("left", x + "px").style("top", y + "px");
}

function updateOverlay(t) {
    const k = t.k;
    const effectiveK = isMobile ? k / MOBILE_DEFAULT_ZOOM : k;

    const showRivers = effectiveK >= 2;
    g.selectAll("path.river").style("opacity", showRivers ? 1 : 0);

    const showCountryLabels = effectiveK >= 2;
    if (showCountryLabels) {
        labelLayer.selectAll("text.country-label")
            .attr("x", d => t.apply(d.__lp)[0])
            .attr("y", d => t.apply(d.__lp)[1])
            .style("opacity", d => {
                if (COUNTRIES_WITH_CITIES.has(d.properties.NAME)) return effectiveK < 3.2 ? 1 : 0;
                return 1;
            })
            .style("font-size", Math.max(8, 10 / effectiveK * 1.5) + "px");
    } else {
        labelLayer.selectAll("text.country-label").style("opacity", 0);
    }

    const showCities = effectiveK >= 3.5;
    if (showCities) {
        for (const c of CITIES) {
            c.__suppressed = isCitySuppressed(c, t);
        }
        labelLayer.selectAll("circle.city")
            .attr("cx", c => t.apply(c.__p)[0])
            .attr("cy", c => t.apply(c.__p)[1])
            .style("opacity", c => c.__suppressed ? 0 : 1);

        labelLayer.selectAll("text.city-label")
            .attr("x", c => t.apply(c.__p)[0] + 6)
            .attr("y", c => t.apply(c.__p)[1] - 6)
            .style("opacity", c => c.__suppressed ? 0 : 1)
            .style("font-size", Math.max(7, 7 * (effectiveK / 3.5)) + "px");
    } else {
        labelLayer.selectAll("circle.city").style("opacity", 0);
        labelLayer.selectAll("text.city-label").style("opacity", 0);
    }

    labelLayer.selectAll("circle.battle")
        .attr("cx", b => t.apply(b.__p)[0])
        .attr("cy", b => t.apply(b.__p)[1])
        .attr("r", battleRadius(k));

    labelLayer.selectAll("text.battle-label")
        .attr("x", b => t.apply(b.__p)[0] + 9)
        .attr("y", b => t.apply(b.__p)[1] - 8)
        .style("opacity", effectiveK >= BATTLE_LABEL_MIN_ZOOM ? 1 : 0)
        .style("font-size", Math.max(10, 12 / effectiveK * 1.6) + "px");

    positionTooltip(t);
}

function scheduleOverlayUpdate(t) {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
        updateOverlay(t);
        rafPending = false;
    });
}

// Computes the pan bounds from the actual rendered map content (not an
// arbitrary fraction of the viewport), so the limit stays correct no matter
// what the current zoom scale or screen size is.
function computeTranslateExtent() {
    if (!countriesData) {
        return [[0, 0], [width, height]];
    }
    const b = path.bounds(countriesData);
    return [
        [b[0][0] - PAN_MARGIN, b[0][1] - PAN_MARGIN],
        [b[1][0] + PAN_MARGIN, b[1][1] + PAN_MARGIN]
    ];
}

function syncZoomBounds() {
    if (!zoom) return;
    zoom.extent([[0, 0], [width, height]]);
    zoom.translateExtent(isMobile ? computeTranslateExtent() : [[0, 0], [width, height]]);
}

// Native pull-to-refresh can't coexist with our custom touch panning (there's
// no scrollable surface for the browser to hook into), so this reimplements
// the gesture: once the map is panned as far up as it can go, dragging down
// further past a threshold triggers a reload.
const PTR_THRESHOLD = 70;

function setupPullToRefresh() {
    if (!isMobile) return;

    const indicator = document.createElement("div");
    indicator.id = "ptr-indicator";
    indicator.textContent = "Pull to reload";
    document.body.appendChild(indicator);

    let touchId = null;
    let startY = 0;
    let armed = false;
    let pulling = false;

    function topEdgeScreenY() {
        const extent = computeTranslateExtent();
        return currentTransform.apply([0, extent[0][1]])[1];
    }

    function isPannedToTop() {
        return topEdgeScreenY() >= -2;
    }

    function reset() {
        armed = false;
        pulling = false;
        indicator.style.opacity = 0;
    }

    svg.node().addEventListener("touchstart", (e) => {
        if (e.touches.length !== 1) {
            reset();
            return;
        }
        touchId = e.touches[0].identifier;
        startY = e.touches[0].clientY;
        armed = isPannedToTop();
        pulling = false;
    }, { passive: true });

    svg.node().addEventListener("touchmove", (e) => {
        if (!armed || e.touches.length !== 1) return;
        const touch = Array.from(e.touches).find(tt => tt.identifier === touchId);
        if (!touch) return;
        const dy = touch.clientY - startY;
        if (dy > 0 && isPannedToTop()) {
            pulling = true;
            const pull = Math.min(dy, PTR_THRESHOLD * 1.5);
            indicator.style.opacity = Math.min(1, pull / PTR_THRESHOLD);
            indicator.style.transform = `translate(-50%, ${Math.min(pull, PTR_THRESHOLD) - 40}px)`;
            indicator.textContent = pull >= PTR_THRESHOLD ? "Release to reload" : "Pull to reload";
        } else {
            pulling = false;
            indicator.style.opacity = 0;
        }
    }, { passive: true });

    svg.node().addEventListener("touchend", (e) => {
        if (pulling) {
            const touch = e.changedTouches[0];
            const dy = touch ? touch.clientY - startY : 0;
            if (dy >= PTR_THRESHOLD) {
                location.reload();
                return;
            }
        }
        reset();
    });

    svg.node().addEventListener("touchcancel", reset);
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
        countriesData = countries;

        g = svg.append("g").attr("class", "map-layer");
        labelLayer = svg.append("g").attr("class", "map-layer");

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

        zoom = d3.zoom()
            .scaleExtent([isMobile ? MOBILE_DEFAULT_ZOOM : 1, ZOOM_MAX])
            .on("zoom", (event) => {
                currentTransform = event.transform;
                g.attr("transform", event.transform);
                scheduleOverlayUpdate(event.transform);
                if (!isMobile) {
                    try {
                        sessionStorage.setItem("ww2map_transform", JSON.stringify({
                            k: event.transform.k,
                            x: event.transform.x,
                            y: event.transform.y
                        }));
                    } catch (e) {
                    }
                }
            });

        syncZoomBounds();
        setupPullToRefresh();

        svg.call(zoom);
        svg.on("dblclick.zoom", null);

        try {
            const saved = isMobile ? null : sessionStorage.getItem("ww2map_transform");
            if (saved) {
                const s = JSON.parse(saved);
                const restored = d3.zoomIdentity.translate(s.x, s.y).scale(s.k);
                svg.call(zoom.transform, restored);
            } else if (isMobile) {
                const europeCenter = projection([20, 50]);
                const mobileDefault = d3.zoomIdentity
                    .translate(width / 2, height / 2)
                    .scale(MOBILE_DEFAULT_ZOOM)
                    .translate(-europeCenter[0], -europeCenter[1]);
                svg.call(zoom.transform, mobileDefault);
            }
        } catch (e) {
        }

        svg.on("click", () => {
            activeBattle = null;
            tooltipSide = null;
            tooltip.style("display", "none");
        });

        return d3.json("data.json");
    })
    .then(battles => {
        const valid = battles.filter(b => b.lat !== null && b.lng !== null);
        valid.forEach(b => { b.__p = projection([b.lng, b.lat]); });
        validBattles = valid;

        const battleCoords = new Set(valid.map(b => `${b.lat},${b.lng}`));

        labelLayer.selectAll("circle.city")
            .style("display", c =>
                battleCoords.has(`${c.lat},${c.lng}`) ? "none" : null
            );

        labelLayer.selectAll("circle.battle")
            .data(valid)
            .enter()
            .append("circle")
            .attr("class", "battle")
            .on("click", (event, b) => {
                event.stopPropagation();
                activeBattle = b;
                renderTooltip(b);
                const node = tooltip.node();
                const tw = node.offsetWidth;
                const th = node.offsetHeight;
                const finalT = computeFinalTransform(b);
                tooltipSide = pickTooltipSide(finalT, finalT.apply(b.__p), tw, th);
                isAutoZooming = true;
                svg.transition()
                    .duration(750)
                    .call(zoom.transform, finalT)
                    .on("end", () => { isAutoZooming = false; })
                    .on("interrupt", () => { isAutoZooming = false; });
            });

        labelLayer.selectAll("text.battle-label")
            .data(valid)
            .enter()
            .append("text")
            .attr("class", "battle-label")
            .attr("x", b => b.__p[0] + 9)
            .attr("y", b => b.__p[1] - 8)
            .style("opacity", 0)
            .style("pointer-events", "none")
            .text(b => b.name);

        updateOverlay(currentTransform);
    })
    .catch(err => {
        console.error("Failed to load map data:", err);
    });

tooltip.on("click", (e) => {
    if (e.target.id === "tt-close") {
        activeBattle = null;
        tooltipSide = null;
        tooltip.style("display", "none");
    }
});

window.addEventListener("resize", () => {
    ({ width, height } = getSize());
    svg.attr("viewBox", `0 0 ${width} ${height}`);
    projection
        .scale(width / (2.1 * Math.PI))
        .translate([width / 2, height / 1.5]);
    g.selectAll("path.land").attr("d", path);
    g.selectAll("path.lake").attr("d", path);
    g.selectAll("path.river").attr("d", path);
    labelLayer.selectAll("text.country-label").each(d => { d.__lp = labelPoint(d); });
    CITIES.forEach(c => { c.__p = projection([c.lng, c.lat]); });
    labelLayer.selectAll("circle.battle").each(b => { b.__p = projection([b.lng, b.lat]); });
    labelLayer.selectAll("text.battle-label").each(b => { b.__p = projection([b.lng, b.lat]); });
    syncZoomBounds();
    updateOverlay(currentTransform);
});