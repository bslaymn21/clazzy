// Sidebar toggle
const sidebar = document.getElementById('sidebar');
document.getElementById('hamburger').onclick = () => sidebar.classList.add('active');
document.getElementById('hamburgerr').onclick = () => sidebar.classList.remove('active');

// Chat toggle
const chatBtn = document.getElementById('chatBtn');
const chatBox = document.getElementById('chatBox');
const closeChat = document.getElementById('closeChat');

chatBtn.addEventListener('click', () => {
  chatBox.style.display = 'flex';
});

closeChat.addEventListener('click', () => {
  chatBox.style.display = 'none';
});

// Send message
const sendBtn = document.getElementById('sendBtn');
const chatInput = document.getElementById('chatInput');
const chatBody = document.querySelector('.chat-body');

sendBtn.addEventListener('click', () => {
  if(chatInput.value.trim() === "") return;
  const msg = document.createElement('div');
  msg.classList.add('message','client');
  msg.textContent = chatInput.value;
  chatBody.appendChild(msg);
  chatInput.value = "";
  chatBody.scrollTop = chatBody.scrollHeight;
});
  setTimeout(() => {
    const aiMsg = document.createElement('div');
    aiMsg.classList.add('message','ai');
    aiMsg.textContent = "AI Response";
    chatBody.appendChild(aiMsg);
    chatBody.scrollTop = chatBody.scrollHeight;
  });
