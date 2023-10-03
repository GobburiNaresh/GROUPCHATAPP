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
  };

  try {
    const response = await axios.post('http://localhost:3000/user/message', { message }, {
      headers: { Authorization:  token },
    });
    messageInput.value = '';
    localStorage.setItem('id', response.data.newMessage[0].id);
    displayMessage("You", response.data.newMessage[0].message, true);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

async function getAllMessagesFromDB() {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('id');
  setInterval( 
    async() => {
    if (!token || !userId) {
      console.error('Token or user ID not found in localStorage');
      return;
    }

    try {
      const response = await axios.get('http://localhost:3000/user/getmessages', {
        headers: { Authorization:  token  }, 
      });
      console.log('response of all messages in global group', response);

      clearChatMessages();
      const messages = {};

      for (let i = 0; i < response.data.allMessage.length; i++) {
        let message = response.data.allMessage[i].message;
        let id = response.data.allMessage[i].id;
        let name = response.data.allMessage[i].user_detail.name;
        localStorage.setItem('name',name);
        console.log(name);

        messages[id] = message;

        const isUser = response.data.allMessage[i].userId == userId;
        displayMessage(isUser ? "You" : name, message, isUser);
        
      }

      localStorage.setItem('chatMessages', JSON.stringify(messages));
    } catch (err) {
      console.error(err);
    }
   }
   ,1000);
}

function getAllMessagesFromLS() {
  const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
  console.log("messages from LS", messages);
  clearChatMessages();
  if (messages.length > 10) {
    messages = messages.slice(messages.length - 10);
  }
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    displayMessage("You", message, true);
  }
}


function clearChatMessages() {
    const chatMessages = document.querySelector(".chat-messages");
    chatMessages.innerHTML = ''; 
}

function displayMessage(sender, message, isUser) {
    const chatMessages = document.querySelector(".chat-messages");
    const name = localStorage.getItem('name');
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message-container", isUser ? "user" : name);
  
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

displayMessage( "Hello! How are u today?", false);

window.addEventListener('DOMContentLoaded', getAllMessagesFromDB);
async function getAllNewMessagesFromDB() {
  const latestMessageOfUserHasSentId = localStorage.getItem('latest msg id');
  const userId = localStorage.getItem('id');
  console.log("latestMessageOfUserHasId", latestMessageOfUserHasSentId);
  try {
      const response = await axios.get(`http://localhost:3000/user/allMessages/${latestMessageOfUserHasSentId}`);
      console.log(response.data.newMessages);
      for (let i = 0; i < response.data.newMessages.length; i++) {
          console.log("--->", response.data.newMessages[i])
          if (response.data.newMessages.userId == userId) {

              displayMessage("You", response.data.newMessages[i].message, true);
          }
          else {
              displayMessage("You", response.data.newMessages[i].message, false);
          }
          localStorage.setItem('latest msg id', (response.data.newMessages[i].id));
      }

  }
  catch (errr) {
      console.log('error fetching new messsages')
  }
}
