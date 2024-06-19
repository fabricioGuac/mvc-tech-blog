const signin = async (e) => {
    e.preventDefault();
    // Gets the form values
    const username = $('#username-signup').val().trim();
    const email = $('#email-signup').val().trim();
    const password = $('#password-signup').val().trim();
    const confirm = $('#confirm-password').val().trim();

    // Compares the passwords
    if(password !== confirm){
        return showModal('Passwords do not match');
    }

    // Ensures the form is complete
    if( username && email && password){
        const response =  await fetch('api/user/signin', {
            method: "POST",
            body: JSON.stringify({username, email, password}),
            headers: {"content-Type": "application/json"},
        });
        if(!response.ok){
            const err = await response.json();
            console.log(err);
            showModal(err.errors[0].message);
        } else {
            document.location.replace('/')
        }
    }else{
        showModal('Make sure to fill all of the form fields');
    }
}

$(document).ready(()=>{
    $('.signup-form').on('submit', (e) => signin(e))
    // $('#log-in').on('click', (e) => {
    //     e.preventDefault();
    //     document.location.replace('/login');
    // })
})