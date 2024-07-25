
// Get the current URL path and splits it
const pathArr = window.location.pathname.split('/');

// Gets the id from path array
const receiverId = pathArr[pathArr.length - 1];

// Function to get the user id 
const meGetter = async () => {
  try {
    // Make API call
    const response = await fetch('/myId');
    if (!response.ok) {
      const err = await response.json();
      console.log(err);
      showModal('Error fetching user ID');
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user ID:', error);
    showModal('Error fetching user ID');
    return null;
  }
};

const initializeSocket = async () => {
  const currentUserId = await meGetter();
  // If the id is not found return
  if (!currentUserId) {
    return; 
  }

  // Initializes connection to the websocket
  const socket = io('http://localhost:3000');

  // Event listener to the server connection
  socket.on('connect', () => {
    console.log('Connected to server');
    // Emit a 'joinChat' event with user ids to create a chat room
    socket.emit('joinChat', { userId: currentUserId, targetUserId: receiverId });
  });

// Event listener for receiving new messages
  socket.on('newMessage', (message) => {
    console.log('New message received:', message);

    // Ternary operator to determine if the message was sent or received
    const owner = message.senderId === currentUserId ? 'sent' : 'received';

    // Append the new message to the chat messages container
    $('#chat-messages').append(`
      <div class="message ${owner}">
        <p>${new Date().toLocaleString('en-US')}</p>
        <p>${message.content}</p>
      </div>
    `);
  });

  // Function to create the messages
  const messenger = async () => {
    const content = $('#message-input').val().trim();

    // If the input is empty show the modal
    if (!content) {
      showModal('No message to send');
      return;
    }

    try {
      // Makes the API call
      const response = await fetch('/api/message', {
        method: "POST",
        body: JSON.stringify({ receiver_id: receiverId, content }),
        headers: { "Content-Type": "application/json" },
      });

      // If there is an error log the error and show the modal
      if (!response.ok) {
        const err = await response.json();
        console.log(err);
        showModal('Error creating the message');
      } else {
        // Clears the input field
        $('#message-input').val('');
        // Emits a 'newMessage' event with sender id, receiver id, and message content
        socket.emit('newMessage', { senderId: currentUserId, receiverId, content });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showModal('Error sending the message');
    }
  };

  // Attach event listener to the form 
  $('#chat-form').on('submit', (e) => {
    e.preventDefault();
    messenger();
  });
};

// Initialize the socket connection and set up the chat when the document is ready
$(document).ready(() => {
  initializeSocket();
});
