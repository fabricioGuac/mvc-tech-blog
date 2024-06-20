
const editor = async (e) => {
    e.preventDefault();
    const id = e.target.querySelector('button[type="submit"]').getAttribute('data-id');
    const title = $('#ed-title').val().trim();
    const content = $('#ed-content').val().trim();
    const response = await fetch(`/api/post/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ title, content}),
        headers: { "content-Type": "application/json" },
    });

    if (response.ok) {
        document.location.replace('/dashboard');
    } else {
        const err = await response.json();
        console.log(err)
        showModal('Failed to edit post');
    }
};

$(document).ready(() => {
$('.edit-form').on('submit', (e) => editor(e));
})