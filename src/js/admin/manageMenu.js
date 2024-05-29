'use strict';

let errorSpan = document.getElementById('add-error');

//Fäll ut lägg till-formulär när man trycker på knappen
const addNewBtn = document.getElementById('add-new');
addNewBtn.addEventListener('click', (e) => {
    const addForm = document.getElementById('add-menu');
    addForm.style.display = 'block';
});

//Funktioner som körs när sidan laddats
document.addEventListener('DOMContentLoaded', function (e) {
    fetchProducts();
});

//Formulär för att lägga till ny produkt
const addMenuForm = document.getElementById('add-menu');
addMenuForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addProduct();
});

/* VERKTYGSFUNKTIONER */

//Funktion för att validera input
function validateInput(name, category, price) {
    if (name.length < 1) {
        errorSpan.innerText = 'Du måste ange produktens namn';
        return false;
    } else if (category.length < 1) {
        errorSpan.innerText = 'Du måste ange kategorin';
        return false;
    } else if (description.length > 250) {
        errorSpan.innertText = 'Beskrivningen får inte vara mer än 250 tecken lång.';
        return false;
    } else if (price.length < 1) {
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

/* FETCHANROP */

//Gör fetch till products
async function fetchProducts() {
    let url = 'https://projectapi-nn6a.onrender.com/products';
    try {
        const response = await fetch(url);
        const data = await response.json();

        printProducts(data);
    } catch (error) {
        console.log('Något gick fel vid fetch get /products: ' + error);
    }
}

//Skriv ut produkter till skärmen
function printProducts(data) {
    const menuListDiv = document.querySelector('.menu-list');
    menuListDiv.innerHTML = '';
    if (!data || data.length < 1) {
        menuListDiv.innerHTML = '<p>Det finns inga produkter inlagda..</p>';
        return;
    }

    data.forEach((product) => {
        //Skapa article-element
        const article = document.createElement('article');

        //div.info
        const infoDiv = document.createElement('div');
        infoDiv.classList.add('info');

        //P.title
        const titleP = document.createElement('p');
        titleP.classList.add('title');
        titleP.innerText = 'Artikel: ' + product.name;
        infoDiv.appendChild(titleP);

        //P.category
        const catP = document.createElement('p');
        catP.classList.add('category');
        //avgör innerText
        switch (product.category) {
            case 'hot-bev':
                catP.innerText = 'Kategori: Varma drycker';
                break;
            case 'cold-bev':
                catP.innerText = 'Kategori: Kalla drycker';
                break;
            case 'cookies':
                catP.innerText = 'Kategori: Kakor';
                break;
            case 'cakes':
                catP.innerText = 'Kategori: Tårtor';
                break;
            case 'pastries':
                catP.innerText = 'Kategori: Bakelser';
                break;
            case 'salads':
                catP.innerText = 'Kategori: Sallader';
                break;
            case 'sandwiches':
                catP.innerText = 'Kategori: Mackor';
                break;
        }
        infoDiv.appendChild(catP);

        //P.desc
        if (product.description) {
            const descP = document.createElement('p');
            descP.classList.add('desc');
            descP.innerText = 'Beskrivning: ' + product.description;
            infoDiv.appendChild(descP);
        }

        //P.price
        const priceP = document.createElement('p');
        priceP.classList.add('price');
        priceP.innerText = 'Pris: ' + product.price;
        infoDiv.appendChild(priceP);

        article.appendChild(infoDiv);

        //Div.controls
        const controlsDiv = document.createElement('div');
        controlsDiv.classList.add('controls');

        //Button.edit
        const editBtn = document.createElement('button');
        editBtn.classList.add('edit');
        editBtn.innerText = 'Ändra';

        //Button.delete
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete');
        deleteBtn.innerText = 'Radera';

        controlsDiv.appendChild(editBtn);
        controlsDiv.appendChild(deleteBtn);
        article.appendChild(controlsDiv);
        menuListDiv.appendChild(article);
    });
}

//Funktion för att lägga till ny produkt
async function addProduct() {
    let url = 'https://projectapi-nn6a.onrender.com/products';
    //token från cookie
    const jwt = getCookie('jwt=');
    //Värdena
    let name = document.getElementById('name').value;
    let category = document.getElementById('category').value;
    let description = document.getElementById('description').value;
    let price = document.getElementById('price').value;

    //Validera
    if (!validateInput(name, category, price)) {
        return;
    }

    let newProduct = {
        name: name,
        category: category,
        price: price,
    };

    if (description) {
        newProduct.description = description;
    }

    //Gör fetch-anrop
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'content-type': 'Application/json', Authorization: `Bearer ${jwt}` },
            body: JSON.stringify(newProduct),
        });
        if (response.ok) {
            document.getElementById('name').value = '';
            document.getElementById('category').value = '';
            document.getElementById('description').value = '';
            document.getElementById('price').value = '';

            errorSpan.classList.remove('error');
            errorSpan.classList.add('added');
            errorSpan.innerText = 'Produkten tillagd!';
        }
    } catch (error) {
        console.log('Något gick fel vid post /products: ' + error);
        errorSpan.innerText = error;
    }
}
