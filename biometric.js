document.getElementById("biometric-login").addEventListener("click", () => {
  if (window.PublicKeyCredential) {
    navigator.credentials
      .get({ publicKey: {} })
      .then(() => alert("Biometric Authentication Successful!"))
      .catch(() => alert("Authentication Failed"));
  } else {
    alert("Biometric authentication not supported");
  }
});
