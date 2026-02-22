function initSimulation() {
    const stepsContainer = document.getElementById("simulationSteps");
    const startBtn = document.getElementById("simulationStart");
    if (!stepsContainer || !startBtn) return;

    const steps = [
        {
            label: "Step 1: Phishing Email Sent",
            meta: "Attacker sends a crafted phishing email to the victim.",
            mitre: "Initial Access (T1566)",
            defense: "Email filtering, user awareness training."
        },
        {
            label: "Step 2: User Clicks Malicious Link",
            meta: "The victim clicks the link and visits a malicious site.",
            mitre: "Execution / Initial Access",
            defense: "URL filtering, browser isolation, DNS security."
        },
        {
            label: "Step 3: Malware Attempts Execution",
            meta: "Malware tries to run on the endpoint.",
            mitre: "Execution (T1204)",
            defense: "EDR, application control, least privilege."
        },
        {
            label: "Step 4: Detection & Alert",
            meta: "Security tools detect suspicious behavior and raise an alert.",
            mitre: "Detection / Monitoring",
            defense: "SIEM, SOC monitoring, alert triage."
        },
        {
            label: "Step 5: Incident Response",
            meta: "Defenders contain, eradicate, and recover.",
            mitre: "Containment, Eradication, Recovery",
            defense: "IR playbooks, backups, communication plans."
        }
    ];

    steps.forEach((s, idx) => {
        const div = document.createElement("div");
        div.className = "sim-step";
        div.dataset.index = idx;
        div.innerHTML = `
            <div class="label">${s.label}</div>
            <div class="meta">${s.meta}</div>
            <div class="meta"><strong>MITRE:</strong> ${s.mitre}</div>
            <div class="meta"><strong>Defense:</strong> ${s.defense}</div>
        `;
        stepsContainer.appendChild(div);
    });

    startBtn.addEventListener("click", () => {
        const allSteps = stepsContainer.querySelectorAll(".sim-step");
        let i = 0;
        allSteps.forEach(s => s.classList.remove("active"));
        const interval = setInterval(() => {
            if (i > 0) allSteps[i - 1].classList.remove("active");
            if (i >= allSteps.length) {
                clearInterval(interval);
                updateProgressSimulationComplete();
                return;
            }
            allSteps[i].classList.add("active");
            i++;
        }, 1200);
    });
}