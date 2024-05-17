'use strict';

//knapp
const button = document.getElementById('burgerbtn');
//Mobilmeny
const mobileMenu = document.querySelector('nav.mobile ul');

button.addEventListener('click', () => {
    button.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});
