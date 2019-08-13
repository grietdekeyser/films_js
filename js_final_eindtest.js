/**
 25/9/2017
 * loads a JSON file with window.fetch()
 * ==>2017 Chrome, FF en Edge
 */
'use strict'

// DOM-elementen
var eImg = document.querySelector('.film img');
var eTitel = document.querySelector('.film h2');
var eNummer = document.querySelector('.film h2 small');
var eBeschrijving = document.querySelector('.film p');
var eList = document.querySelector('dl');
var eDT = eList.querySelectorAll('dt');
var eDD = eList.querySelectorAll('dd');
var eButtons = document.querySelectorAll('.navigatie button');

// laad JSON object met fetch = promise
// fetch() en json() support Chrome + FF + Edge
let url = "movies_nows.json";

fetch(url)
    .then(function (response) {
        return response.json(); //nieuwe method returnes a promise
    })
    .then(function (json) {
        //json geladen
        console.log('parsed json', json);       // json object geladen
        //werk hier verder met het json object

        //eerste film toevoegen
        filmToevoegen(json,0);
        //eerste film: vorige inactief
        beschikbareKnoppen(0,json);
        

        for (var i=0; i<eButtons.length; i++) {
            eButtons[i].addEventListener('click', function() {
                var vorigeIndex = eTitel.className;
                var nieuweIndex = "";
                //bepaal nieuwe index
                switch(this.innerHTML){
                    case "vorige":
                        nieuweIndex = parseInt(vorigeIndex) - 1;
                        break;
                    case "volgende":
                        nieuweIndex = parseInt(vorigeIndex) + 1;
                        break;
                }                
                filmToevoegen(json,nieuweIndex);
                //controle: wordt eerste of laatste film weergegeven
                beschikbareKnoppen(nieuweIndex, json);
            })
        }
        
    })
    .catch(function (ex) {
        console.log('parsing failed', ex);
    })

function beschikbareKnoppen(index, array) {
    /* wijzigt beschikbaarheid van de knoppen op basis van de index
    index: number, verplicht, index van de film in array
    array: array, verplicht, array met films
    */
    if (index === 0) {
        //vorige inactief
        eButtons[0].disabled = true;
    }
    else if (index === array.length - 1) {
        //volgende inactief
        eButtons[1].disabled = true;
    }
    else {
        eButtons[0].disabled = false;
        eButtons[1].disabled = false;
    }
}

function filmToevoegen(array, index) {
    /* voegt data van film toe
    array: array van objecten met films, verplicht
    index: index van de film, verplicht
    */

    //verwijder vorige data
    verwijderFilm();
    
    var oFilm = array[index];
    //afbeelding toevoegen
    eImg.src = "movies/" + oFilm.foto;

    //titel toevoegen
    var sTitel = document.createTextNode(oFilm.titel);
    eTitel.insertBefore(sTitel,eNummer);
    eTitel.className = index;

    //filmNr toevoegen
    eNummer.innerHTML = "(" + oFilm.filmNr + ")";

    //beschrijving toevoegen
    var sBeschrijving = document.createTextNode(oFilm.beschrijving);
    eBeschrijving.appendChild(sBeschrijving);

    //regisseur toevoegen (eventueel vanuit array)
    var sRegisseur = arrayNaarString(oFilm.regisseur);
    dlOpvullen('regisseur:', sRegisseur);

    //genres toevoegen (eventueel vanuit array)
    var sGenres = arrayNaarString(oFilm.genres);
    dlOpvullen('genres:', sGenres);

    //duurtijd toevoegen
    dlOpvullen('duurtijd:', oFilm.duur);

    //release toevoegen; kan waarde null hebben
    if (oFilm.release !== null) {
        //lokaal leesbaar formaat
        var dRelease = new Date(oFilm.release.$date);
        dlOpvullen('release:', dRelease.toLocaleDateString());
    }

    //rating toevoegen, kan afwezig zijn
    if (oFilm.rating !== undefined) {
        dlOpvullen('rating:', oFilm.rating);
    }

    //cast toevullen, kan afwezig zijn
    if (oFilm.cast !== undefined) {
        var aCast = oFilm.cast;
        var eCast = document.createElement('ul');
        //array van objecten met cast doorlopen
        for (var i=0; i<aCast.length; i++) {
            //unordered list
            var eActeur = document.createElement('li');
            var sActeur = document.createTextNode(aCast[i].acteur);
            eActeur.appendChild(sActeur);
            eCast.appendChild(eActeur);
        }
        dlOpvullen('cast:', eCast);
    }
}

function arrayNaarString(array) {
    /* zet array om naar string, indien array een array is */
    var sTekst = array
    if (array.constructor == Array) {
        sTekst = array.join(', ');
    }
    return sTekst
}

function dlOpvullen(locatie, waarde) {
    /* vult description list aan
    locatie: string, verplicht, locatie van de in te vullen waarde
    waarde: string, verplicht, in te vullen waarde
    */
    var sTekst = "";
    for (var i=0; i<eDT.length; i++) {
        if (eDT[i].innerHTML == locatie) {
            if (typeof waarde !== "object") {
                sTekst = document.createTextNode(waarde);
            }
            else {
                sTekst = waarde;
            }
            eDT[i].nextSibling.nextSibling.appendChild(sTekst);
        }
    }
}

function verwijderFilm() {
    /* verwijderd vorige film*/
    verwijderChildNode(eTitel);
    verwijderChildNode(eBeschrijving);
    for (var i=0; i<eDD.length; i++) {
        verwijderChildNode(eDD[i]);
    }
}

function verwijderChildNode(elem) {
    /* verwijderd specifieke childnodes (text, ul) van elem
    elem: element, verplicht
    */
    var eChildNodes = elem.childNodes
    for (var i=0; i<eChildNodes.length; i++) {
        if (eChildNodes[i].nodeType === 3) {
            elem.removeChild(eChildNodes[i]);
        }
        else if (eChildNodes[i].nodeName === "UL") {
            elem.removeChild(eChildNodes[i]);
        }
    }
}
