'use strict';

/* EVENT LISTENERS */
document.addEventListener('DOMContentLoaded', function (e) {
    fetchReviews();
});

/* VERKTYG */
//Funktion som formatterar datum
function formatDate(datum) {
    let fullDate = new Date(datum);
    let year = fullDate.getFullYear();
    //Se till att det är 2 siffror i månad och dag
    let month = (fullDate.getMonth() + 1).toString().padStart(2, '0');
    let dayOf = fullDate.getDate().toString().padStart(2, '0');
    //Returnera så som det ska vara formatterat
    return `${year}-${month}-${dayOf}`;
}

//Token
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

/* FETCH-ANROP */
//Hämta omdömen som inte är granskade
async function fetchReviews() {
    let url = 'https://projectapi-nn6a.onrender.com/reviews/filter/unapproved';

    try {
        const response = await fetch(url);
        const data = await response.json();

        printReviews(data);
    } catch (error) {
        console.log('Något gick fel vid get /reviews: ' + error);
    }
}

//Ta bort omdömen
async function deleteReview(review) {
    const id = review._id;
    let url = 'https://projectapi-nn6a.onrender.com/reviews/';
    try {
        const response = await fetch(url + id, {
            method: 'DELETE',
            headers: { 'content-type': 'Application/json', Authorization: `Bearer ${jwt}` },
        });
        if (response.ok) {
            location.reload();
        }
    } catch (error) {
        console.log('Något gick fel vid delete /review: ' + error);
    }
}

//Godkänn omdömen
async function approveReview(review) {
    const id = review._id;
    let url = 'https://projectapi-nn6a.onrender.com/reviews/';
    try {
        const response = await fetch(url + id, {
            method: 'PUT',
            headers: { 'content-type': 'Application/json', Authorization: `Bearer ${jwt}` },
        });
        if (response.ok) {
            location.reload();
        }
    } catch (error) {
        console.log('Något gick fel vid put /review: ' + error);
    }
}

/* DOM-MANIPULATION */
function printReviews(data) {
    //review-grid
    const reviewGrid = document.querySelector('.review-grid');
    reviewGrid.innerHTML = '';

    if (!data || data.length < 1) {
        reviewGrid.innerHTML = '<p>Det finns inga omdömen att godkänna..';
        return;
    }

    data.forEach((review) => {
        //Skapa article
        const article = document.createElement('article');

        //div.info
        const infoDiv = document.createElement('div');
        infoDiv.classList.add('info');

        //p.rating
        const ratingP = document.createElement('p');
        ratingP.classList.add('rating');
        ratingP.innerText = 'Betyg: ' + review.rating;
        infoDiv.appendChild(ratingP);

        //p.author
        const authorP = document.createElement('p');
        authorP.classList.add('author');
        authorP.innerText = 'Namn: ' + review.fullName;
        infoDiv.appendChild(authorP);

        //p.comment
        if (review.comment) {
            const commentP = document.createElement('p');
            commentP.classList.add('comment');
            commentP.innerText = 'Kommentar: ' + review.comment;
            infoDiv.appendChild(commentP);
        }

        //p.date
        const dateP = document.createElement('p');
        dateP.classList.add('date');
        dateP.innerText = 'Datum: ' + formatDate(review.posted);
        infoDiv.appendChild(dateP);

        //Div.controls
        const controlsDiv = document.createElement('div');
        controlsDiv.classList.add('controls');

        //button.approve
        const approveBtn = document.createElement('button');
        approveBtn.classList.add('approve');
        approveBtn.innerHTML = `<i class="fa-solid fa-check"></i>`;
        controlsDiv.appendChild(approveBtn);

        //Event listener för att godkänna
        approveBtn.addEventListener('click', () => {
            approveReview(review);
        });

        //Button.remove
        const removeBtn = document.createElement('button');
        removeBtn.classList.add('remove');
        removeBtn.innerHTML = `<i class="fa-regular fa-trash-can"></i>`;
        controlsDiv.appendChild(removeBtn);

        //event listener för att ta bort
        removeBtn.addEventListener('click', () => {
            deleteReview(review);
        });

        //peta in i DOM
        article.appendChild(infoDiv);
        article.appendChild(controlsDiv);

        reviewGrid.appendChild(article);
    });
}
