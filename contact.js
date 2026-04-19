document.addEventListener("DOMContentLoaded", () => {
  const form   = document.querySelector(".contact-form");
  const status = document.getElementById("form-status");
  const btn    = form.querySelector("button[type='submit']");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      from_name:  document.getElementById("name").value.trim(),
      from_email: document.getElementById("email").value.trim(),
      phone:      document.getElementById("phone").value.trim() || "Not provided",
      subject:    document.getElementById("subject").value,
      message:    document.getElementById("message").value.trim(),
    };

    // Basic validation
    if (!payload.from_name || !payload.from_email || !payload.subject || !payload.message) {
      status.style.color = "red";
      status.textContent = "⚠️ Please fill in all required fields.";
      return;
    }

    btn.disabled       = true;
    btn.textContent    = "Sending...";
    status.textContent = "";

    try {
      await emailjs.send("service_fj03rrj", "template_wv97y3p", payload);

      status.style.color = "green";
      status.textContent = "✅ Message sent! We'll get back to you shortly.";
      form.reset();

    } catch (err) {
      console.error(err);
      status.style.color = "red";
      status.textContent = "❌ Something went wrong. Please try again.";

    } finally {
      btn.disabled    = false;
      btn.textContent = "Send Message";
    }
  });
});