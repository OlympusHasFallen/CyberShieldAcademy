function initPDFExport() {
    const btn = document.getElementById("pdfExport");
    if (!btn) return;
    btn.addEventListener("click", () => {
        window.print();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initPDFExport();
});