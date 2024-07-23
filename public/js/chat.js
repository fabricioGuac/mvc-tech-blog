
// Get the current URL path and splits it
const pathArr= window.location.pathname.split('/');

// Gets the id from path array the array
const receiver_id= pathArr[pathArr.length - 1];

const  messenger = async () => {
    const content = $('#message-input').val().trim();

    if(!content){
        showModal('No message to send');
        return;
    }

    console.log(content);

    // Makes the api call
    const response = await fetch('/api/message', {
        method: "POST",
        body: JSON.stringify({receiver_id, content}),
        headers: { "content-Type": "application/json" },
    });
    if (!response.ok) {
        // Logs the error and shows the modal
        const err = await response.json();
        console.log(err);
        showModal(`Error creating the message`);
    }
}



$(document).ready(() => {
    $('#chat-form').on('submit', (e) => {
        e.preventDefault();
        messenger();
    })
})