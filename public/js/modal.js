// Function to show the modal with a custom message
function showModal(message) {
    $('.modal-body').html(`
        <div class="col-12 py-2 jcc">
            <h3 class = "text-dark">${message}</h3>
        </div>
    `)
    $('#exampleModal').modal('show'); 
}


