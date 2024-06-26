const commenter = async (e) => {
    e.preventDefault();

    // Gets the value from the form and the id from the button
    const content = $('#comment').val().trim();
    const post_id = e.target.querySelector('button[type="submit"]').getAttribute('data-id');

    // Checks if the content has any value
    if (content) {
        // Makes the api call
        const response = await fetch('/api/comment', {
            method: "POST",
            body: JSON.stringify({post_id, content}),
            headers: { "content-Type": "application/json" },
        });
        if (!response.ok) {
            // Logs the error and shows the modal
            const err = await response.json();
            console.log(err);
            showModal(`Error making the comment`);
        } else {
            // Reloads the comment page
            location.reload();
        }
    }
}

// Document.ready to ensure the page is fully loaded before adding the event listener
$(document).ready(() => {
    $('.comment-form').on('submit', (e) => commenter(e));
})