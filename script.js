document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus(); // Ensure login status is checked as soon as the page loads
  setupDarkMode();
  setupEventListeners();
  loadHabits(); // Ensure habits are loaded when the page loads
});

document.getElementById("add-habit").addEventListener("click", () => {
  if (!isUserLoggedIn()) {
    alert("You must sign in first to add a habit!");
    return; // Prevent habit addition if not logged in
  }

  const habitName = document.getElementById("habit-name").value.trim();
  if (habitName) {
    addHabitToFirebase(habitName); // Use Firebase to add habit
    document.getElementById("habit-name").value = ""; // Clear the input
  }
});

function addHabit(name) {
  const habitList = document.getElementById("habits");
  let li = document.createElement("li");

  li.innerHTML = `
      <span>${name}</span>
      <input type="checkbox" class="habit-checkbox" onchange="markHabit('${name}', this)">
      <span class="habit-stats">🔥 Streak: 0 | ✅ 0/0</span>
      <button onclick="removeHabitFromFirebase('${name}')">❌</button>
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
    removeHabitFromFirebase(name);
  }, 300);
}

function markHabit(name, checkbox) {
  if (!isUserLoggedIn()) {
    alert("You must sign in first to mark a habit!");
    checkbox.checked = false; // Prevent marking the habit if not logged in
    return;
  }

  // Logic to update habit stats can be implemented here if you want to track stats in Firebase.
}

function removeHabitFromFirebase(id) {
  deleteHabit(id);
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
