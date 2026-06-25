const vgUser = JSON.parse(localStorage.getItem("vg_user") || "null");
if (!vgUser) {
  window.location.href = "login.html";
}

document.getElementById("welcomeName").textContent = vgUser.fullName;
document.getElementById("userPill").textContent = vgUser.email;

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("vg_user");
  window.location.href = "login.html";
});

document.getElementById("newPredictionBtn").addEventListener("click", () => {
  window.location.href = "prediction.html";
});

function riskClass(level) {
  return (level || "").toLowerCase();
}

function renderStats(history) {
  const total = history.length;
  const high = history.filter(p => p.riskLevel === "High").length;
  const avg = total === 0 ? 0 : (history.reduce((s, p) => s + p.riskPercentage, 0) / total);

  document.getElementById("statTotal").textContent = total;
  document.getElementById("statHigh").textContent = high;
  document.getElementById("statAvg").textContent = `${avg.toFixed(1)}%`;
}

async function loadHistory() {
  const tbody = document.getElementById("historyBody");
  try {
    const res = await fetch(`${API_BASE_URL}/predictions/history/${vgUser.id}`);
    const data = await res.json();

    renderStats(data);
    tbody.innerHTML = "";

    if (data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="empty-row">No predictions yet. Start a new screening to see results here.</td></tr>`;
      return;
    }

    data.forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.patientName}</td>
        <td class="mono">${p.riskPercentage}%</td>
        <td><span class="badge badge-${riskClass(p.riskLevel)}">${p.riskLevel}</span></td>
        <td class="mono">${new Date(p.createdAt).toLocaleString()}</td>
        <td><button class="btn-small" data-id="${p.id}">View</button></td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll("button[data-id]").forEach(btn => {
      btn.addEventListener("click", () => {
        window.location.href = `result.html?id=${btn.getAttribute("data-id")}`;
      });
    });
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty-row">Unable to load history. Is the backend running?</td></tr>`;
  }
}

async function loadPatients() {
  const list = document.getElementById("patientList");
  try {
    const res = await fetch(`${API_BASE_URL}/patients/user/${vgUser.id}`);
    const data = await res.json();

    if (data.length === 0) {
      list.innerHTML = `<div class="empty-row">No patients added yet</div>`;
      return;
    }

    list.innerHTML = data.slice(0, 5).map(p => `
      <div class="detail-row">
        <span class="k">${p.name} &middot; ${p.age || "--"} yrs &middot; ${p.gender || "--"}</span>
        <span class="v">${p.bmi ? `BMI ${p.bmi}` : ""}</span>
      </div>
    `).join("");
  } catch (err) {
    list.innerHTML = `<div class="empty-row">Unable to load patients</div>`;
  }
}

loadHistory();
loadPatients();
