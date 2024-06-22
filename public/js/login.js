const login = async (e) => {
    e.preventDefault();
    // Gets the form values
    const email = $('#email').val().trim();
    const password = $('#password').val().trim();

    // Checks that the form is complete
    if(email && password){
        // Makes the api call
        const response =  await fetch('api/user/login', {
            method: "POST",
            body: JSON.stringify({email, password}),
            headers: {"content-Type": "application/json"},
        });
        if(!response.ok){
            // Logs the error and show the modal with the error
            const err = await response.json();
            console.log(err)
            showModal(err.message);
        }else{
            // Redirects the user to the homepage
            document.location.replace('/');
        }
    }else{
    showModal('Make sure to fill all of the form fields');
    }
}

// Document.ready to ensure the page is fully loaded before adding the event listener
$(document).ready(()=>{
    $('.login-form').on('submit', (e) => login(e));
})