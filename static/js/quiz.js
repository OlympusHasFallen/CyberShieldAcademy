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
      logCertificateIssue(pct);
    });

    resultContainer.appendChild(printBtn);

  } else {
    const fail = makeBadge("❌ Certification not passed. Aim for at least 75%.");
    resultContainer.appendChild(fail);
  }
}
// ---------------------------------------------------------
// Certificate Logging (for registry)
// ---------------------------------------------------------
function logCertificateIssue(scorePct) {
  const name = localStorage.getItem("username") || "Student";
  const dateStr = new Date().toISOString();
  const certId = "CSA-" + new Date().getFullYear() + "-" +
    Math.random().toString(16).substring(2, 10).toUpperCase();

  const entry = { name, score: scorePct, date: dateStr, certId };

  const existing = JSON.parse(localStorage.getItem("cert_registry") || "[]");
  existing.push(entry);
  localStorage.setItem("cert_registry", JSON.stringify(existing));

  // Optional: show in console for now
  console.log("Certificate logged:", entry);
}

// ---------------------------------------------------------
// Certificate Generator
// ---------------------------------------------------------
function openCertificateWindow(scorePct) {
  const name = localStorage.getItem("username") || "Student";
  const dateStr = new Date().toLocaleDateString();
  const certId = "CSA-" + new Date().getFullYear() + "-" +
    Math.random().toString(16).substring(2, 10).toUpperCase();

  const payload = JSON.stringify({
    name,
    score: scorePct,
    date: dateStr,
    certId
  });

  const win = window.open("", "_blank");

  win.document.write(`
    <html>
    <head>
      <title>CyberShield Academy Certificate</title>
      <style>
        @page {
          size: A4;
          margin: 20mm;
        }

        body {
          margin: 0;
          padding: 0;
          background: #05060a;
          color: #f2f2f2;
          font-family: 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .cert-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cert-container {
          position: relative;
          max-width: 900px;
          width: 100%;
          padding: 40px 60px;
          background: radial-gradient(circle at top, #151824 0, #05060a 55%, #020308 100%);
          box-shadow: 0 0 40px rgba(0,0,0,0.8);
          border-radius: 18px;
          overflow: hidden;
        }

        .cert-container::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 3px;
          border-radius: 18px;
          background:
            repeating-linear-gradient(45deg,
              #d4af37 0,
              #f7e27c 4px,
              #b8860b 8px,
              #f7e27c 12px);
          -webkit-mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
        }

        .inner {
          position: relative;
          z-index: 1;
          text-align: center;
        }

        .logo {
          width: 80px;
          margin-bottom: 10px;
          filter: drop-shadow(0 0 6px rgba(0,0,0,0.7));
        }

        .title {
          font-size: 32px;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin: 5px 0;
          background: linear-gradient(90deg, #f7e27c, #d4af37, #f7e27c);
          -webkit-background-clip: text;
          color: transparent;
        }

        .subtitle {
          font-size: 16px;
          color: #c0c4d8;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 30px;
        }

        .name {
          font-size: 28px;
          font-weight: 600;
          margin: 20px 0 10px;
          color: #ffffff;
        }

        .statement {
          font-size: 16px;
          color: #d0d3e5;
          margin-bottom: 10px;
        }

        .role {
          font-size: 15px;
          margin-bottom: 25px;
          color: #f7e27c;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .score {
          font-size: 18px;
          margin-top: 10px;
          color: #e5e7f5;
        }

        .meta-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: 40px;
          gap: 20px;
          flex-wrap: wrap;
        }

        .meta-left, .meta-right {
          flex: 1;
          min-width: 220px;
        }

        .signature-block {
          text-align: left;
        }

        .sig-line {
          width: 220px;
          border-bottom: 2px solid #f7e27c;
          margin-bottom: 6px;
        }

        .sig-label {
          font-size: 13px;
          color: #c0c4d8;
        }

        .sig-digital {
          font-family: "Consolas", "Fira Code", monospace;
          font-size: 16px;
          color: #f7e27c;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }

        .cert-id {
          font-size: 13px;
          color: #a5aac7;
          margin-top: 8px;
        }

        .date {
          font-size: 14px;
          color: #c0c4d8;
        }

        .seal {
          position: relative;
          width: 130px;
          height: 130px;
          margin: 0 auto;
          border-radius: 50%;
          background:
            radial-gradient(circle at 30% 30%, #ffffff33, transparent 60%),
            conic-gradient(from 0deg,
              #f7e27c,
              #d4af37,
              #b8860b,
              #f7e27c,
              #d4af37);
          box-shadow: 0 0 18px rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .seal-inner {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: #05060a;
          border: 3px solid #f7e27c;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .seal-inner::before {
          content: "CERTIFIED";
          position: absolute;
          top: 8px;
          width: 100%;
          text-align: center;
          font-size: 9px;
          letter-spacing: 2px;
          color: #f7e27c;
        }

        .seal-inner::after {
          content: "CYBERSHIELD PRACTITIONER";
          position: absolute;
          bottom: 8px;
          width: 100%;
          text-align: center;
          font-size: 7px;
          letter-spacing: 1px;
          color: #f7e27c;
        }

        .seal-logo {
          width: 40px;
          filter: drop-shadow(0 0 4px rgba(0,0,0,0.8));
        }

        .qr-block {
          text-align: right;
        }

        #qrcode {
          display: inline-block;
          padding: 6px;
          background: #11131b;
          border-radius: 8px;
        }

        .qr-label {
          font-size: 11px;
          color: #a5aac7;
          margin-top: 4px;
        }

        @media print {
          body {
            background: #05060a;
          }
          .cert-container {
            box-shadow: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="cert-wrapper">
        <div class="cert-container">
          <div class="inner">
            <img src="static/img/logo.png" class="logo" alt="CyberShield Logo">

            <div class="title">Certificate of Completion</div>
            <div class="subtitle">Musonda’s CyberShield Academy</div>

            <div class="name">${name}</div>
            <div class="statement">
              has successfully passed the Cybersecurity Fundamentals Certification Exam.
            </div>
            <div class="role">Certified CyberShield Practitioner</div>

            <div class="score">Final Score: ${scorePct}%</div>

            <div style="margin: 30px 0;">
              <div class="seal">
                <div class="seal-inner">
                  <img src="static/img/logo.png" class="seal-logo" alt="Seal">
                </div>
              </div>
            </div>

            <div class="meta-row">
              <div class="meta-left">
                <div class="signature-block">
                  <div class="sig-digital">/ / M. CYBERSHIELD //</div>
                  <div class="sig-line"></div>
                  <div class="sig-label">Director, Musonda’s CyberShield Academy</div>
                  <div class="cert-id">Certificate ID: ${certId}</div>
                </div>
              </div>

              <div class="meta-right qr-block">
                <div id="qrcode"></div>
                <div class="qr-label">Scan to verify certificate details</div>
                <div class="date">Issued on ${dateStr}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <script>
        (function() {
          function QR8bitByte(data){this.mode=1;this.data=data;}
          QR8bitByte.prototype={getLength:function(){return this.data.length},write:function(buf){for(var i=0;i<this.data.length;i++)buf.put(this.data.charCodeAt(i),8)}};
          var QRUtil={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34]],getPatternPosition:function(t){return this.PATTERN_POSITION_TABLE[t-1]||[6,18,30]},getErrorCorrectPolynomial:function(){return{getAt:function(){return 0}}}};
          function QRCodeModel(typeNumber,errorCorrectLevel){this.typeNumber=typeNumber;this.errorCorrectLevel=errorCorrectLevel;this.modules=null;this.moduleCount=0;this.dataList=[];}
          QRCodeModel.prototype={addData:function(data){this.dataList.push(new QR8bitByte(data))},isDark:function(row,col){return this.modules[row][col]},getModuleCount:function(){return this.moduleCount},make:function(){this.moduleCount=21;this.modules=new Array(this.moduleCount);for(var r=0;r<this.moduleCount;r++){this.modules[r]=new Array(this.moduleCount);for(var c=0;c<this.moduleCount;c++)this.modules[r][c]=((r+c)%3)==0}},createTableTag:function(cellSize,margin){cellSize=cellSize||2;margin=margin||0;var qrHtml='<table style="border-collapse:collapse;background:#fff;padding:'+margin+'px;"><tbody>';for(var r=0;r<this.getModuleCount();r++){qrHtml+='<tr>';for(var c=0;c<this.getModuleCount();c++){qrHtml+='<td style="width:'+cellSize+'px;height:'+cellSize+'px;background:'+(this.isDark(r,c)?'#000':'#fff')+'"></td>'}qrHtml+='</tr>'}qrHtml+='</tbody></table>';return qrHtml}};
          window.QRCode=function(el,opts){opts=opts||{};var qr=new QRCodeModel(1,1);qr.addData(opts.text||"");qr.make();el.innerHTML=qr.createTableTag(3,2);}
        })();
      </script>
    </body>
    </html>
  `);

  win.document.close();

  win.onload = () => {
    const waitForQR = setInterval(() => {
      if (win.QRCode && win.document.getElementById("qrcode")) {
        clearInterval(waitForQR);
        new win.QRCode(win.document.getElementById("qrcode"), { text: payload });
        win.print();
      }
    }, 50);
  };
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
  // Certification Exam button
const certBtn = document.getElementById("certStart");
if (certBtn) {
  certBtn.addEventListener("click", () => {
    const modal = document.getElementById("nameModal");
    const input = document.getElementById("fullNameInput");
    const cancel = document.getElementById("nameCancel");
    const confirm = document.getElementById("nameConfirm");

    input.value = localStorage.getItem("username") || "";

    modal.style.display = "flex";

    const closeModal = () => {
      modal.style.display = "none";
    };

    cancel.onclick = () => closeModal();

    confirm.onclick = () => {
      const val = input.value.trim();
      if (!val) {
        alert("Please enter your full name.");
        return;
      }
      localStorage.setItem("username", val);
      closeModal();

      const pool = data.finalExam || [];
      const selected = getRandomSubset(pool, 20);
      renderQuiz(selected, "certContainer", "certResult", "cert");
    };
  });
}
  
});