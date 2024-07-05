const poster = async (e) => {
    e.preventDefault();
    const title = $('#title').val().trim();
    const content = $('#content').val().trim();
    const img = $('#image').prop('files')[0];


    if(title && content){
    let base64 = "";

    if (img && img.files.length > 0){
        const imgFile = img.files[0];
        base64 = await base64Encoder(imgFile);
    }

    try {
        // Makes the api call
        const response = await fetch('/api/post', {
            method: "POST",
            body: JSON.stringify({title, content, image: base64 || undefined}),
            headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
            // Logs the error and sends shows the error in the modal
            const err = await response.json();
            console.error(err);
            showModal(`Error making the post`);
        } else {
            // Sents the user back to the dashboard if the response is ok
            document.location.replace('/dashboard');
        }

    } catch (err) {
        console.error('Error:', err);
        showModal('Failed to make the post. Please try again.');
    }
} else {
    showModal('Post must contain a title and content');
}
}

// Function that converts an image file into a base 64 string
const base64Encoder = (img) => {
    // Creates a new promise
    return new Promise((res, rej) => {
        // Creates a new instances of FileReader
        const reader = new FileReader();
        // Converts the image file to data URL
        reader.readAsDataURL(img);
        // Extracts the base64-encoded content from the data URL by removing the 'data:' prefix and filtering out any non-base64 characters using regex
        reader.onload = () => res(reader.result.replace("data:", "").replace(/^.+,/, ""));
        // Reject the promise if there is an error while reading the image
        reader.onerror = error => rej(error);
    });
}

// Document.ready to ensure the page is fully loaded before adding the event listener
$(document).ready(() => {
    $('.post-form').on('submit', (e) => {poster(e)})
})