document.getElementById("add-habit").addEventListener("click", () => {
  const habitName = document.getElementById("habit-name").value;
  if (habitName) {
    addHabit(habitName);
    document.getElementById("habit-name").value = "";
  }
});

function addHabit(name) {
  const habitList = document.getElementById("habits");
  let li = document.createElement("li");
  li.innerHTML = `${name} <button onclick="removeHabit(this)">❌</button>`;
  habitList.appendChild(li);

  // Animate habit addition
  li.style.opacity = 0;
  setTimeout(() => (li.style.opacity = 1), 200); // Fade-in effect for newly added habit
}

function removeHabit(button) {
  const habitItem = button.parentElement;
  habitItem.style.transform = "scale(0.9)";
  habitItem.style.opacity = "0";

  // Fade out and then remove the habit
  setTimeout(() => habitItem.remove(), 300);
}

document.getElementById("open-chatbot").addEventListener("click", () => {
  const chatbotBox = document.getElementById("chatbot-box");
  chatbotBox.style.display =
    chatbotBox.style.display === "block" ? "none" : "block";
});
