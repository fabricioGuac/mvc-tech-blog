
const delHandler = async (id) => {
        // Makes the api call passing the id as a parameter
        const response = await fetch(`/api/post/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            // Returns the user to the dashboard
            document.location.replace('/dashboard');
        } else {
            // Logs the error and shows the modal with an error message
            const err = await response.json();
            console.log(err)
            showModal('Failed to delete post');
        }
};

// Adds the events listeners whe the document is fully loaded
$(document).ready(() => {
    $('.post').on('click', (e) => {

        // Find the closest button element with a data-action attribute when clicked
        const btn = e.target.closest('button[data-action]');
        if(btn){
            // Get the value of the data-action attribute of the button
            const action = btn.getAttribute('data-action');
            // Find the closest element with a 'data-id' attribute and get its value
            const id = btn.closest('[data-id]').getAttribute('data-id');
            // If the action is delete calls the delete function passing the target id
            if(action === "delete"){
                delHandler(id);
            } else{ 
                // Redirects the user to the editor for the post with the target id
                window.location.href = `/editor/${id}`;
            }
        }
    });
})
