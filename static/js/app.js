async function loadContent() {
    const res = await fetch("content.json");
    const data = await res.json();

    document.getElementById("appTitle").textContent = data.appTitle;
    document.getElementById("heroTitle").textContent = data.appTitle;
    document.getElementById("tagline").textContent = data.tagline;

    const achievements = document.getElementById("achievements");
    data.achievements.forEach(a => {
        const div = document.createElement("div");
        div.className = "achievement";
        div.textContent = a;
        achievements.appendChild(div);
    });

    const attackList = document.getElementById("attackList");
    data.attackMethods.forEach(item => {
        const li = document.createElement("li");
        li.className = "search-item";
        li.dataset.difficulty = item.difficulty || "Beginner";
        li.innerHTML = `
            <div class="item-title">${item.name}</div>
            <div class="item-meta">
                ${item.description}
                ${item.mitre ? `<span class="pill mitre">MITRE: ${item.mitre}</span>` : ""}
                ${item.defense ? `<span class="pill defense">Defense: ${item.defense}</span>` : ""}
                ${item.risk ? `<span class="pill risk">${item.risk}</span>` : ""}
                <span class="pill">Difficulty: ${li.dataset.difficulty}</span>
            </div>
        `;
        attackList.appendChild(li);
    });

    const malwareList = document.getElementById("malwareList");
    data.malwareTypes.forEach(item => {
        const li = document.createElement("li");
        li.className = "search-item";
        li.dataset.difficulty = item.difficulty || "Beginner";
        li.innerHTML = `
            <div class="item-title">${item.name}</div>
            <div class="item-meta">
                ${item.description}
                ${item.defense ? `<span class="pill defense">Defense: ${item.defense}</span>` : ""}
                <span class="pill">Difficulty: ${li.dataset.difficulty}</span>
            </div>
        `;
        malwareList.appendChild(li);
    });

    const defFound = document.getElementById("defenseFoundational");
    data.defenseStrategies.foundational.forEach(item => {
        const li = document.createElement("li");
        li.className = "search-item";
        li.dataset.difficulty = item.difficulty || "Beginner";
        li.innerHTML = `<span class="item-title">${item.name}</span> — ${item.description}
            <span class="pill">Difficulty: ${li.dataset.difficulty}</span>`;
        defFound.appendChild(li);
    });

    const defDet = document.getElementById("defenseDetection");
    data.defenseStrategies.detection.forEach(item => {
        const li = document.createElement("li");
        li.className = "search-item";
        li.dataset.difficulty = item.difficulty || "Intermediate";
        li.innerHTML = `<span class="item-title">${item.name}</span> — ${item.description}
            <span class="pill">Difficulty: ${li.dataset.difficulty}</span>`;
        defDet.appendChild(li);
    });

    const irList = document.getElementById("irList");
    data.incidentResponse.forEach(item => {
        const li = document.createElement("li");
        li.className = "search-item";
        li.dataset.difficulty = item.difficulty || "Intermediate";
        li.innerHTML = `<span class="item-title">${item.name}</span> — ${item.description}
            <span class="pill">Difficulty: ${li.dataset.difficulty}</span>`;
        irList.appendChild(li);
    });

    const mitreList = document.getElementById("mitreList");
    data.mitreMapping.forEach(item => {
        const li = document.createElement("li");
        li.className = "search-item";
        li.dataset.difficulty = item.difficulty || "Intermediate";
        li.innerHTML = `<span class="item-title">${item.name}</span> → ${item.mapping}
            <span class="pill">Difficulty: ${li.dataset.difficulty}</span>`;
        mitreList.appendChild(li);
    });

    const toolsBlue = document.getElementById("toolsBlue");
    data.tools.blue.forEach(item => {
        const li = document.createElement("li");
        li.className = "search-item";
        li.dataset.difficulty = item.difficulty || "Beginner";
        li.innerHTML = `<span class="item-title">${item.name}</span> — ${item.description}
            <span class="pill">Difficulty: ${li.dataset.difficulty}</span>`;
        toolsBlue.appendChild(li);
    });

    const toolsRed = document.getElementById("toolsRed");
    data.tools.red.forEach(item => {
        const li = document.createElement("li");
        li.className = "search-item";
        li.dataset.difficulty = item.difficulty || "Advanced";
        li.innerHTML = `<span class="item-title">${item.name}</span> — ${item.description}
            <span class="pill">Difficulty: ${li.dataset.difficulty}</span>`;
        toolsRed.appendChild(li);
    });

    const glossaryLeft = document.getElementById("glossaryLeft");
    const glossaryRight = document.getElementById("glossaryRight");
    const mid = Math.ceil(data.glossary.length / 2);
    data.glossary.forEach((item, idx) => {
        const li = document.createElement("li");
        li.className = "search-item";
        li.dataset.difficulty = item.difficulty || "Beginner";
        li.innerHTML = `<span class="item-title">${item.term}</span> — ${item.definition}
            <span class="pill">Difficulty: ${li.dataset.difficulty}</span>`;
        if (idx < mid) glossaryLeft.appendChild(li);
        else glossaryRight.appendChild(li);
    });

  /* ------------------------------
   RESOURCES SECTION
------------------------------ */
const resourcesList = document.getElementById("resourcesList");

data.resources.forEach(item => {
    const li = document.createElement("li");
    li.className = "search-item";
    li.dataset.difficulty = "Beginner";

    // Create a clickable link
    li.innerHTML = `
        <a href="${item.url}" target="_blank" class="item-title">
            ${item.name}
        </a>
    `;

    resourcesList.appendChild(li);
});

    /* ------------------------------
   CLOUD SECURITY SECTION
------------------------------ */
const cloudList = document.getElementById("cloudList");
data.cloudSecurity.forEach(item => {
    const li = document.createElement("li");
    li.className = "search-item";
    li.dataset.difficulty = item.difficulty || "Beginner";
    li.innerHTML = `
        <span class="item-title">${item.name}</span> – ${item.description}
        <span class="pill">Difficulty: ${li.dataset.difficulty}</span>
    `;
    cloudList.appendChild(li);
});

/* ------------------------------
   NETWORK SECURITY SECTION
------------------------------ */
const networkList = document.getElementById("networkList");
data.networkSecurity.forEach(item => {
    const li = document.createElement("li");
    li.className = "search-item";
    li.dataset.difficulty = item.difficulty || "Beginner";
    li.innerHTML = `
        <span class="item-title">${item.name}</span> – ${item.description}
        <span class="pill">Difficulty: ${li.dataset.difficulty}</span>
    `;
    networkList.appendChild(li);
});

/* ------------------------------
   SOC OPERATIONS SECTION
------------------------------ */
const socList = document.getElementById("socList");
data.socOperations.forEach(item => {
    const li = document.createElement("li");
    li.className = "search-item";
    li.dataset.difficulty = item.difficulty || "Beginner";
    li.innerHTML = `
        <span class="item-title">${item.name}</span> – ${item.description}
        <span class="pill">Difficulty: ${li.dataset.difficulty}</span>
    `;
    socList.appendChild(li);
});

    initSearch();
    initNavHighlight();
    initCollapse();
    initTheme();
    initDifficultyFilter();
    initSimulation();
    initProgressTracking();
}

function initSearch() {
    const searchBox = document.getElementById("searchBox");
    const searchItems = document.querySelectorAll(".search-item");
    searchBox.addEventListener("input", () => {
        const q = searchBox.value.toLowerCase().trim();
        searchItems.forEach(item => {
            const text = item.innerText.toLowerCase();
            item.style.display = text.includes(q) ? "" : "none";
        });
        updateProgressFromDOM();
    });
}

function initNavHighlight() {
    const sections = document.querySelectorAll(".section-card");
    const navLinks = document.querySelectorAll(".nav-link");
    window.addEventListener("scroll", () => {
        let currentId = null;
        sections.forEach(sec => {
            const rect = sec.getBoundingClientRect();
            if (rect.top <= 120 && rect.bottom >= 120) {
                currentId = sec.id;
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle("active", link.getAttribute("data-target") === currentId);
        });
    });

    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            const targetId = link.getAttribute("data-target");
            const target = document.getElementById(targetId);
            if (target) {
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.scrollY - 80,
                    behavior: "smooth"
                });
            }
        });
    });
}

function initCollapse() {
    document.querySelectorAll(".section-header").forEach(header => {
        header.addEventListener("click", (e) => {
            if (e.target.tagName.toLowerCase() === "a") return;
            const bodyId = header.getAttribute("data-collapse");
            const body = document.getElementById(bodyId);
            if (body) body.classList.toggle("hidden");
        });
    });
}

function initTheme() {
    const themeToggle = document.getElementById("themeToggle");
    const bodyEl = document.body;
    let currentTheme = "dark";

    function setTheme(mode) {
        if (mode === "light") {
            bodyEl.classList.add("light");
            themeToggle.textContent = "☀️ Light";
        } else {
            bodyEl.classList.remove("light");
            themeToggle.textContent = "🌙 Dark";
        }
    }
    setTheme(currentTheme);
    themeToggle.addEventListener("click", () => {
        currentTheme = currentTheme === "dark" ? "light" : "dark";
        setTheme(currentTheme);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadContent();
});