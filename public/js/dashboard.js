
// const poster = async (e) => {
//     e.preventDefault();
//     const title = $('#title').val().trim();
//     const content = $('#content').val().trim();

//     if (title && content) {
//         const response = await fetch('/api/post', {
//             method: "POST",
//             body: JSON.stringify({ title, content}),
//             headers: { "content-Type": "application/json" },
//         });
//         if (!response.ok) {
//             const err = await response.json();
//             console.log(err);
//             showModal(`Error making the post ${err.errors[0].message}`);
//         } else {
//             location.reload();
//             //$('.newPost').hide();
//         }
//     } else {
//         showModal('Post must contain a title and content')
//     }
// }

// const showForm = (e) => {
//     e.preventDefault();

// } 


const delHandler = async (id) => {
        const response = await fetch(`/api/post/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            const err = await response.json();
            console.log(err)
            showModal('Failed to delete post');
        }
};

// Adds the events listeners whe the document is fully loaded
$(document).ready(() => {
    // $('.post-form').on('submit', (e) => poster(e));
    $('.post').on('click', (e) => {
        const btn = e.target.closest('button[data-action]');
        if(btn){
            const action = btn.getAttribute('data-action');
            console.log(`ACTION ${action}`);
            const id = btn.closest('[data-id]').getAttribute('data-id');
            console.log(` ID ${id}`);
            if(action === "delete"){
                delHandler(id);
            } else{ 
                window.location.href = `/editor/${id}`;
            }
        }
    });
})