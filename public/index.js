
let btns = document.querySelectorAll(".btn.btn-primary");
btns.forEach(btn => {
  btn.addEventListener("click", async () => {
    const amount = prompt("Amount to donate (USD):");
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    try {
      const res = await fetch("https://save-a-life-production.up.railway.app/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount) }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("❌ Something went wrong. Please try again.");
      }
    } catch (err) {
      alert("❌ Request failed. Check your connection.");
    }
  })});


