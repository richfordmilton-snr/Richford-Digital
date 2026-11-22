/* Update the contact details below before publishing. */
const SITE_CONFIG = {
  email: "richfordmilton@gmail.com",
  whatsappNumber: "233557545740", // Ghana country code + number, no + or spaces
  displayName: "Richford"
};

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");
  const navLinks = [...document.querySelectorAll(".nav-link")];

  // Theme toggle with a remembered preference (browser-local).
  const savedTheme = localStorage.getItem("richford-theme");
  if (savedTheme === "light") body.classList.add("light");
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("light");
    localStorage.setItem("richford-theme", body.classList.contains("light") ? "light" : "dark");
  });

  // Mobile navigation.
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });
  navLinks.forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }));

  // Highlight the section currently in view.
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  document.querySelectorAll("main section[id]").forEach(section => sectionObserver.observe(section));

  // Reveal content as it enters the viewport.
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

  // Contact links are generated from the configuration above.
  const emailLink = document.getElementById("emailLink");
  const gmailLink = document.getElementById("gmailLink");
  const copyEmailButton = document.getElementById("copyEmailButton");
  const contactFeedback = document.getElementById("contactFeedback");
  const whatsappLink = document.getElementById("whatsappLink");
  emailLink.href = `mailto:${SITE_CONFIG.email}`;
  gmailLink.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(SITE_CONFIG.email)}`;
  whatsappLink.href = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent("Hello Richford, I visited your portfolio and would like to connect.")}`;

  // Email fallbacks for devices without a configured mail app.
  copyEmailButton.addEventListener("click", async () => {
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(SITE_CONFIG.email);
        copied = true;
      }
    } catch (_) {}
    if (!copied) {
      const helper = document.createElement("textarea");
      helper.value = SITE_CONFIG.email;
      helper.setAttribute("readonly", "");
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.appendChild(helper);
      helper.select();
      try { copied = document.execCommand("copy"); } catch (_) {}
      helper.remove();
    }
    contactFeedback.textContent = copied ? "Email address copied: " + SITE_CONFIG.email : "Please copy this email: " + SITE_CONFIG.email;
  });

  // Contact project links prefill a message.
  document.querySelectorAll("[data-project]").forEach(link => {
    link.addEventListener("click", () => {
      const project = link.dataset.project;
      emailLink.href = `mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent("Enquiry about " + project)}`;
    });
  });

  // AI assistant: connect to a secure backend. Keep API keys server-side only.
  // After deploying the backend, paste its public /chat endpoint below.
  const AI_BACKEND_URL = "https://richford-ai-assistant.richfordmilton.workers.dev";

  const launcher = document.getElementById("chatLauncher");
  const panel = document.getElementById("chatPanel");
  const close = document.getElementById("chatClose");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  const messages = document.getElementById("chatMessages");
  const sendButton = form.querySelector("button[type='submit']");
  const chatHistory = [];
  const maxHistory = 10; // 5 recent user/assistant exchanges

  function setChatOpen(open) {
    panel.hidden = !open;
    launcher.setAttribute("aria-expanded", String(open));
    if (open) input.focus();
  }
  launcher.addEventListener("click", () => setChatOpen(panel.hidden));
  close.addEventListener("click", () => setChatOpen(false));

  function addMessage(text, role) {
    const bubble = document.createElement("div");
    bubble.className = `chat-message ${role}`;
    bubble.textContent = text; // Never interpret model/user text as HTML.
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
    return bubble;
  }

  function setBusy(busy) {
    input.disabled = busy;
    sendButton.disabled = busy;
    sendButton.textContent = busy ? "…" : "➜";
    sendButton.setAttribute("aria-label", busy ? "Waiting for assistant" : "Send message");
  }

  async function sendQuestion(question) {
    const clean = String(question || "").trim();
    if (!clean || input.disabled) return;
    addMessage(clean, "user");
    input.value = "";

    if (!AI_BACKEND_URL.trim()) {
      addMessage("The AI connection isn't configured yet. The secure backend must be deployed and its /chat URL added to script.js first.", "bot");
      return;
    }

    setBusy(true);
    const waiting = addMessage("Thinking…", "bot");
    const priorMessages = chatHistory.slice(-maxHistory);
    try {
      const response = await fetch(AI_BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: clean, history: priorMessages })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
      const answer = typeof data.reply === "string" ? data.reply.trim() : "";
      if (!answer) throw new Error("The assistant returned an empty response.");
      waiting.textContent = answer;
      chatHistory.push({ role: "user", content: clean }, { role: "assistant", content: answer });
      if (chatHistory.length > maxHistory) chatHistory.splice(0, chatHistory.length - maxHistory);
    } catch (error) {
      waiting.textContent = `I couldn't reach the AI assistant. ${error.message || "Please try again."}`;
    } finally {
      setBusy(false);
      input.focus();
      messages.scrollTop = messages.scrollHeight;
    }
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    sendQuestion(input.value);
  });
  document.querySelectorAll(".chat-suggestions button").forEach(button => {
    button.addEventListener("click", () => sendQuestion(button.dataset.question));
  });
});
