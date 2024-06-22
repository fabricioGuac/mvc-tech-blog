const logout = async () => {
    // Makes the api call
    const response = await fetch('/api/user/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
        // Sents the user to the homepage
        document.location.replace('/');
    } else {
        // Shows the modal with the error
        showModal(response.statusText);
    }
};

// Document.ready to ensure the page is fully loaded before adding the event listener
$(document).ready(()=>{
$('#logout').on('click', logout);
})