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
        console.log(response.data.allMessage[i].user_detail)
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
    messageContainer.classList.add("message-container", isUser ? "user" : "You");
  
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


/////group-creation/////


document.getElementById('groupCreateFrom').addEventListener('submit', createGroup);
async function createGroup(e) {
    e.preventDefault();
    const userId = localStorage.getItem('id');
    console.log('group button working', userId)
    const groupName = document.getElementById('group-name-input').value;
    console.log('groupName', groupName);
    try {
        const response = await axios.post('http://localhost:3000/group/createGroup', { groupName, userId });
        console.log("group id after group creation", response.data.result);
        // displayGroup(response.data.result)
        } catch (error) {
            console.log(error);
        }
}

window.addEventListener('DOMContentLoaded', getAllGroupsOfUserFromDB);
async function getAllGroupsOfUserFromDB() {
  try {
      const userId = localStorage.getItem('id');
      const response = await axios.get(`http://localhost:3000/group/fetchGroups/${userId}`);
      console.log("all groups of user",response.data);
      for (let i = 0; i < response.data.length; i++) {
          const data = response.data[i]
          console.log("///////////",data.group.group_name)
          displayGroup(data);
      }

  } catch (error) {
      console.log(error);
  }
}


function displayGroup(data) {
  const groupName = data.group.group_name;
  console.log(data.group);
  const groupId = data.group.groupId;
  console.log(groupId);
  console.log("revieving group id",groupId)
  localStorage.setItem(groupName,groupId);

  const userId = localStorage.getItem('id');
  console.log("group is", groupName);
  console.log("group id is", groupId);
  const groupLists = document.getElementById('list_of_groups');

  const buttonItem = document.createElement('button');
  buttonItem.className = 'group_button';
  buttonItem.setAttribute('groupId', groupId);

  const groupNameSpan = document.createElement('span');
  groupNameSpan.textContent = groupName;

  buttonItem.appendChild(groupNameSpan);

  buttonItem.addEventListener('click', () => {
      const chatHeader = document.getElementById('chat-header-element');
      groupName = 'Group: ' + groupName;
      chatHeader.textContent = groupName;

      const dropdownContainer = document.createElement('div');
      dropdownContainer.className = 'dropdown';


      const dropdownButton = document.createElement('button');
      dropdownButton.className = 'dropdown-btn';
      dropdownButton.innerHTML = '<i class="fas fa-ellipsis-v"></i>'; 

      const dropdownContent = document.createElement('div');
      dropdownContent.className = 'dropdown-content';


      const addUsersButton = document.createElement('button');
      addUsersButton.id = 'add_users';
      addUsersButton.textContent = 'Add Users';

      addUsersButton.addEventListener('click', function () {
          const container = document.getElementById('group_list');
          container.style.display = 'none';
          // showAllUsersOfChatApp(groupId, userId);
      });

      const seeMembersButton = document.createElement('button');
      seeMembersButton.id = 'see_users';
      seeMembersButton.textContent = 'See Members';

      seeMembersButton.addEventListener('click', function () {
          const container = document.getElementById('group_list');
          container.style.display = 'none';
          // showListOfGroupMembers();
      });

      const logoutButton = document.createElement('button');
      logoutButton.textContent = 'Logout';

      logoutButton.addEventListener('click', function () {
          logOutUser()
      });

      // Append the dropdown button and content to the dropdown container
      dropdownContainer.appendChild(dropdownButton);
      dropdownContainer.appendChild(dropdownContent);

      // Append the individual buttons to the dropdown content
      dropdownContent.appendChild(addUsersButton);
      dropdownContent.appendChild(seeMembersButton);
      dropdownContent.appendChild(logoutButton);

      // Append the dropdown container to the chat header
      chatHeader.appendChild(dropdownContainer);



      const chatMessages = document.querySelector(".chat-messages");
      chatMessages.innerHTML = '';

      const sendMessageButton = document.getElementById('send-button');
      sendMessageButton.onclick = sendMessageToGroupServer;

      // getAllGroupMessagesFromDB(groupId)


  });

  groupLists.appendChild(buttonItem);

  async function sendMessageToGroupServer() {
      const messageInput = document.getElementById('message-input');
      const messageText = messageInput.value;
      const userId = localStorage.getItem('id');
      const groupId = localStorage.getItem(groupName);

      console.log('groupId', groupId);

      if (messageText.trim() !== '') {
          // console.log('token from local storage in ui page', token);
          console.log("message:", messageText);

          try {
              const response = await axios.post('http://localhost:3000/user/group/message', { message: messageText, userId: userId, groupId: groupId });
              messageInput.value = '';
              console.log("response after savinng group message", response)
               localStorage.setItem('groupMessage', (response.data.id));//active group recent message
               localStorage.setItem('groupId', (groupId));//active group i d
              // const isUser = false;

              displayMessage("You", response.data.message, true);
              // const currentMessage = getCurrentMessageFromServer();

          } catch (error) {
              console.error('Error sending message:', error);
          }
      }
  }
 }