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

const liker = async (e) => {
    e.preventDefault();
    
    const post_id =  e.target.closest('#likeBtn').getAttribute('data-id');
        // Makes the api call
        const response = await fetch('/api/like', {
            method: "POST",
            body: JSON.stringify({post_id}),
            headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
            // Logs the error and shows the modal
            const err = await response.json();
            console.log(err);
            showModal(err.message);
        } 
        else {
            // Reloads the page
            location.reload();
        }
}

const unliker = async (e) => {
    e.preventDefault();
    
    const post_id =  e.target.closest('#unlikeBtn').getAttribute('data-id');
        // Makes the api call
        const response = await fetch('/api/like', {
            method: "DELETE",
            body: JSON.stringify({post_id}),
            headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
            // Logs the error and shows the modal
            const err = await response.json();
            console.log(err);
            showModal(err.message);
        } 
        else {
            // Reloads the page
            location.reload();
        }
}

// Document.ready to ensure the page is fully loaded before adding the event listener
$(document).ready(() => {
    $('.comment-form').on('submit', (e) => commenter(e));
    $('#likeBtn').on('click', function(e) {
    $(this).blur();
    // $('#heartIcon').toggleClass('far fas');
    liker(e);
    })
    $('#unlikeBtn').on('click', function(e) {
        $(this).blur();
        // $('#heartIcon').toggleClass('far fas');
        unliker(e);
    })
})