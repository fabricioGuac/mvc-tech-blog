const poster = async (e) => {
    e.preventDefault();
    const title = $('#title').val().trim();
    const content = $('#content').val().trim();

    if (title && content) {
        const response = await fetch('/api/post', {
            method: "POST",
            body: JSON.stringify({ title, content}),
            headers: { "content-Type": "application/json" },
        });
        if (!response.ok) {
            const err = await response.json();
            console.log(err);
            showModal(`Error making the post`);
        } else {
        document.location.replace('/dashboard');
        }
    } else {
        showModal('Post must contain a title and content')
    }
}

$(document).ready(() => {
    $('.post-form').on('submit', (e) => poster(e));
})