document.getElementById("sendChat").addEventListener("click", () => {
  const chatInput = document.getElementById("chatInput").value;
  const messages = document.getElementById("messages");

  if (chatInput) {
    const messageElement = document.createElement("p");
    messageElement.textContent = chatInput;
    messages.appendChild(messageElement);
    document.getElementById("chatInput").value = "";
  }
});
