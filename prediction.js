const vgUser = JSON.parse(localStorage.getItem("vg_user") || "null");
if (!vgUser) {
  window.location.href = "login.html";
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("vg_user");
  window.location.href = "login.html";
});

function updateBmiPreview() {
  const heightEl = document.getElementById("height");
  const weightEl = document.getElementById("weight");
  const preview = document.getElementById("bmiPreview");

  const height = parseFloat(heightEl.value);
  const weight = parseFloat(weightEl.value);

  if (!height || !weight || height <= 0) {
    preview.textContent = "—";
    preview.className = "bmi-preview";
    return;
  }

  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  const bmiRounded = bmi.toFixed(1);

  let category = "Normal";
  let cls = "bmi-normal";
  if (bmi < 18.5) {
    category = "Underweight";
    cls = "bmi-watch";
  } else if (bmi >= 25 && bmi < 30) {
    category = "Overweight";
    cls = "bmi-watch";
  } else if (bmi >= 30) {
    category = "Obese";
    cls = "bmi-high";
  }

  preview.textContent = `${bmiRounded} · ${category}`;
  preview.className = `bmi-preview ${cls}`;
}

document.getElementById("height").addEventListener("input", updateBmiPreview);
document.getElementById("weight").addEventListener("input", updateBmiPreview);

document.getElementById("predictionForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const errorBox = document.getElementById("errorBox");
  const submitBtn = document.getElementById("submitBtn");
  errorBox.textContent = "";
  submitBtn.disabled = true;
  submitBtn.textContent = "Analyzing vessel risk...";

  const payload = {
    userId: vgUser.id,
    name: document.getElementById("name").value.trim(),
    age: parseInt(document.getElementById("age").value, 10),
    gender: document.getElementById("gender").value,
    contact: document.getElementById("contact").value.trim(),
    height: parseFloat(document.getElementById("height").value),
    weight: parseFloat(document.getElementById("weight").value),
    cp: parseInt(document.getElementById("cp").value, 10),
    trestbps: parseInt(document.getElementById("trestbps").value, 10),
    chol: parseInt(document.getElementById("chol").value, 10),
    fbs: parseInt(document.getElementById("fbs").value, 10),
    restecg: parseInt(document.getElementById("restecg").value, 10),
    thalach: parseInt(document.getElementById("thalach").value, 10),
    exang: parseInt(document.getElementById("exang").value, 10),
    oldpeak: parseFloat(document.getElementById("oldpeak").value),
    slope: parseInt(document.getElementById("slope").value, 10),
    ca: parseInt(document.getElementById("ca").value, 10),
    thal: parseInt(document.getElementById("thal").value, 10)
  };

  function resetBtn() {
    submitBtn.disabled = false;
    submitBtn.textContent = "Analyze risk";
  }

  try {
    const patientRes = await fetch(`${API_BASE_URL}/patients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const patient = await patientRes.json();

    if (!patientRes.ok) {
      errorBox.textContent = patient.error || "Failed to save patient details";
      resetBtn();
      return;
    }

    const predictionRes = await fetch(`${API_BASE_URL}/predictions/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId: patient.id, userId: vgUser.id })
    });
    const prediction = await predictionRes.json();

    if (!predictionRes.ok) {
      errorBox.textContent = prediction.error || "Prediction failed";
      resetBtn();
      return;
    }

    window.location.href = `result.html?id=${prediction.id}`;
  } catch (err) {
    errorBox.textContent = "Unable to connect to the server. Check that the backend and ML service are running.";
    resetBtn();
  }
});
