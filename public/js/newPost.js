const poster = async (e, img) => {
    e.preventDefault();
    const title = $('#title').val().trim();
    const content = $('#content').val().trim();


    if(title && content){
    let imgUrl = "";

    if (img){
        imgUrl = await base64Encoder(img);
    }

    try {
        // Makes the api call
        const response = await fetch('/api/post', {
            method: "POST",
            body: JSON.stringify({title, content, image: imgUrl || undefined}),
            headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
            // Logs the error and sends shows the error in the modal
            const err = await response.json();
            console.error(err);
            showModal(`Error making the post ${err.message}`);
        } else {
            // Sents the user back to the dashboard if the response is ok
            document.location.replace('/dashboard');
        }

    } catch (err) {
        console.error('Error:', err);
        if (err.message !== undefined){
            showModal(err.message);
        } else {
        showModal('Failed to make the post. Please try again.');
        }
    }
} else {
    showModal('Post must contain a title and content');
}
}


const base64Encoder = (img) => {
    // Creates a new promise
    return new Promise((res, rej) => {
        // Creates a new instance of FileReader
        const reader = new FileReader();
        
        // Converts the image file to data URL
        reader.readAsDataURL(img);
        
        // Respond with the image url
        reader.onload = () => res(reader.result);
        
        // Reject the promise if there is an error while reading the image
        reader.onerror = (error) => rej(error);
    });
}

// Document.ready to ensure the page is fully loaded before adding the event listener
$(document).ready(() => {
    let img = undefined;
    $('#image').on('change', function() {
        img = $(this).prop('files')[0];
        console.log(img);
    });
    $('.post-form').on('submit', (e) => {poster(e, img)})
})