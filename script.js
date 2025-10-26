// Load festivals from local JSON
async function loadFestivals() {
  try {
    const response = await fetch('festivals.json');
    const festivals = await response.json();
    displayFestivals(festivals);
    // Only check reminders AFTER permission granted
    document.getElementById('reminderBtn').addEventListener('click', () => {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          checkReminders(festivals);
          alert("✅ Reminders enabled! Notifications will appear for upcoming festivals.");
        } else {
          alert("❌ Notifications not allowed.");
        }
      });
    });
  } catch (error) {
    console.error("Error loading festivals:", error);
  }
}

// Display festival list
function displayFestivals(festivals) {
  const container = document.getElementById('festivals');
  container.innerHTML = "";
  festivals.forEach(f => {
    const div = document.createElement('div');
    div.className = 'festival';
    div.textContent = `${f.date} — ${f.name_en} | ${f.name_od}`;
    container.appendChild(div);
  });
}

// Check for today/tomorrow festivals
function checkReminders(festivals) {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  festivals.forEach(f => {
    const eventDate = new Date(f.date + "T00:00:00"); // Force parse as local date
    if (eventDate.toDateString() === today.toDateString()) {
      showNotification("🎉 Today is " + f.name_en, f.name_od);
    } else if (eventDate.toDateString() === tomorrow.toDateString()) {
      showNotification("⏳ Tomorrow is " + f.name_en, f.name_od);
    }
  });
}

// Show browser notification
function showNotification(title, body) {
  if (Notification.permission === 'granted') {
    new Notification(title, { body });
  }
}

// Run page
window.onload = loadFestivals;
