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

// Dark Mode Toggle
document.getElementById("toggle-dark-mode").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "dark-mode",
    document.body.classList.contains("dark-mode")
  );
});

// Load Dark Mode Preference
if (JSON.parse(localStorage.getItem("dark-mode"))) {
  document.body.classList.add("dark-mode");
}
