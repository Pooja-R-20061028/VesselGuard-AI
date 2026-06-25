if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {
      // Service worker registration silently fails on file:// — that's expected.
    });
  });
}

let deferredInstallPrompt = null;

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;

  const btn = document.getElementById("installAppBtn");
  if (btn) {
    btn.style.display = "inline-flex";
  }
});

function setupInstallButton() {
  const btn = document.getElementById("installAppBtn");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    btn.style.display = "none";
  });
}

window.addEventListener("appinstalled", () => {
  const btn = document.getElementById("installAppBtn");
  if (btn) btn.style.display = "none";
  deferredInstallPrompt = null;
});

document.addEventListener("DOMContentLoaded", setupInstallButton);
