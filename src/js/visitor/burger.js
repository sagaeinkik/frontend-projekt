'use strict';

//knapp
const button = document.getElementById('burgerbtn');
//Mobilmeny
const mobileMenu = document.querySelector('nav.mobile ul');

button.addEventListener('click', (e) => {
    // Förhindra att klicket bubblar upp till document
    e.stopPropagation();
    //Toggla klasser
    button.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

// Stäng menyn vid klick utanför
document.addEventListener('click', (e) => {
    // Kolla om klicket skedde inuti hela menyområdet eller på knappen
    const clickInsideMenu = mobileMenu.contains(e.target);
    const clickOnButton = button.contains(e.target);

    if (!clickInsideMenu && !clickOnButton) {
        // Om klicket inte skedde inuti menyn eller på knappen, ta bort 'active' från menyn och knappen
        button.classList.remove('active');
        mobileMenu.classList.remove('active');
    }
});
