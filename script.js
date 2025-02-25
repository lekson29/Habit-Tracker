import { signIn, signOutUser, addHabit } from "./firebase.js";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("signInButton").addEventListener("click", signIn);
  document
    .getElementById("signOutButton")
    .addEventListener("click", signOutUser);

  document.getElementById("addHabitButton").addEventListener("click", () => {
    const habitName = document.getElementById("habitName").value;
    const user = auth.currentUser;
    if (user) {
      addHabit(user.uid, habitName);
    } else {
      alert("Please sign in first!");
    }
  });
});
