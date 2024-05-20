'use strict';

//Variabler
const reviewsContainer = document.querySelector('.reviews-container'); // Container för omdömen
const form = document.querySelector('form'); // Formulär
let errorSpan = document.querySelector('.error'); //Span-element för error

//event listener som anropar fetchreviews direkt
document.addEventListener('DOMContentLoaded', (e) => {
    fetchReviews();
});

//event listener för formulär
form.addEventListener('submit', (e) => {
    e.preventDefault();
    postReview();
});

//Funktion som avkodar html-escape
function decodeHtmlEntities(str) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = str;
    return textarea.value;
}

//Funktion för att validera input
function validateInput(fullName, email, rating) {
    if (fullName.length < 1) {
        errorSpan.innerText = 'Du måste ange ditt namn';
        return false;
    } else if (email.length < 1) {
        errorSpan.innerText = 'Du måste ange en epost-adress';
        return false;
    } else if (!rating || rating.length < 1) {
        errorSpan.innerText = 'Du måste välja betyg!';
        return false;
    }
    errorSpan.innerText = '';
    return true;
}

//Funktion som gör fetch get-anrop till reviews
async function fetchReviews() {
    let url = 'https://projectapi-nn6a.onrender.com/reviews/filter/approved'; // URL för fetchanrop
    try {
        const response = await fetch(url);
        const reviews = await response.json();
        //Anropa funktion som skriver ut resultat
        printReviews(reviews);
    } catch (error) {
        console.log('Något gick fel vid fetch get /reviews: ' + error);
        reviewsContainer.innerText = 'Något gick fel vid hämtning..';
    }
}

//Funktion som gör fetch post-anrop
async function postReview() {
    let url = 'https://projectapi-nn6a.onrender.com/reviews'; // URL för fetchanrop
    //Värden
    let fullName = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let ratingInput = document.querySelector('input[name="rating"]:checked');
    //Kolla värdena hittills:
    if (!validateInput(fullName, email, ratingInput)) {
        //avbryt om ej valid
        return;
    }
    //Tilldela rating-value
    let rating = ratingInput.value;
    let comment = document.getElementById('kommentar').value;
    //Godkänt-span
    const approvedSpan = document.getElementById('approved');
    approvedSpan.innerHTML = '';

    //Fetchanrop
    try {
        const newReview = {
            fullName,
            email,
            rating,
        };
        if (comment) {
            newReview.comment = comment;
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'Application/json',
            },
            //Skicka med objektet
            body: JSON.stringify(newReview),
        });

        //Kolla om man får några error-svar
        if (!response.ok) {
            const errorMessage = await response.json();
            // Visa detaljerade felmeddelanden
            if (errorMessage.errors && errorMessage.errors.length > 0) {
                errorSpan.innerHTML = errorMessage.errors.join(', ');
            } else {
                // Visa ett generellt felmeddelande om det inte finns några detaljerade fel
                errorSpan.innerHTML = 'Något gick fel! Konsultera Saga.';
            }
            return;
        } else {
            approvedSpan.innerHTML =
                'Ditt omdöme har skickats in och publiceras så fort det är granskat!';
            //Töm fält
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('kommentar').value = '';
            // Nollställ radioknapparna
            document.querySelectorAll('input[name="rating"]').forEach((radioButton) => {
                radioButton.checked = false;
            });
        }
    } catch (error) {
        console.log('Något gick fel vid fetch post /reviews: ' + error);
        errorSpan.innerHTML = error;
    }
}

//Funktion som skriver ut resultaten till skärmen
function printReviews(reviews) {
    //Kolla om det finns några reviews
    if (!reviews || reviews.length < 1) {
        reviewsContainer.innerText = 'Bli först med att lämna ett omdöme!';
        return;
    }

    //Töm skärm
    reviewsContainer.innerHTML = '';
    reviews.forEach((review) => {
        //DOM-Manipulation

        //article-element
        const article = document.createElement('article');
        article.classList.add('review-item');

        //Div.stars
        const starsDiv = document.createElement('div');
        starsDiv.classList.add('stars');

        //Stars
        const stars = printStars(review.rating);
        starsDiv.innerHTML = stars;
        article.appendChild(starsDiv);

        //Kommentarstext
        if (review.comment) {
            const commentP = document.createElement('p');
            commentP.classList.add('comment');
            //Avkoda tecken först
            const commentText = document.createTextNode(decodeHtmlEntities(review.comment));
            commentP.appendChild(commentText);
            article.appendChild(commentP);
        }

        //Författare
        const authorP = document.createElement('p');
        authorP.classList.add('author');
        //Avkoda tecken
        const author = document.createTextNode(decodeHtmlEntities(review.fullName));
        authorP.appendChild(author);
        article.appendChild(authorP);

        //Datum
        const dateP = document.createElement('p');
        dateP.classList.add('date');
        //Formattera datumet
        const date = document.createTextNode(dateFormatter(review.posted));
        dateP.appendChild(date);
        article.appendChild(dateP);

        reviewsContainer.appendChild(article);
    });
}

//Funktion som omvandlar rating till stjärnor
function printStars(rating) {
    let stars = '';

    //Skapa ifyllda stjärnor: loopa igenom rating
    for (let i = 0; i < rating; i++) {
        stars += `<span class="star"><i class="fa-solid fa-star"></i></span>`;
    }
    //Skapa tomma stjärnor: loopa igenom från rating till 5
    for (let i = rating; i < 5; i++) {
        stars += `<span class="star"><i class="fa-regular fa-star"></i></span>`;
    }
    return stars;
}

//Funktion som hanterar datum
function dateFormatter(date) {
    const fullDate = new Date(date);
    const year = fullDate.getFullYear();
    const month = (fullDate.getMonth() + 1).toString().padStart(2, '0');
    const day = fullDate.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}
