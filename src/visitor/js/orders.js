'use strict';

const form = document.getElementById('fakeform'); //Formulär
const errorSpan = document.querySelector('.error'); //Span.error

form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitForm();
});

//Validera input
function validateInput(name, email, description) {
    if (name.length < 1) {
        errorSpan.innerText = 'Du måste fylla i ditt namn';
        return false;
    } else if (email.length < 1) {
        errorSpan.innerText = 'Du måste fylla i en epost-adress';
        return false;
    } else if (!email.includes('@') && !email.includes('.')) {
        errorSpan.innerText = 'Du måste fylla i en giltig epost-adress';
        return false;
    } else if (description.length < 1) {
        errorSpan.innerText = 'Vänligen beskriv vad du vill beställa.';
        return false;
    }

    errorSpan.innerText = '';
    return true;
}

function submitForm() {
    //fält
    let name = document.getElementById('namn').value;
    let email = document.getElementById('email').value;
    let desc = document.getElementById('desc').value;

    if (!validateInput(name, email, desc)) {
        return;
    } else {
        form.innerHTML =
            '<p>Tack för visat intresse! Våra kollegor kommer att granska din förfrågan och återkommer via de kontaktuppgifter du har lämnat.</p>';
    }
}
