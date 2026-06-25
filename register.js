document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const errorBox = document.getElementById("errorBox");
  const submitBtn = document.getElementById("submitBtn");

  errorBox.textContent = "";

  if (password !== confirmPassword) {
    errorBox.textContent = "Passwords do not match";
    return;
  }
  if (password.length < 6) {
    errorBox.textContent = "Password must be at least 6 characters";
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Creating account...";

  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      errorBox.textContent = data.error || "Registration failed";
      submitBtn.disabled = false;
      submitBtn.textContent = "Create account";
      return;
    }

    window.location.href = "login.html?registered=1";
  } catch (err) {
    errorBox.textContent = "Unable to connect to the server. Is the backend running on port 8080?";
    submitBtn.disabled = false;
    submitBtn.textContent = "Create account";
  }
});
