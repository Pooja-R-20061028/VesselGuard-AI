document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const errorBox = document.getElementById("errorBox");
  const submitBtn = document.getElementById("submitBtn");

  errorBox.textContent = "";
  submitBtn.disabled = true;
  submitBtn.textContent = "Signing in...";

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      errorBox.textContent = data.error || "Login failed";
      submitBtn.disabled = false;
      submitBtn.textContent = "Sign in";
      return;
    }

    localStorage.setItem("vg_user", JSON.stringify(data));
    window.location.href = "dashboard.html";
  } catch (err) {
    errorBox.textContent = "Unable to connect to the server. Is the backend running on port 8080?";
    submitBtn.disabled = false;
    submitBtn.textContent = "Sign in";
  }
});
