'use strict';

/* EVENT LISTENERS */

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

//formulär för ändra produkt
const changeMenuForm = document.getElementById('change-menu');
changeMenuForm.addEventListener('submit', (e) => {
    e.preventDefault();
    updateProduct();
});

/* VERKTYGSFUNKTIONER */

//Funktion för att validera input
function validateInput(name, category, price, errorSpan) {
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

//Token från cookie, används i anrop
const jwt = getCookie('jwt=');

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

//Funktion för att lägga till ny produkt
async function addProduct() {
    //Errorspan
    let errorSpan = document.getElementById('add-error');
    //URL
    let url = 'https://projectapi-nn6a.onrender.com/products';
    //Värdena
    let name = document.getElementById('name').value;
    let category = document.getElementById('category').value;
    let description = document.getElementById('description').value;
    let price = document.getElementById('price').value;

    //Validera
    if (!validateInput(name, category, price, errorSpan)) {
        return;
    }

    //Nytt objekt
    let newProduct = {
        name: name,
        category: category,
        price: price,
    };
    //Kolla om beskrivning finns; isåfall, lägg till
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
        //Om allt gick bra töm fält och skriv till skärm
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

//Uppdatera produkten i databasen
async function updateProduct() {
    //Errorspan
    let errorSpan2 = document.getElementById('change-error');
    //Fäll ut formulär
    const changeForm = document.getElementById('change-menu');
    //Hämta produktens ID
    const productId = changeForm.dataset.productId;

    //Nya värden
    let newName = document.getElementById('changename').value;
    let newCategory = document.getElementById('changecategory').value;
    let newDescription = document.getElementById('changedescription').value;
    let newPrice = document.getElementById('changeprice').value;

    // Validera input
    if (!validateInput(newName, newCategory, newPrice, errorSpan2)) {
        return;
    }

    //Objekt med nya värden
    let changedProduct = {
        name: newName,
        category: newCategory,
        price: newPrice,
    };
    if (newDescription.length < 1) {
        changedProduct.description = newDescription;
    } else {
        //Ta bort egenskapen helt om det är en tom sträng
        delete changedProduct.description;
    }

    //URL
    let url = 'https://projectapi-nn6a.onrender.com/products/' + productId;

    // Gör fetchanrop för PUT
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'Application/json', Authorization: `Bearer ${jwt}` },
            body: JSON.stringify(changedProduct),
        });
        //Om ok, töm fält och skriv till skärm
        if (response.ok) {
            document.getElementById('changename').value = '';
            document.getElementById('changecategory').value = '';
            document.getElementById('changedescription').value = '';
            document.getElementById('changeprice').value = '';

            errorSpan2.classList.remove('error');
            errorSpan2.classList.add('added');
            errorSpan2.innerText = 'Produkten ändrad!';
        }
    } catch (error) {
        console.log('Något gick fel vid PUT /products: ' + error);
        errorSpan2.innerText = error;
    }
}

//Ta bort produkter
async function deleteProduct(product) {
    const productId = product._id;
    let url = 'https://projectapi-nn6a.onrender.com/products/' + productId;

    //Försök ta bort
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: { 'Content-Type': 'Application/json', Authorization: `Bearer ${jwt}` },
        });
        const result = await response.json();
        console.log(result);
        //ladda om sidan för att menyn ska uppdatears
        location.reload();
    } catch (error) {
        console.log('Något gick fel vid Delete products/id: ' + error);
    }
}

/* DOM-MANIPULERANDE FUNKTIONER */

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

        //event listener för ändringar
        editBtn.addEventListener('click', (e) => {
            editProduct(product);
        });

        //Button.delete
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete');
        deleteBtn.innerText = 'Radera';

        //event listener för radera
        deleteBtn.addEventListener('click', (e) => {
            deleteProduct(product);
        });

        controlsDiv.appendChild(editBtn);
        controlsDiv.appendChild(deleteBtn);
        article.appendChild(controlsDiv);
        menuListDiv.appendChild(article);
    });
}

//Funktion för att fylla i produktens värden
function editProduct(product) {
    let errorSpan = document.getElementById('change-error');
    const changeForm = document.getElementById('change-menu');

    // Rensa felmeddelandet innan formuläret visas
    errorSpan.innerText = '';
    errorSpan.classList.remove('error', 'added');

    changeForm.style.display = 'block';
    window.location.href = '#change-menu';

    // Fyll i värdena
    document.getElementById('changename').value = product.name;
    document.getElementById('changecategory').value = product.category;
    document.getElementById('changedescription').value = product.description;
    document.getElementById('changeprice').value = product.price;

    // Spara produktens id i formuläret eller som en global variabel
    changeForm.dataset.productId = product._id;
}
