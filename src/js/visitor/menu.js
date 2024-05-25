'use strict';

const categoriesList = document.querySelector('.categories ul'); //UL inuti div.categories
const specificCategory = document.querySelector('.specific-category'); //div.specific-category
const menuGrid = document.querySelector('.menu-grid'); //div med grid-styling

/* Event listeners */

//Sidan laddad:
document.addEventListener('DOMContentLoaded', () => {
    //Anropa funktion som gör fetchanrop
    fetchAll();
});

//Funktion som hämtar alla produkter
async function fetchAll() {
    const url = 'https://projectapi-nn6a.onrender.com/products';
    try {
        const response = await fetch(url);
        const data = await response.json();

        //Funktion som skriver ut till skärmen
        printProducts(data);
    } catch (error) {
        console.log('Något gick fel vid fetch get /products: ' + error);
    }
}

async function printProducts(products) {
    //Kalla funktion som skapar knapparna
    categoryButtons(products);
    //Kalla funktion som skriver ut hela menyn
    printAllProducts(products);
}

//Funktion som plockar ut kategorier ur arrayen
function categorize(products) {
    //Skapa nytt Set
    const categorySet = new Set();
    //Loopa igenom productsn och hitta unika kategorier, lägg till i set
    products.forEach((product) => {
        if (product.category) {
            categorySet.add(product.category);
        }
    });
    //Konvertera set till Array
    let categories = Array.from(categorySet);

    // Sortera kategorier så att de som innehåller ett bindestreck kommer först
    categories.sort((a, b) => {
        const aHasDash = a.includes('-');
        const bHasDash = b.includes('-');
        //Kolla om bindestreck finns i a eller b, ordna i array
        if (aHasDash && !bHasDash) return -1;
        if (!aHasDash && bHasDash) return 1;
        return 0;
    });
    return categories;
}

//Funktion som skapar knappar för produktkategorier
function categoryButtons(products) {
    //Lagra array med kategorier
    let categories = categorize(products);
    //Variabel som ska lagra aktiv knapp
    let currentButton = null;

    //Loopa igenom varje kategori, lägg till i UL för kategorier
    categories.forEach((category) => {
        const listItem = document.createElement('li');
        const catButton = document.createElement('button');
        //Switch-sats för att översätta knapparna
        switch (category) {
            case 'hot-bev':
                catButton.innerText = 'Varma drycker';
                break;
            case 'cold-bev':
                catButton.innerText = 'Kalla drycker';
                break;
            case 'cookies':
                catButton.innerText = 'Kakor';
                break;
            case 'cakes':
                catButton.innerText = 'Tårtor';
                break;
            case 'pastries':
                catButton.innerText = 'Bakelser';
                break;
            case 'salads':
                catButton.innerText = 'Sallader';
                break;
            case 'sandwiches':
                catButton.innerText = 'Mackor';
                break;
        }
        //Peta in i DOM
        listItem.appendChild(catButton);

        //Händelselyssnare på catButton
        catButton.addEventListener('click', () => {
            // Ta bort klassen 'current' från tidigare aktiv knapp
            if (currentButton) {
                currentButton.classList.remove('current');
            }
            // Lägg till klass på klickad knapp
            catButton.classList.add('current');

            // Uppdatera currentButton till den klickade knappen
            currentButton = catButton;

            //Anropa funktion som skriver ut filtrerade produkter
            filterProducts(products, category);
        });
        categoriesList.appendChild(listItem);
    });
}

//Funktion som skriver ut hela menyn
function printAllProducts(products) {
    //Töm tidigare innehåll:
    menuGrid.innerHTML = '';
    //Lagra array med kategorier
    let categories = categorize(products);

    //Loopa igenom kategorierna och skapa en grid item för varje
    categories.forEach((category) => {
        //Div.grid-item
        const gridItemDiv = document.createElement('div');
        gridItemDiv.classList.add('grid-item');

        //Kategori-rubrik
        const h2 = document.createElement('h2');
        switch (category) {
            case 'hot-bev':
                h2.innerText = 'Varma drycker';
                break;
            case 'cold-bev':
                h2.innerText = 'Kalla drycker';
                break;
            case 'cookies':
                h2.innerText = 'Kakor';
                break;
            case 'cakes':
                h2.innerText = 'Tårtor';
                break;
            case 'pastries':
                h2.innerText = 'Bakelser';
                break;
            case 'salads':
                h2.innerText = 'Sallader';
                break;
            case 'sandwiches':
                h2.innerText = 'Mackor';
                break;
        }
        gridItemDiv.appendChild(h2);
        menuGrid.appendChild(gridItemDiv);

        //Ul-element
        const ulEl = document.createElement('ul');

        //Loopa igenom produkterna
        products.forEach((product) => {
            //Leta upp kategori för produkten:
            if (product.category === category) {
                //Li-element
                const liEl = document.createElement('li');
                //Div-element
                const flexItemsDiv = document.createElement('div');
                flexItemsDiv.classList.add('flex-items');
                //Span-prod-name:
                const spanProdEl = document.createElement('span');
                spanProdEl.classList.add('prod-name');
                spanProdEl.textContent = product.name;
                //Span price
                const spanPriceEl = document.createElement('span');
                spanPriceEl.classList.add('price');
                spanPriceEl.textContent = product.price;
                //Peta in span-element i div.flex-items:
                flexItemsDiv.appendChild(spanProdEl);
                flexItemsDiv.appendChild(spanPriceEl);
                liEl.appendChild(flexItemsDiv);

                //Lägg till beskrivning om det finns
                if (product.description) {
                    //p-element:
                    const descP = document.createElement('p');
                    descP.classList.add('description');
                    descP.textContent = product.description;
                    liEl.appendChild(descP);
                }
                //Lägg in allt i ul
                ulEl.appendChild(liEl);
                gridItemDiv.appendChild(ulEl);
            }
        });
    });
}

//Funktion som bara visar filtrerade produkter
function filterProducts(products, selectedCategory) {
    //Töm menu-grid
    menuGrid.innerHTML = '';
    //Töm specificCategory
    specificCategory.innerHTML = '';

    //Skapa rubrik
    const h2 = document.createElement('h2');
    //Switch-sats
    switch (selectedCategory) {
        case 'hot-bev':
            h2.innerText = 'Varma drycker';
            break;
        case 'cold-bev':
            h2.innerText = 'Kalla drycker';
            break;
        case 'cookies':
            h2.innerText = 'Kakor';
            break;
        case 'cakes':
            h2.innerText = 'Tårtor';
            break;
        case 'pastries':
            h2.innerText = 'Bakelser';
            break;
        case 'salads':
            h2.innerText = 'Sallader';
            break;
        case 'sandwiches':
            h2.innerText = 'Mackor';
            break;
    }
    specificCategory.appendChild(h2);

    //Skapa UL
    const ulEl = document.createElement('ul');

    // Filtrera produkterna baserat på vald kategori
    const filteredProducts = products.filter((product) => product.category === selectedCategory);

    //loopa igenom filtrerade produkter
    filteredProducts.forEach((product) => {
        //Li-element
        const liEl = document.createElement('li');
        //Div.flex-items
        const divEl = document.createElement('div');
        divEl.classList.add('flex-items');

        //Span-prod-name
        const spanProdName = document.createElement('span');
        spanProdName.classList.add('prod-name');
        spanProdName.textContent = product.name;

        //Span prod-price
        const spanPrice = document.createElement('span');
        spanPrice.classList.add('price');
        spanPrice.textContent = product.price;

        //Peta in span-element i DOM
        divEl.appendChild(spanProdName);
        divEl.appendChild(spanPrice);
        liEl.appendChild(divEl);

        //Kolla om beskrivning finns
        if (product.description) {
            //p-element:
            const descP = document.createElement('p');
            descP.classList.add('description');
            descP.textContent = product.description;
            liEl.appendChild(descP);
        }
        //Peta in i UL och specific category
        ulEl.appendChild(liEl);
        specificCategory.appendChild(ulEl);
    });
}
