document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const registerBtn = document.getElementById("register-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const googleLoginBtn = document.getElementById("google-login-btn");
  const biometricLoginBtn = document.getElementById("biometric-login-btn");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  // Google Sign-In
  googleLoginBtn.addEventListener("click", () => {
    signInWithPopup(auth, provider)
      .then((userCredential) => {
        alert("Google Login Successful!");
        window.location.href = "dashboard.html"; // Redirect after login
      })
      .catch((error) => alert(error.message));
  });

  // Email & Password Login
  loginBtn.addEventListener("click", () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert("Login Successful!");
        window.location.href = "dashboard.html"; // Redirect after login
      })
      .catch((error) => alert(error.message));
  });

  // Register New User
  registerBtn.addEventListener("click", () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert("Registration Successful! Please log in.");
      })
      .catch((error) => alert(error.message));
  });

  // Logout
  logoutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        alert("Logged out successfully!");
        window.location.href = "index.html"; // Redirect to login page
      })
      .catch((error) => alert(error.message));
  });

  // Biometric Login (Using WebAuthn API)
  biometricLoginBtn.addEventListener("click", async () => {
    try {
      const publicKeyCredential = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32), // Random challenge
          allowCredentials: [],
          timeout: 60000,
          userVerification: "required",
        },
      });

      if (publicKeyCredential) {
        alert("Biometric Login Successful!");
        window.location.href = "dashboard.html"; // Redirect after login
      }
    } catch (error) {
      alert("Biometric Login Failed: " + error.message);
    }
  });
});
