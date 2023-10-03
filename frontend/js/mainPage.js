async function sendMessageToServer() {
  const messageInput = document.getElementById('message-input');
  const messageText = messageInput.value;
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('Token not found in localStorage');
    return;
  }

  const message = {
    message: messageText,
    token: token,
  };

  try {
    const response = await axios.post('http://localhost:3000/user/message', { message }, {
      headers: { Authorization:  token }, // Use 'Bearer' prefix for JWT token
    });
    messageInput.value = '';
    console.log('sent message to server', response.data.newMessage[0].message);
    console.log('sent message id to server', response.data.newMessage[0].id);
    localStorage.setItem('latest msg id', response.data.newMessage[0].id);
    displayMessage("You", response.data.newMessage[0].message, true);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

async function getAllMessagesFromDB() {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('id');

  if (!token || !userId) {
    console.error('Token or user ID not found in localStorage');
    return;
  }

  try {
    const response = await axios.get('http://localhost:3000/user/getmessages', {
      headers: { Authorization:  token  }, // Use 'Bearer' prefix for JWT token
    });
    console.log('response of all messages in global group', response);

    clearChatMessages();
    const messages = {};

    for (let i = 0; i < response.data.allMessage.length; i++) {
      let message = response.data.allMessage[i].message;
      let id = response.data.allMessage[i].id;
      let name = response.data.allMessage[i].user.name;

      messages[id] = message;
      var isUser = false;

      if (response.data.allMessage[i].userId == userId) {
        isUser = true;
        displayMessage("You", message, isUser);
      } else {
        displayMessage(name, message, isUser);
      }
    }

    localStorage.setItem('chatMessages', JSON.stringify(messages));
  } catch (err) {
    console.error(err);
  }
}

function getAllMessagesFromLS() {
  const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
  console.log("messages from LS", messages);
  clearChatMessages();
  for (let i = 0; i < messages.length; i++) {
    let message = messages[i];
    displayMessage("You", message, true);
  }
}

function clearChatMessages() {
    const chatMessages = document.querySelector(".chat-messages");
    chatMessages.innerHTML = ''; 
}

function displayMessage(sender, message, isUser) {
    const chatMessages = document.querySelector(".chat-messages");

    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message-container", isUser ? "user" : "bot");

    const senderDiv = document.createElement("div");
    senderDiv.classList.add("message-sender");
    senderDiv.textContent = sender;

    const messageTextDiv = document.createElement("div");
    messageTextDiv.classList.add("message-text");
    messageTextDiv.textContent = message;

    messageContainer.appendChild(senderDiv);
    messageContainer.appendChild(messageTextDiv);

    chatMessages.appendChild(messageContainer);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

displayMessage("Bot", "Hello! How can I help you today?", false);


