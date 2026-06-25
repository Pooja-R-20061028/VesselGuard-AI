const vgUser = JSON.parse(localStorage.getItem("vg_user") || "null");
if (!vgUser) {
  window.location.href = "login.html";
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("vg_user");
  window.location.href = "login.html";
});

const riskColorMap = {
  Low: "#1C9456",
  Medium: "#C8810B",
  High: "#D14444"
};

function renderStats(history) {
  const total = history.length;
  const high = history.filter(p => p.riskLevel === "High").length;
  const avg = total === 0 ? 0 : (history.reduce((s, p) => s + p.riskPercentage, 0) / total);

  document.getElementById("statTotal").textContent = total;
  document.getElementById("statHigh").textContent = high;
  document.getElementById("statAvg").textContent = `${avg.toFixed(1)}%`;
}

function renderRiskDistribution(history) {
  const counts = { Low: 0, Medium: 0, High: 0 };
  history.forEach(p => {
    if (counts[p.riskLevel] !== undefined) counts[p.riskLevel]++;
  });

  new Chart(document.getElementById("riskDistChart"), {
    type: "doughnut",
    data: {
      labels: ["Low", "Medium", "High"],
      datasets: [{
        data: [counts.Low, counts.Medium, counts.High],
        backgroundColor: [riskColorMap.Low, riskColorMap.Medium, riskColorMap.High],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom", labels: { font: { family: "Inter", size: 12 } } }
      }
    }
  });
}

function renderRiskTrend(history) {
  const sorted = [...history].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const labels = sorted.map(p => new Date(p.createdAt).toLocaleDateString());
  const values = sorted.map(p => p.riskPercentage);

  new Chart(document.getElementById("riskTrendChart"), {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Risk %",
        data: values,
        borderColor: "#0E6E63",
        backgroundColor: "rgba(14, 110, 99, 0.1)",
        fill: true,
        tension: 0.35,
        pointBackgroundColor: "#0E6E63"
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, max: 100, ticks: { callback: v => `${v}%` } }
      }
    }
  });
}

function renderMonthly(history) {
  const monthCounts = {};
  history.forEach(p => {
    const d = new Date(p.createdAt);
    const key = `${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()}`;
    monthCounts[key] = (monthCounts[key] || 0) + 1;
  });

  const labels = Object.keys(monthCounts);
  const values = Object.values(monthCounts);

  new Chart(document.getElementById("monthlyChart"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Screenings",
        data: values,
        backgroundColor: "#1F8A99",
        borderRadius: 6,
        maxBarThickness: 36
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
    }
  });
}

async function loadAnalytics() {
  try {
    const res = await fetch(`${API_BASE_URL}/predictions/history/${vgUser.id}`);
    const history = await res.json();

    if (!history.length) {
      document.getElementById("emptyState").style.display = "block";
      return;
    }

    renderStats(history);
    renderRiskDistribution(history);
    renderRiskTrend(history);
    renderMonthly(history);
  } catch (err) {
    document.getElementById("emptyState").textContent = "Unable to load analytics. Is the backend running?";
    document.getElementById("emptyState").style.display = "block";
  }
}

loadAnalytics();
