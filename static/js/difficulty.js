function initDifficultyFilter() {
    const buttons = document.querySelectorAll(".diff-btn");
    const items = document.querySelectorAll(".search-item");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const selected = btn.dataset.diff;
            items.forEach(item => {
                const diff = item.dataset.difficulty || "Beginner";
                if (selected === "All" || diff === selected) {
                    item.style.display = "";
                } else {
                    item.style.display = "none";
                }
            });

            updateProgressFromDOM();
        });
    });
}