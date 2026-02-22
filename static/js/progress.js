const PROGRESS_KEY = "musonda_cybershield_progress";

function loadProgress() {
    try {
        const raw = localStorage.getItem(PROGRESS_KEY);
        if (!raw) return { viewedItems: 0, totalItems: 0, simulationDone: false };
        return JSON.parse(raw);
    } catch {
        return { viewedItems: 0, totalItems: 0, simulationDone: false };
    }
}

function saveProgress(p) {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
}

function updateProgressFromDOM() {
    const items = Array.from(document.querySelectorAll(".search-item"));
    const visible = items.filter(i => i.style.display !== "none");
    const total = items.length;

    const progress = loadProgress();
    progress.viewedItems = Math.max(progress.viewedItems, visible.length);
    progress.totalItems = total || progress.totalItems;
    saveProgress(progress);
    renderProgress(progress);
}

function updateProgressSimulationComplete() {
    const progress = loadProgress();
    progress.simulationDone = true;
    saveProgress(progress);
    renderProgress(progress);
}

function renderProgress(progress) {
    const bar = document.getElementById("progressBar");
    const text = document.getElementById("progressText");
    const achievements = document.getElementById("progressAchievements");
    if (!bar || !text || !achievements) return;

    const total = progress.totalItems || 1;
    const pct = Math.min(100, Math.round((progress.viewedItems / total) * 100));
    bar.style.width = pct + "%";
    text.textContent = `Progress: ${pct}%`;

    achievements.innerHTML = "";

    const addBadge = (label) => {
        const div = document.createElement("div");
        div.className = "achievement";
        div.textContent = label;
        achievements.appendChild(div);
    };

    if (pct >= 25) addBadge("Getting Started");
    if (pct >= 50) addBadge("Cyber Explorer");
    if (pct >= 80) addBadge("Shield Guardian");
    if (pct === 100) addBadge("Academy Completed");

    if (progress.simulationDone) {
        addBadge("Threat Simulation Completed");
    }
}

function initProgressTracking() {
    const progress = loadProgress();
    renderProgress(progress);

    const observer = new IntersectionObserver((entries) => {
        const p = loadProgress();
        let changed = false;
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = document.querySelectorAll(".search-item");
                const visible = Array.from(items).filter(i => i.style.display !== "none");
                const count = visible.length;
                if (count > p.viewedItems) {
                    p.viewedItems = count;
                    changed = true;
                }
                p.totalItems = items.length || p.totalItems;
            }
        });
        if (changed) {
            saveProgress(p);
            renderProgress(p);
        }
    }, { threshold: 0.2 });

    document.querySelectorAll(".section-card").forEach(sec => observer.observe(sec));
}