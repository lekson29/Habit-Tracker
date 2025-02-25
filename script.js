// Wait for the DOM content to load before executing any script
document.addEventListener("DOMContentLoaded", () => {
  loadHabits();
  checkLoginStatus();
  setupDarkMode();
  setupEventListeners();
});

// Add Habit
document.getElementById("add-habit").addEventListener("click", () => {
  const habitName = document.getElementById("habit-name").value.trim();
  if (habitName) {
    addHabit(habitName);
    saveHabit(habitName);
    document.getElementById("habit-name").value = ""; // Clear the input
  }
});

// Add habit to the list
function addHabit(name) {
  const habitList = document.getElementById("habits");
  let li = document.createElement("li");

  // Retrieve or initialize habit data from Local Storage
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

  // Smooth transition for newly added habit
  li.style.opacity = 0;
  setTimeout(() => (li.style.opacity = 1), 200);
}

// Remove Habit
function removeHabit(button, name) {
  const habitItem = button.parentElement;
  habitItem.style.transform = "scale(0.9)";
  habitItem.style.opacity = "0";

  setTimeout(() => {
    habitItem.remove();
    removeHabitFromStorage(name);
  }, 300);
}

// Mark Habit as Completed for the Day
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
    habitData.streak = 0; // Reset streak if unchecked
  }

  habitData.totalDays++;
  localStorage.setItem(name, JSON.stringify(habitData));

  updateHabitStats(name);
}

// Update Habit Stats
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

// Local Storage Functions
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

// Handle Login Status
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
    document.getElementById("login-form").style.display = "block";
    document.getElementById("habit-section").style.display = "none";
    document.getElementById("habit-list").style.display = "none";
    document.getElementById("sign-out").style.display = "none";
    document.getElementById("sign-in").style.display = "inline-block";
  }
}

// Handle Dark Mode Toggle
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

// Chatbot Toggle Functionality
document.getElementById("open-chatbot").addEventListener("click", () => {
  const chatbotBox = document.getElementById("chatbot-box");
  chatbotBox.style.display =
    chatbotBox.style.display === "block" ? "none" : "block";
});
