'use strict';

//Händelselyssnare för sidan
document.addEventListener('DOMContentLoaded', function (e) {
    getUsername();
    getLog();
});

//Funktion för att logga ut
const logoutLink = document.getElementById('logout');
logoutLink.addEventListener('click', (e) => {
    //Töm storage
    sessionStorage.clear();
    //ändra cookiens expiration-date till redan passerat datum
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
});

//Skriv ut användarnamnet till skärmen
function getUsername() {
    let username = sessionStorage.getItem('username');
    //Ta bort citattecken
    username = username.replace(/^"(.*)"$/, '$1');

    const loggedInP = document.querySelector('.inloggad');
    loggedInP.innerText = 'Inloggad som ' + username + '.';
}

//Fetch-anrop för logg
async function getLog() {
    const url = 'https://projectapi-nn6a.onrender.com/logs';
    try {
        const response = await fetch(url);
        const data = await response.json();

        //Anropa funktion som skriver ut loggar till skärmen
        printLog(data);
    } catch (error) {
        console.log('Något gick fel vid fetch get /logs: ' + error);
    }
}

//Funktion som skriver ut loggen
function printLog(data) {
    //Tabell
    const table = document.querySelector('tbody');

    if (!data || data.length < 1) {
        const noDataP = document.getElementById('nodata');
        noDataP.innerText = 'Det finns inga loggar att visa...';
        return;
    }

    data.forEach((log) => {
        //Skapa ny table row
        const trEl = document.createElement('tr');

        //Td med kollektion
        const tdColl = document.createElement('td');
        tdColl.innerText = log.collectionName;

        //Td med dokumentID
        const tdId = document.createElement('td');
        tdId.innerText = log.documentId;

        //Td med action
        const tdAct = document.createElement('td');
        tdAct.innerText = log.action;

        //Td med vem
        const tdWho = document.createElement('td');
        tdWho.innerText = log.username;

        //td med datum (formatterat)
        const tdDate = document.createElement('td');
        tdDate.innerText = formatDate(log.timestamp);

        //append
        trEl.appendChild(tdColl);
        trEl.appendChild(tdId);
        trEl.appendChild(tdAct);
        trEl.appendChild(tdWho);
        trEl.appendChild(tdDate);
        table.appendChild(trEl);
    });
}

//Funktion som formatterar datum
function formatDate(datum) {
    let fullDate = new Date(datum);
    let year = fullDate.getFullYear();
    //Se till att det är 2 siffror i månad och dag
    let month = (fullDate.getMonth() + 1).toString().padStart(2, '0');
    let dayOf = fullDate.getDate().toString().padStart(2, '0');

    //tid:
    let hour = fullDate.getHours().toString().padStart(2, '0');
    let minute = fullDate.getMinutes().toString().padStart(2, '0');
    //Returnera så som det ska vara formatterat
    return `${year}-${month}-${dayOf} kl ${hour}:${minute}`;
}
