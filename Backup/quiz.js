// ---------------------------------------------------------
// Load quiz data from content.json
// ---------------------------------------------------------
async function loadQuizData() {
  const res = await fetch("content.json");
  return await res.json().then(d => d.quizzes);
}

// ---------------------------------------------------------
// Utility: Random subset
// ---------------------------------------------------------
function getRandomSubset(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, arr.length));
}

// ---------------------------------------------------------
// Utility: Badge generator
// ---------------------------------------------------------
function makeBadge(text) {
  const div = document.createElement("div");
  div.className = "achievement";
  div.textContent = text;
  return div;
}

// ---------------------------------------------------------
// Render Quiz UI
// ---------------------------------------------------------
function renderQuiz(questions, containerId, resultId, mode = "quiz") {
  const container = document.getElementById(containerId);
  const result = document.getElementById(resultId);

  container.innerHTML = "";
  result.innerHTML = "";

  const form = document.createElement("form");

  questions.forEach((q, idx) => {
    const block = document.createElement("div");
    block.className = "quiz-question";

    const title = document.createElement("p");
    title.textContent = `${idx + 1}. ${q.question}`;
    block.appendChild(title);

    q.options.forEach((opt, oIdx) => {
      const label = document.createElement("label");
      label.style.display = "block";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `q${idx}`;
      input.value = oIdx;

      label.appendChild(input);
      label.appendChild(document.createTextNode(" " + opt));
      block.appendChild(label);
    });

    form.appendChild(block);
  });

  const submit = document.createElement("button");
  submit.type = "submit";
  submit.className = "primary-btn";
  submit.textContent = "Submit Answers";
  form.appendChild(submit);

  container.appendChild(form);

  // ---------------------------------------------------------
  // SUBMIT HANDLER (Upgraded)
  // ---------------------------------------------------------
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let score = 0;

    questions.forEach((q, idx) => {
      const selected = form.querySelector(`input[name="q${idx}"]:checked`);
      const options = form.querySelectorAll(`input[name="q${idx}"]`);

      options.forEach((opt, oIdx) => {
        const label = opt.parentElement;

        // Reset styles
        label.style.color = "";
        label.style.fontWeight = "";

        // Highlight correct answer
        if (oIdx === q.answerIndex) {
          label.style.color = "var(--success)";
          label.style.fontWeight = "600";
        }

        // Highlight wrong selected answer
        if (selected && parseInt(selected.value, 10) === oIdx && oIdx !== q.answerIndex) {
          label.style.color = "var(--danger)";
          label.style.fontWeight = "600";
        }
      });

      if (selected && parseInt(selected.value, 10) === q.answerIndex) {
        score++;
      }
    });

    const total = questions.length;
    const pct = Math.round((score / total) * 100);

    result.innerHTML = "";
    const badge = document.createElement("div");
    badge.className = "achievement";
    badge.textContent = `Score: ${score}/${total} (${pct}%)`;
    result.appendChild(badge);

    // Certification mode
    if (mode === "cert") {
      handleCertificationResult(pct, result);
      return;
    }

    // Normal quiz mode
    if (pct >= 70) {
      result.appendChild(makeBadge("Nice work! You're ready to move up."));
    } else {
      result.appendChild(makeBadge("Review the content and try again."));
    }
  });
}

// ---------------------------------------------------------
// Certification Result Handler
// ---------------------------------------------------------
function handleCertificationResult(pct, resultContainer) {
  const PASS_THRESHOLD = 75;

  if (pct >= PASS_THRESHOLD) {
    const pass = makeBadge("🎉 Certification Passed! You can print your certificate below.");
    resultContainer.appendChild(pass);

    const printBtn = document.createElement("button");
    printBtn.textContent = "Print Certificate";
    printBtn.className = "primary-btn";
    printBtn.style.marginTop = "10px";

    printBtn.addEventListener("click", () => {
      openCertificateWindow(pct);
    });

    resultContainer.appendChild(printBtn);

  } else {
    const fail = makeBadge("❌ Certification not passed. Aim for at least 75%.");
    resultContainer.appendChild(fail);
  }
}

// ---------------------------------------------------------
// Certificate Generator
// ---------------------------------------------------------
function openCertificateWindow(scorePct) {
  const win = window.open("", "_blank");

  win.document.write(`
    <html>
    <head>
      <title>CyberShield Academy Certificate</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 40px;
        }
        .cert-container {
          border: 4px solid #444;
          padding: 40px;
          max-width: 700px;
          margin: auto;
        }
        h1 {
          font-size: 32px;
          margin-bottom: 10px;
        }
        h2 {
          margin-top: 0;
          font-size: 20px;
          color: #666;
        }
        .name {
          font-size: 26px;
          margin: 20px 0;
          font-weight: bold;
        }
        .score {
          margin-top: 10px;
          font-size: 18px;
        }
        .footer {
          margin-top: 40px;
          font-size: 14px;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="cert-container">
        <h1>Certificate of Completion</h1>
        <h2>Musonda’s CyberShield Academy</h2>

        <div class="name">${localStorage.getItem("username") || "Student"}</div>

        <p>has successfully passed the Cybersecurity Fundamentals Certification Exam.</p>

        <div class="score">Final Score: ${scorePct}%</div>

        <div class="footer">Issued on ${new Date().toLocaleDateString()}</div>
      </div>

      <script>
        window.print();
      </script>
    </body>
    </html>
  `);

  win.document.close();
}

// ---------------------------------------------------------
// INITIALIZER — Wires up buttons and loads data
// ---------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  const data = await loadQuizData();

  // Start Quiz button
  const quizBtn = document.getElementById("quizStart");
  if (quizBtn) {
    quizBtn.addEventListener("click", () => {
      const topic = document.getElementById("quizTopicSelect").value;
      const diff = document.getElementById("quizDifficulty").value;

      const pool = data[topic] || [];
      let filtered = pool;

      if (diff !== "All") {
        filtered = pool.filter(q => q.difficulty === diff);
      }

      const selected = getRandomSubset(filtered, 5);
      renderQuiz(selected, "quizContainer", "quizResult", "quiz");
    });
  }

  // Certification Exam button
  const certBtn = document.getElementById("certStart");
  if (certBtn) {
    certBtn.addEventListener("click", () => {
      const pool = data.finalExam || [];
      const selected = getRandomSubset(pool, 20);
      renderQuiz(selected, "certContainer", "certResult", "cert");
    });
  }
});