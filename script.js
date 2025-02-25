document.addEventListener("DOMContentLoaded", () => {
  loadHabits();
  checkLoginStatus(); // Check login status on page load
  setupDarkMode();
  setupEventListeners();
});

document.getElementById("add-habit").addEventListener("click", () => {
  const habitName = document.getElementById("habit-name").value.trim();
  if (habitName) {
    addHabit(habitName);
    saveHabit(habitName);
    document.getElementById("habit-name").value = ""; // Clear the input
  }
});

function addHabit(name) {
  const habitList = document.getElementById("habits");
  let li = document.createElement("li");

  let storedData = JSON.parse(localStorage.getItem(name)) || {
    streak: 0,
    completedDays: 0,
    totalDays: 0,
  };

  li.innerHTML = `
      <span>${name}</span>
      <input type="checkbox" class="habit-checkbox" onchange="markHabit('${name}', this)">
      <span class="habit-stats">🔥 Streak: ${storedData.streak} | ✅ ${storedData.completedDays}/${storedData.totalDays}</span>
      <button onclick="removeHabit(this, '${name}')">❌</button>
    `;
  habitList.appendChild(li);

  li.style.opacity = 0;
  setTimeout(() => (li.style.opacity = 1), 200);
}

function removeHabit(button, name) {
  const habitItem = button.parentElement;
  habitItem.style.transform = "scale(0.9)";
  habitItem.style.opacity = "0";

  setTimeout(() => {
    habitItem.remove();
    removeHabitFromStorage(name);
  }, 300);
}

function markHabit(name, checkbox) {
  let habitData = JSON.parse(localStorage.getItem(name)) || {
    streak: 0,
    completedDays: 0,
    totalDays: 0,
  };

  if (checkbox.checked) {
    habitData.completedDays++;
    habitData.streak++;
  } else {
    habitData.streak = 0;
  }

  habitData.totalDays++;
  localStorage.setItem(name, JSON.stringify(habitData));

  updateHabitStats(name);
}

function updateHabitStats(name) {
  let habitList = document.getElementById("habits").children;
  for (let li of habitList) {
    if (li.innerHTML.includes(name)) {
      let habitData = JSON.parse(localStorage.getItem(name)) || {
        streak: 0,
        completedDays: 0,
        totalDays: 0,
      };
      li.querySelector(
        ".habit-stats"
      ).innerHTML = `🔥 Streak: ${habitData.streak} | ✅ ${habitData.completedDays}/${habitData.totalDays}`;
    }
  }
}

function saveHabit(name) {
  let habits = JSON.parse(localStorage.getItem("habits")) || [];
  habits.push(name);
  localStorage.setItem("habits", JSON.stringify(habits));
}

function loadHabits() {
  let habits = JSON.parse(localStorage.getItem("habits")) || [];
  habits.forEach(addHabit);
}

function removeHabitFromStorage(name) {
  let habits = JSON.parse(localStorage.getItem("habits")) || [];
  habits = habits.filter((habit) => habit !== name);
  localStorage.setItem("habits", JSON.stringify(habits));
}

document.getElementById("sign-in").addEventListener("click", () => {
  const email = document.getElementById("email").value;
  if (email) {
    localStorage.setItem("userEmail", email);
    checkLoginStatus();
  }
});

document.getElementById("sign-out").addEventListener("click", () => {
  localStorage.removeItem("userEmail");
  checkLoginStatus();
});

function checkLoginStatus() {
  const userEmail = localStorage.getItem("userEmail");

  // Show sign-in form and hide habit section by default on page load
  document.getElementById("login-form").style.display = "block";
  document.getElementById("habit-section").style.display = "none";
  document.getElementById("habit-list").style.display = "none";

  // If the user is logged in, hide sign-in form and show habit section
  if (userEmail) {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("habit-section").style.display = "block";
    document.getElementById("habit-list").style.display = "block";
    document.getElementById(
      "user-info"
    ).textContent = `Logged in as: ${userEmail}`;
    document.getElementById("sign-out").style.display = "inline-block";
    document.getElementById("sign-in").style.display = "none";
  } else {
    document.getElementById("sign-out").style.display = "none";
    document.getElementById("sign-in").style.display = "inline-block";
  }
}

function setupDarkMode() {
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }
}

document.getElementById("toggle-dark-mode").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark-mode")
  );
});

document.getElementById("open-chatbot").addEventListener("click", () => {
  const chatbotBox = document.getElementById("chatbot-box");
  chatbotBox.style.display =
    chatbotBox.style.display === "block" ? "none" : "block";
});
