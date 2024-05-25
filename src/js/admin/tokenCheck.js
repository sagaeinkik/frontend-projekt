'use strict';

document.addEventListener('DOMContentLoaded', () => {
    checkUser();
});

//Funktion som hämtar kakor
function getCookie(cookieName) {
    //Lägg alla kakor i array, kolla igenom om en kaka matchar jwt=
    return document.cookie.split(';').some((cookie) => cookie.trim().startsWith(cookieName));
}

//Funktion som kollar om användare har jwt cookie
function checkUser() {
    const tokenCookie = getCookie('jwt=');
    //Om inte cookie finns, skicka till inloggningssidan
    if (!tokenCookie) {
        console.log('Ingen token, omdirigerar');
        if (window.location.pathname !== '/login.html') {
            window.location.href = '/login.html';
        }
    } else {
        console.log('Token hittad');
        if (window.location.pathname !== '/user.html') {
            window.location.href = '/user.html';
        }
    }
}
