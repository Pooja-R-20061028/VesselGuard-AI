const vgUser = JSON.parse(localStorage.getItem("vg_user") || "null");
if (!vgUser) {
  window.location.href = "login.html";
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("vg_user");
  window.location.href = "login.html";
});

const params = new URLSearchParams(window.location.search);
const predictionId = params.get("id");

const RING_RADIUS = 84;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const riskColors = {
  low: "#1C9456",
  medium: "#C8810B",
  high: "#D14444"
};

const riskNotes = {
  Low: "Vessel flow indicators are within a healthy range. Continue regular checkups and a heart-healthy lifestyle.",
  Medium: "Some indicators suggest moderate risk of vessel blockage. A clinical follow-up and further diagnostics are recommended.",
  High: "Multiple indicators suggest a high likelihood of vessel blockage. Please consult a cardiologist promptly for confirmatory testing."
};

let currentData = null;

function setRing(percentage, level) {
  const fill = document.getElementById("ringFill");
  const offset = RING_CIRCUMFERENCE * (1 - percentage / 100);
  fill.style.strokeDasharray = `${RING_CIRCUMFERENCE}`;
  fill.style.strokeDashoffset = `${RING_CIRCUMFERENCE}`;
  fill.style.stroke = riskColors[level.toLowerCase()] || riskColors.medium;

  requestAnimationFrame(() => {
    fill.style.strokeDashoffset = `${offset}`;
  });
}

function renderFactors(featureImportanceJson) {
  const list = document.getElementById("factorList");
  if (!list) return;

  let factors = [];
  try {
    factors = JSON.parse(featureImportanceJson || "[]");
  } catch (e) {
    factors = [];
  }

  if (!factors.length) {
    list.innerHTML = `<div class="empty-row">Factor breakdown not available for this prediction.</div>`;
    return;
  }

  const top = factors.slice(0, 6);
  const maxImportance = Math.max(...top.map(f => f.importance));

  list.innerHTML = top.map(f => `
    <div class="factor-row">
      <div class="factor-row-top">
        <span class="factor-name">${f.label}</span>
        <span class="factor-meta">value: ${f.value} &middot; weight: ${f.importance}%</span>
      </div>
      <div class="factor-track">
        <div class="factor-fill status-${f.status}" style="width: ${(f.importance / maxImportance) * 100}%;"></div>
      </div>
    </div>
  `).join("");

  return top;
}

function renderRecommendations(riskLevel, featureImportanceJson) {
  const list = document.getElementById("recoList");
  if (!list) return;

  let factors = [];
  try {
    factors = JSON.parse(featureImportanceJson || "[]");
  } catch (e) {
    factors = [];
  }

  const flagged = factors.filter(f => f.status === "high" || f.status === "watch");
  const recos = [];

  if (riskLevel === "High") {
    recos.push("Consult a cardiologist promptly for confirmatory diagnostic testing.");
    recos.push("Avoid strenuous physical activity until evaluated by a doctor.");
  } else if (riskLevel === "Medium") {
    recos.push("Schedule a follow-up consultation with a physician within the next few weeks.");
    recos.push("Consider additional diagnostic tests such as an ECG or lipid profile.");
  } else {
    recos.push("Maintain regular health checkups (at least once a year).");
    recos.push("Continue a heart-healthy lifestyle with balanced diet and regular exercise.");
  }

  const factorTips = {
    chol: "Reduce saturated fat intake and consider a cholesterol-lowering diet.",
    trestbps: "Monitor blood pressure regularly and reduce sodium intake.",
    thalach: "Build cardiovascular fitness gradually under medical supervision.",
    oldpeak: "Discuss ST depression findings with a cardiologist — may indicate ischemia.",
    exang: "Avoid intense exertion that triggers chest discomfort; seek evaluation.",
    fbs: "Monitor blood sugar levels and consider a diabetes screening.",
    ca: "Vessel imaging findings should be reviewed in detail with a specialist.",
    thal: "Discuss thalassemia/perfusion findings with your physician.",
    cp: "Report any chest pain patterns to your doctor immediately."
  };

  flagged.slice(0, 3).forEach(f => {
    if (factorTips[f.feature]) {
      recos.push(factorTips[f.feature]);
    }
  });

  recos.push("This is an AI-assisted screening tool, not a clinical diagnosis. Always confirm with a certified medical professional.");

  list.innerHTML = recos.map((r, i) => `
    <div class="reco-item">
      <span class="reco-icon">${i + 1}</span>
      <span>${r}</span>
    </div>
  `).join("");
}

async function loadResult() {
  const container = document.getElementById("resultContainer");

  if (!predictionId) {
    container.innerHTML = `<div class="card"><div class="card-head"><h3>No prediction selected</h3></div></div>`;
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/predictions/${predictionId}`);
    const data = await res.json();

    if (!res.ok) {
      container.innerHTML = `<div class="card"><div class="card-head"><h3>${data.error}</h3></div></div>`;
      return;
    }

    currentData = data;

    document.getElementById("patientName").textContent = data.patientName;
    document.getElementById("patientNameDetail").textContent = data.patientName;
    document.getElementById("ringPct").textContent = `${data.riskPercentage}%`;

    const levelBox = document.getElementById("riskLevel");
    levelBox.textContent = `${data.riskLevel} risk`;
    levelBox.className = `risk-level risk-${data.riskLevel.toLowerCase()}`;

    const bar = document.getElementById("riskBar");
    bar.style.width = "0%";
    bar.style.background = riskColors[data.riskLevel.toLowerCase()] || riskColors.medium;
    requestAnimationFrame(() => {
      bar.style.width = `${data.riskPercentage}%`;
    });

    document.getElementById("predictedAt").textContent = new Date(data.createdAt).toLocaleString();
    document.getElementById("predictionIdLabel").textContent = `#${data.id}`;
    document.getElementById("noteText").textContent = riskNotes[data.riskLevel] || "";

    setRing(data.riskPercentage, data.riskLevel);
    renderFactors(data.featureImportance);
    renderRecommendations(data.riskLevel, data.featureImportance);
  } catch (err) {
    container.innerHTML = `<div class="card"><div class="card-head"><h3>Unable to load result. Is the backend running?</h3></div></div>`;
  }
}

function downloadPdf() {
  if (!currentData) return;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let factors = [];
  try {
    factors = JSON.parse(currentData.featureImportance || "[]");
  } catch (e) {
    factors = [];
  }

  doc.setFontSize(18);
  doc.setTextColor(14, 110, 99);
  doc.text("VesselGuard AI - Risk Report", 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("AI-assisted blood vessel blockage risk screening", 14, 27);
  doc.line(14, 31, 196, 31);

  doc.setFontSize(11);
  doc.setTextColor(20, 20, 20);
  doc.text(`Patient: ${currentData.patientName}`, 14, 41);
  doc.text(`Prediction ID: #${currentData.id}`, 14, 48);
  doc.text(`Date: ${new Date(currentData.createdAt).toLocaleString()}`, 14, 55);

  doc.setFontSize(14);
  doc.setTextColor(14, 110, 99);
  doc.text(`Risk Percentage: ${currentData.riskPercentage}%`, 14, 68);
  doc.text(`Risk Level: ${currentData.riskLevel}`, 14, 76);

  doc.setFontSize(12);
  doc.setTextColor(20, 20, 20);
  doc.text("Top Contributing Factors:", 14, 90);

  doc.setFontSize(10);
  let y = 98;
  factors.slice(0, 8).forEach(f => {
    doc.text(`- ${f.label}: value ${f.value}, weight ${f.importance}%, status ${f.status}`, 16, y);
    y += 7;
  });

  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(
    "Disclaimer: This is an AI-assisted screening tool and not a substitute for professional medical diagnosis (e.g. angiography).",
    14, y + 10, { maxWidth: 180 }
  );

  doc.save(`VesselGuard_Report_${currentData.patientName.replace(/\s+/g, "_")}_${currentData.id}.pdf`);
}

const pdfBtn = document.getElementById("downloadPdfBtn");
if (pdfBtn) {
  pdfBtn.addEventListener("click", downloadPdf);
}

loadResult();
