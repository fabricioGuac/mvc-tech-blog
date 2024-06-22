const poster = async (e) => {
    e.preventDefault();
    // Gets the values from the form
    const title = $('#title').val().trim();
    const content = $('#content').val().trim();

    // Checks if the form is complete 
    if (title && content) {
        // Makes the api call
        const response = await fetch('/api/post', {
            method: "POST",
            body: JSON.stringify({ title, content}),
            headers: { "content-Type": "application/json" },
        });
        if (!response.ok) {
            // Logs the error and sends shows the error in the modal
            const err = await response.json();
            console.log(err);
            showModal(`Error making the post`);
        } else {
            // Sents the user back to the dashboard if the response is ok
        document.location.replace('/dashboard');
        }
    } else {
        showModal('Post must contain a title and content')
    }
}

// Document.ready to ensure the page is fully loaded before adding the event listener
$(document).ready(() => {
    $('.post-form').on('submit', (e) => poster(e));
})