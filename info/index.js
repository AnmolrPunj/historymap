const params = new URLSearchParams(window.location.search);
const battleId = params.get("id");
const content = document.getElementById("content");

function renderNotFound() {
    content.outerHTML = '<div id="not-found">Battle not found. <a href="../index.html" style="color:#e8e2d0">Return to the map</a>.</div>';
}

function renderBattle(summary, detail) {
    const factsHtml = `
        <div class="facts">
            <div><span class="label">Commanders</span>${detail.commanders}</div>
            <div><span class="label">Forces</span>${detail.forces}</div>
            <div><span class="label">Casualties</span>${detail.casualties}</div>
            <div><span class="label">Outcome</span>${detail.outcome}</div>
        </div>
    `;
    content.innerHTML = `
        <h1>${summary.name}</h1>
        <div class="dates">${summary.dates}</div>
        ${factsHtml}
        <p>${detail.narrative}</p>
        <p class="significance">${detail.significance}</p>
    `;
}

if (!battleId) {
    renderNotFound();
} else {
    Promise.all([
        fetch("../data.json").then(r => r.json()),
        fetch("../battles_detail.json").then(r => r.json())
    ]).then(([summaries, details]) => {
        const summary = summaries.find(b => b.id === battleId);
        const detail = details.find(b => b.id === battleId);
        if (!summary || !detail) {
            renderNotFound();
            return;
        }
        renderBattle(summary, detail);
        document.title = summary.name;
    }).catch(() => {
        renderNotFound();
    });
}