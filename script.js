document.addEventListener("DOMContentLoaded", loadHabits);

document.getElementById("add-habit").addEventListener("click", () => {
  const habitName = document.getElementById("habit-name").value.trim();
  if (habitName) {
    addHabit(habitName);
    saveHabit(habitName);
    document.getElementById("habit-name").value = "";
  }
});

function addHabit(name) {
  const habitList = document.getElementById("habits");
  let li = document.createElement("li");

  li.innerHTML = `
        <span>${name}</span>
        <input type="checkbox" class="habit-checkbox">
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

document.getElementById("open-chatbot").addEventListener("click", () => {
  const chatbotBox = document.getElementById("chatbot-box");
  chatbotBox.style.display =
    chatbotBox.style.display === "block" ? "none" : "block";
});

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

const toggleDarkMode = () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark-mode")
  );
};

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }
});

document
  .getElementById("toggle-dark-mode")
  .addEventListener("click", toggleDarkMode);

document.addEventListener("DOMContentLoaded", () => {
  loadHabits();
  checkLoginStatus();
});

// Login System
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
    document.getElementById("habit-form").style.display = "block";
    document.getElementById("habit-list").style.display = "block";
  } else {
    document.getElementById("login-form").style.display = "block";
    document.getElementById("habit-form").style.display = "none";
    document.getElementById("habit-list").style.display = "none";
  }
}
document.addEventListener("DOMContentLoaded", () => {
  loadHabits();
  checkLoginStatus();
});

// Modify `addHabit` function to include tracking
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
}

// Function to mark habit as completed for the day
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

// Update the streak & completion stats
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
