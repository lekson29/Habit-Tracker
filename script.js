document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const habitForm = document.getElementById("habit-form");
  const habitInput = document.getElementById("habit-input");
  const addHabitBtn = document.getElementById("add-habit");
  const habitList = document.getElementById("habit-list");

  // Google Sign-In
  loginBtn.addEventListener("click", () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth
      .signInWithPopup(provider)
      .then((user) => {
        loginBtn.classList.add("hidden");
        logoutBtn.classList.remove("hidden");
        habitForm.classList.remove("hidden");
        habitList.classList.remove("hidden");
        loadHabits(user.user.uid);
      })
      .catch((error) => console.log(error));
  });

  // Logout
  logoutBtn.addEventListener("click", () => {
    auth.signOut().then(() => {
      loginBtn.classList.remove("hidden");
      logoutBtn.classList.add("hidden");
      habitForm.classList.add("hidden");
      habitList.classList.add("hidden");
      habitList.innerHTML = "";
    });
  });

  // Add Habit
  addHabitBtn.addEventListener("click", () => {
    const habit = habitInput.value.trim();
    if (habit) {
      const user = auth.currentUser;
      db.collection("habits").add({
        userId: user.uid,
        habit: habit,
        streak: 0,
        lastCompleted: null,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      habitInput.value = "";
      loadHabits(user.uid);
    }
  });

  // Load Habits
  function loadHabits(userId) {
    habitList.innerHTML = "";
    db.collection("habits")
      .where("userId", "==", userId)
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        habitList.innerHTML = "";
        snapshot.forEach((doc) => {
          const habitData = doc.data();
          const habitItem = document.createElement("div");
          habitItem.classList.add("habit-item");
          habitItem.innerHTML = `
                        <span>${habitData.habit}</span>
                        <button onclick="deleteHabit('${doc.id}')">Delete</button>
                    `;
          habitList.appendChild(habitItem);
        });
      });
  }

  // Delete Habit
  window.deleteHabit = (habitId) => {
    db.collection("habits").doc(habitId).delete();
  };
});
