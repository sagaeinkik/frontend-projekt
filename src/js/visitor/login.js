'use strict';

const loginForm = document.getElementById('loginform'); //Formulär
const errorSpan = document.querySelector('.error');
const loginButton = document.getElementById('login-btn');
let apiUrl = 'https://projectapi-nn6a.onrender.com/';

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    loginUser();
});

async function loginUser() {
    console.log('loginUser() kallad');
    //Nollställ error
    errorSpan.innerText = '';
    loginButton.innerText = 'Logga in';

    //Hitta värden
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    //Fetchanrop till post /login
    try {
        loginButton.innerText = 'Loggar in...';
        const response = await fetch(apiUrl + 'login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-type': 'application/json' },
        });
        const data = await response.json();

        //Kolla om data innehåller error
        if (data.errors) {
            errorSpan.textContent = data.errors.message;
            return;
        }

        //Ta token och peta in i en cookie
        const token = data.token;
        document.cookie = `jwt=${token}; max-age=10800; path=/;`; //3h, samma som JWT-token

        //Fetchanrop till protected route med hjälp av token
        const protectedRes = await fetch(apiUrl + 'protected', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const protectedData = await protectedRes.json();

        //Kolla om svaret är granted:
        if (protectedData.message === 'Access granted') {
            //Lagra användarnamnet i storage
            sessionStorage.setItem('username', JSON.stringify(protectedData.username));
            //Skicka till inloggade sidan
            location.href = '/user.html';
        } else {
            errorSpan.innerText = 'Felaktig token: kunde ej logga in.';
        }
    } catch (error) {
        console.log('Något gick fel vid GET /protected: ' + error);
        errorSpan.innerText = error;
    }
}
