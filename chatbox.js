document.addEventListener("DOMContentLoaded", () => {
  const openChatbotBtn = document.getElementById("open-chatbot");
  const chatbotBox = document.getElementById("chatbot-box");

  if (openChatbotBtn && chatbotBox) {
    openChatbotBtn.addEventListener("click", () => {
      chatbotBox.innerHTML = "Hello! Need help with your habits?";
    });
  } else {
    console.error("Chatbot elements not found!");
  }
});
