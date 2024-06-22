
const editor = async (e) => {
    e.preventDefault();
    // Gets the values from the form and the id from the button meta-data
    const id = e.target.querySelector('button[type="submit"]').getAttribute('data-id');
    const title = $('#ed-title').val().trim();
    const content = $('#ed-content').val().trim();

    // Makes the api call
    const response = await fetch(`/api/post/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ title, content}),
        headers: { "content-Type": "application/json" },
    });

    if (response.ok) {
        // Returns the user to the dashboard
        document.location.replace('/dashboard');
    } else {
        // Logs tthe error and shows the modal with the error
        const err = await response.json();
        console.log(err)
        showModal('Failed to edit post');
    }
};

// Document.ready to ensure the page is fully loaded before adding the event listener
$(document).ready(() => {
$('.edit-form').on('submit', (e) => editor(e));
})