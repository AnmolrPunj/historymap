const params = new URLSearchParams(window.location.search);
const battleId = params.get("id");
const content = document.getElementById("content");

function renderNotFound() {
    content.outerHTML = '<div id="not-found">Battle not found. <a href="../index.html" style="color:#e8e2d0">Return to the map</a>.</div>';
}

function renderBattle(summary, detail) {
    const dispatchHtml = `
        <ul class="dispatch">
            <li><span class="field-label">Commanders:</span> ${detail.commanders}</li>
            <li><span class="field-label">Forces:</span> ${detail.forces}</li>
            <li><span class="field-label">Casualties:</span> ${detail.casualties}</li>
            <li><span class="field-label">Outcome:</span> ${detail.outcome}</li>
        </ul>
    `;
    const paragraphsHtml = detail.paragraphs.map(p => `<p>${p}</p>`).join("");
    content.innerHTML = `
        <h1>${summary.name}</h1>
        <div class="dates">${summary.dates}</div>
        ${dispatchHtml}
        ${paragraphsHtml}
        <h2 class="significance-heading">Why it mattered</h2>
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