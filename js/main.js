window.onload = async() => {
    /***
     * INFO: Az XHR technológia manapság már sokak által
     * elavultnak gondolt technológia AJAX kérések lebonyolítására
     * kivéve az XHR2. Azonban a fetch egy könnyebben használható
     * lehetőség AJAX kérésekhez.
     */

    await fetch('js/data.txt').then((res) => res)
        .then(response => {
            response.text().then(function(text) {
                console.log(text);
            });
        }).catch(error => console.log(error));


    /* 
     * Cross-Origin kérés blokkolva:
     * Az azonos eredet házirend nem engedélyezi a távoli erőforrás olvasását innen:
     * file:///C:/Users/gulya/Desktop/web4-1/webprog4-beadando1/proba.txt.
     * (Ok: A CORS kérés nem HTTP). 
     * 
     * CORS problémák miatt azonban nem futtatható a projekt webszerver nélkül. 
     * https://stackoverflow.com/questions/10636611/how-does-access-control-allow-origin-header-work
     * 
     * A megoldás a projekt webszerveren való futtatása, bármilyen szerveroldali nyelv segítsége nélkül.
     * A fájlt immáron a szerver fogja szolgáltatni és nem a kliens.
     */
};