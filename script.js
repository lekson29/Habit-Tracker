document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus(); // Ensure login status is checked as soon as the page loads
  setupDarkMode();
  setupEventListeners();
});

document.getElementById("add-habit").addEventListener("click", () => {
  if (!isUserLoggedIn()) {
    alert("You must sign in first to add a habit!");
    return; // Prevent habit addition if not logged in
  }

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
  if (!isUserLoggedIn()) {
    alert("You must sign in first to mark a habit!");
    checkbox.checked = false; // Prevent marking the habit if not logged in
    return;
  }

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

  // Show the login form and hide habit sections by default
  document.getElementById("login-form").style.display = "block";
  document.getElementById("habit-section").style.display = "none";
  document.getElementById("habit-list").style.display = "none";

  if (userEmail) {
    // User is logged in, show habit section
    document.getElementById("login-form").style.display = "none";
    document.getElementById("habit-section").style.display = "block";
    document.getElementById("habit-list").style.display = "block";
    document.getElementById(
      "user-info"
    ).textContent = `Logged in as: ${userEmail}`;
    document.getElementById("sign-out").style.display = "inline-block";
    document.getElementById("sign-in").style.display = "none";
    loadHabits(); // Load habits if logged in
  } else {
    document.getElementById("sign-out").style.display = "none";
    document.getElementById("sign-in").style.display = "inline-block";
  }
}

function isUserLoggedIn() {
  return localStorage.getItem("userEmail") !== null;
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
