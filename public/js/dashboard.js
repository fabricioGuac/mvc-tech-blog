const poster = async (e) => {
    e.preventDefault();
    const title = $('#title').val().trim();
    const content = $('#content').val().trim();

    if(title && content){
        const response =  await fetch('api/post', {
            method: "POST",
            body: JSON.stringify({title, content, date: Date()}),
            headers: {"content-Type": "application/json"},
        });
        if(!response.ok){
            const err = await response.json();
            console.log(err);
            showModal(err.errors[0].message);
        }else{
            location.reload();
            $('.newPost').hide();
        }
    }else{
        showModal('Post must contain a title and content')
    }
}

// const showForm = (e) => {
//     e.preventDefault();

// } 

$(document).ready(()=>{
    $('.post-form').on('submit', (e) => poster(e));
    // $('#newPost').on('click', )
})