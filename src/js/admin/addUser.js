'use strict';

//Lägg till användare-formulär
const addUserForm = document.getElementById('user-form');
const errorSpan = document.getElementById('add-user-error');

addUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addUser();
});

//Funktion för att validera input
function validateInput(username, email, password) {
    if (username.length < 1) {
        errorSpan.innerText = 'Du måste ange produktens namn';
        return false;
    } else if (email.length < 1) {
        errorSpan.innerText = 'Du måste ange kategorin';
        return false;
    } else if (password.length < 1) {
        errorSpan.innerText = 'Du måste ange ett pris';
        return false;
    }

    errorSpan.innerText = '';
    return true;
}

//Hämta värdet ur cookie
function getCookie(cookieName) {
    //alla cookies
    const cookies = document.cookie.split(';');
    //Loopa igenom, ta bort white spaces
    for (let cookie of cookies) {
        cookie = cookie.trim();
        //Returnera värdet från och med cookie-namn till slut på string
        if (cookie.startsWith(cookieName)) {
            return cookie.substring(cookieName.length);
        }
    }
}

//Token från cookie, används i anrop
const jwt = getCookie('jwt=');

//Lägg till användare
async function addUser() {
    //Url
    let url = 'https://projectapi-nn6a.onrender.com/signup';
    //Värden
    let username = document.getElementById('username').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    //Validera input
    if (!validateInput(username, email, password)) {
        return;
    }

    //Nytt användarobjekt
    let newUser = {
        username: username,
        email: email,
        password: password,
    };

    //Fetch post-anrop
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'content-type': 'Application/json', Authorization: `Bearer ${jwt}` },
            body: JSON.stringify(newUser),
        });
        if (response.ok) {
            location.reload();
        }
    } catch (error) {
        console.log('Något gick fel vid POST /signup: ' + error);
    }
}
