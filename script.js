import {
  addHabitToFirebase,
  loadHabits,
  removeHabitFromFirebase,
} from "./firebase.js";

document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus(); // Ensure login status is checked as soon as the page loads
  setupDarkMode();
  setupEventListeners();
  loadHabitsUI(); // Ensure habits are loaded when the page loads
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

document.getElementById("toggle-dark-mode").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark-mode")
  );
});

function checkLoginStatus() {
  const userEmail = localStorage.getItem("userEmail");

  // Show the login form and hide habit sections by default
  document.getElementById("login-form").style.display = "block";
  document.getElementById("habit-section").style.display = "none";

  if (userEmail) {
    // User is logged in, show habit section
    document.getElementById("login-form").style.display = "none";
    document.getElementById("habit-section").style.display = "block";
    document.getElementById(
      "user-info"
    ).textContent = `Logged in as: ${userEmail}`;
    document.getElementById("sign-out").style.display = "inline-block";
    document.getElementById("sign-in").style.display = "none";
    loadHabitsUI(); // Load habits if logged in
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

// Load habits UI after fetching data from Firebase
async function loadHabitsUI() {
  const habits = await loadHabits();
  document.getElementById("habits").innerHTML = "";
  habits.forEach((habit) => {
    let li = document.createElement("li");
    li.innerHTML = `
      <span>${habit.name}</span>
      <button onclick="removeHabitFromFirebase('${habit.id}')">❌</button>
    `;
    document.getElementById("habits").appendChild(li);
  });
}
