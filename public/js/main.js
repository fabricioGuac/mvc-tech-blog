const commenter = async (e) => {
    e.preventDefault();
    const content = $('#comment').val().trim();
    const post_id = e.target.querySelector('button[type="submit"]').getAttribute('data-id');

    if (content) {
        const response = await fetch('/api/comment', {
            method: "POST",
            body: JSON.stringify({post_id, content}),
            headers: { "content-Type": "application/json" },
        });
        if (!response.ok) {
            const err = await response.json();
            console.log(err);
            showModal(`Error making the comment ${err.errors[0].message}`);
        } else {
            location.reload();
        }
    }
}

$(document).ready(() => {
    $('.comment-form').on('submit', (e) => commenter(e));
})