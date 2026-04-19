document.querySelector(".vol-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const btn    = document.getElementById("submit");
  const status = document.getElementById("form-status");

  const payload = {
    to_name:      document.getElementById("name").value.trim(),
    to_email:     document.getElementById("email").value.trim(),
    phone:        document.getElementById("phone").value.trim(),
    skills:       document.getElementById("skills").value.trim() || "Not provided",
    availability: document.getElementById("availability").value,
    message:      document.getElementById("message").value.trim() || "No message",
  };

  btn.disabled    = true;
  btn.textContent = "Submitting...";

  try {
    await emailjs.send("service_62k1vzd", "template_z3dg8yj", payload);

    status.style.color = "green";
    status.textContent = "✅ Application submitted! Check your email for confirmation.";
    document.querySelector(".vol-form").reset();

  } catch (err) {
    console.error(err);
    status.style.color  = "red";
    status.textContent  = "❌ Submission failed. Please try again.";
    btn.disabled        = false;
    btn.textContent     = "Submit Application";
  }
});