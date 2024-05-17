# Projektuppgift Backendbaserad Webbutveckling del 2

av Saga Einarsdotter Kikajon

## Bakgrund

Projektet går ut på att skapa en RESTful webbtjänst som kan hantera CRUD-operationer, och att skapa både ett användargränssnitt och en webbplats som konsumerar webbtjänsten. Detta ska vara för ett fiktivt företag som sysslar med mat på något vis.  
Jag har valt att göra ett fiktivt café. Både webbplats och användargränssnitt är del av samma sida. Det finns en länk på den webbplats besökarna ser, som leder till en skyddad route som man behöver ha en giltig webtoken för att komma åt. En giltig webbtoken får man bara genom att logga in med korrekta uppgifter.

## Uppbyggnad

Frontend-sidan av projektet är skapat med Parcel som bundler, Sass som preprocessor med scss-syntax, och JavaScript.

## Funktionalitet

En användare kan logga in med giltiga inloggningsuppgifter via en länk i footern (där placerad med flit så att en besökare inte behöver störas av den i exempelvis headern), eller genom att manuellt skriva /login.html i adressfältet.

Väl inloggad kan den "anställde" hantera menyn genom att lägga till nya produkter, redigera befintliga produkter, eller ta bort produkter.  
Användaren kan se omdömen som ännu ej är granskade/godkända för publicering (objekten i databasen har egenskapen approved: false per default). Genom att godkänna ändras den egenskapen till true, och visas då på besökssidan. Användaren kan också välja att ta bort omdömena utan att publicera dem.

Till sist kan användaren lägga till nya användare.

## Begränsningar

Med mer tid hade det varit lämpligt att lägga till begränsningar på användares behörigheter.  
Webbtjänsten har också funktionalitet för att plocka ut specifika produkter baserat på titel och kategori, men i webbplatsen som konsumerar webbtjänsten har istället JavaScript används för att sortera, eftersom det innebär färre HTTP-anrop.

Jag har medvetet valt att inte ge användaren möjlighet att ta bort redan publicerade omdömen. Syftet med det är att företag inte ska ta bort negativa omdömen bara för att de är negativa. Möjligheten att ta bort ett omdöme finns vid granskning, och då är det tänkt att man bara tar bort ett omdöme om det är uppenbart spam, fake eller skadligt på något vis.
