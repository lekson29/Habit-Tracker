document.addEventListener("DOMContentLoaded", () => {
  const emailLoginBtn = document.getElementById("login-email");
  const registerEmailBtn = document.getElementById("register-email");
  const habitInput = document.getElementById("habit-input");
  const addHabitBtn = document.getElementById("add-habit-btn");
  const habitList = document.getElementById("habit-list");
  const streakInfo = document.getElementById("streak-info");

  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const loginPage = document.getElementById("login-page");
  const habitTrackerPage = document.getElementById("habit-tracker-page");

  const habitRef = firebase.database().ref("habits");

  // Firebase Authentication functions for email/password login
  emailLoginBtn.addEventListener("click", () => {
    const userEmail = email.value;
    const userPassword = password.value;

    if (userEmail && userPassword) {
      auth
        .signInWithEmailAndPassword(userEmail, userPassword)
        .then((userCredential) => {
          console.log("User logged in successfully:", userCredential.user);
          loginPage.style.display = "none";
          habitTrackerPage.style.display = "block";
        })
        .catch((error) => {
          alert("Error: " + error.message);
        });
    } else {
      alert("Please enter both email and password.");
    }
  });

  registerEmailBtn.addEventListener("click", () => {
    const userEmail = email.value;
    const userPassword = password.value;

    if (userEmail && userPassword) {
      auth
        .createUserWithEmailAndPassword(userEmail, userPassword)
        .then((userCredential) => {
          console.log("User registered successfully:", userCredential.user);
          alert("Registration successful. You can now log in.");
        })
        .catch((error) => {
          alert("Error: " + error.message);
        });
    } else {
      alert("Please enter both email and password.");
    }
  });

  // Biometric Authentication
  const biometricLoginBtn = document.getElementById("biometric-login");

  biometricLoginBtn.addEventListener("click", () => {
    if (window.PublicKeyCredential) {
      navigator.credentials
        .get({ publicKey: {} })
        .then(() => {
          alert("Biometric Authentication Successful!");
          loginPage.style.display = "none";
          habitTrackerPage.style.display = "block";
        })
        .catch(() => {
          alert("Authentication Failed");
        });
    } else {
      alert("Biometric authentication not supported");
    }
  });

  // Habit Tracker Logic
  addHabitBtn.addEventListener("click", () => {
    const habitText = habitInput.value.trim();
    if (habitText) {
      const newHabit = {
        text: habitText,
        completed: false,
      };
      habitRef.push(newHabit); // Save to Firebase
      habitInput.value = ""; // Clear input field
    }
  });

  habitRef.on("child_added", (snapshot) => {
    const habit = snapshot.val();
    const li = document.createElement("li");
    li.innerHTML = `${habit.text} <button class="delete-btn">Delete</button>`;
    habitList.appendChild(li);

    // Delete Habit
    li.querySelector(".delete-btn").addEventListener("click", () => {
      snapshot.ref.remove();
    });
  });

  habitRef.on("child_removed", (snapshot) => {
    const habitItem = document.querySelector(`[data-id="${snapshot.key}"]`);
    if (habitItem) {
      habitItem.remove();
    }
  });

  habitRef.on("child_changed", (snapshot) => {
    const habit = snapshot.val();
    const habitItem = document.querySelector(`[data-id="${snapshot.key}"]`);
    if (habit.completed) {
      habitItem.classList.add("completed");
    } else {
      habitItem.classList.remove("completed");
    }
  });

  habitRef.on("value", (snapshot) => {
    const habits = snapshot.val();
    let streakCount = 0;
    let totalCount = 0;

    for (let habitId in habits) {
      totalCount++;
      if (habits[habitId].completed) {
        streakCount++;
      }
    }

    streakInfo.innerText = `Streak: ${streakCount} / ${totalCount}`;
  });
});
