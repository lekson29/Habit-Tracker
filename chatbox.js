document.addEventListener("DOMContentLoaded", () => {
  const openChatbotBtn = document.getElementById("open-chatbot");
  const chatbotBox = document.getElementById("chatbot-box");

  if (openChatbotBtn && chatbotBox) {
    openChatbotBtn.addEventListener("click", () => {
      chatbotBox.innerHTML =
        "Hello! How can I assist you with your habits today?";
      chatbotBox.style.display = "block";
    });
  } else {
    console.error("Chatbot elements not found!");
  }
});
