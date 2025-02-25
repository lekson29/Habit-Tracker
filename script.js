document.addEventListener("DOMContentLoaded", function () {
  // Your code here

  // Firebase Config and Initialization
  const firebaseConfig = {
    apiKey: "AIzaSyDs6aSlwtmS2bGPMApvaHEGgPyHYdqjNHU",
    authDomain: "habit-tracker-5eee2.firebaseapp.com",
    projectId: "habit-tracker-5eee2",
    storageBucket: "habit-tracker-5eee2.firebasestorage.app",
    messagingSenderId: "779245589872",
    appId: "1:779245589872:web:a637c67b623f040219abb5",
    measurementId: "G-F6HWE82Q53",
  };

  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();

  // Sign-in with Google
  document
    .getElementById("signInButton")
    .addEventListener("click", async () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      try {
        const result = await auth.signInWithPopup(provider);
        const user = result.user;

        // Show the habit form after sign-in
        document.getElementById("habitForm").style.display = "block";
        document.getElementById("signInButton").style.display = "none"; // Hide sign-in button
        console.log("User signed in:", user.displayName);

        loadUserHabits(user.uid); // Load habits after signing in
      } catch (error) {
        console.error("Error signing in:", error.message);
      }
    });

  // Add a Habit
  document
    .getElementById("addHabitButton")
    .addEventListener("click", async () => {
      const habitName = document.getElementById("habitName").value;
      const userId = auth.currentUser.uid; // Get the current user's UID

      if (habitName) {
        const habitRef = db
          .collection("users")
          .doc(userId)
          .collection("habits");
        await habitRef.add({
          name: habitName,
          streak: 0,
          completedToday: false,
        });
        console.log("Habit added!");
        loadUserHabits(userId); // Reload habits after adding
      } else {
        alert("Please enter a habit name.");
      }
    });

  // Load and Display Habits
  const loadUserHabits = async (userId) => {
    const habitListContainer = document.getElementById("habitList");
    const habitRef = db.collection("users").doc(userId).collection("habits");
    const snapshot = await habitRef.get();

    habitListContainer.innerHTML = ""; // Clear any previous habits displayed

    snapshot.forEach((doc) => {
      const habit = doc.data();
      const habitItem = document.createElement("div");
      habitItem.classList.add("habit-item");
      habitItem.innerHTML = `
                <p><strong>${habit.name}</strong></p>
                <p>Streak: ${habit.streak}</p>
                <p>Completed Today: ${habit.completedToday ? "Yes" : "No"}</p>
                <button onclick="markCompleted('${
                  doc.id
                }', '${userId}')">Mark as Completed</button>
            `;
      habitListContainer.appendChild(habitItem);
    });
  };

  // Mark a Habit as Completed
  const markCompleted = async (habitId, userId) => {
    const habitRef = db
      .collection("users")
      .doc(userId)
      .collection("habits")
      .doc(habitId);
    const habitDoc = await habitRef.get();
    const habitData = habitDoc.data();

    // Update streak and completed status
    const newStreak = habitData.completedToday
      ? habitData.streak
      : habitData.streak + 1;
    await habitRef.update({
      streak: newStreak,
      completedToday: true,
    });

    console.log("Habit marked as completed");
    loadUserHabits(userId); // Reload habits after updating
  };
});
