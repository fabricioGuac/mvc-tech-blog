const login = async (e) => {
    e.preventDefault();
    // Gets the form values
    const email = $('#email').val().trim();
    const password = $('#password').val().trim();

    if(email && password){
        const response =  await fetch('api/user/login', {
            method: "POST",
            body: JSON.stringify({email, password}),
            headers: {"content-Type": "application/json"},
        });
        if(!response.ok){
            const err = await response.json();
            showModal(err.message);
        }else{
            document.location.replace('/');
        }
    }else{
    showModal('Make sure to fill all of the form fields');
    }
}

$(document).ready(()=>{
    $('.login-form').on('submit', (e) => login(e));
    $('#sign-in').on('click', (e) => {
        e.preventDefault();
        document.location.replace('/signup');
    })
})