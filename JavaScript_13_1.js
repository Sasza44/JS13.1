"use strict";

const button = document.querySelector('.currency-rates');
button.addEventListener('click', updateCurrencyRates);
function updateCurrencyRates(){
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            //console.log(xhr.responseText);

            // шукаємо назви валют
            let ind1 = [];
            let ind = 0;
            let pos = 0;
            while(ind != -1){
                ind = xhr.responseText.indexOf('"txt":"', pos);
                ind1.push(ind);
                pos = ind + 1;
            }
            ind1.pop();
            //console.log(ind1);

            // шукаємо курси валют
            let ind2 = [];
            ind = 0;
            pos = 0;
            while(ind != -1){
                ind = xhr.responseText.indexOf('","rate":', pos);
                ind2.push(ind);
                pos = ind + 1;
            }
            ind2.pop();
            //console.log(ind2);

            // індекси, де закінчуються цифри
            let ind3 = [];
            ind = 0;
            pos = 0;
            while(ind != -1){
                ind = xhr.responseText.indexOf(',"cc":"', pos);
                ind3.push(ind);
                pos = ind + 1;
            }
            ind3.pop();
            //console.log(ind2);

            // виводимо назви валют
            let names = [];
            for(let i = 0; i < ind1.length; i++){
                names[i] = xhr.responseText.substring(ind1[i] + 7, ind2[i]);
            }
            //console.log(names);

            // виводимо курси валют
            let rates = [];
            for(let i = 0; i < ind1.length; i++){
                rates[i] = xhr.responseText.substring(ind2[i] + 9, ind3[i]);
            }
            //console.log(rates);

            // виводимо тільки ті валюти, у яких курс більший 25 грн.
            let names1 = [];
            let rates1 = [];
            for(let i = 0; i < rates.length; i++){
                if(rates[i] > 25){
                    rates1.push(rates[i]);
                    names1.push(names[i]);
                }
            }
            console.log(names1);
            console.log(rates1);
            let rows = [];
            let table = document.querySelector('table');
            for(let i = 0; i < names1.length; i++){
                rows[i] = table.insertRow(i);
                rows[i].insertCell(0).innerHTML = names1[i];
                rows[i].insertCell(1).innerHTML = rates1[i];
            }
        }
    }

    xhr.addEventListener('error', () => {
        //console.log('error');
        let err = document.createElement('div');
        document.body.appendChild(err);
        err.innerHTML = 'error';
    });

    xhr.open('GET', 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
    xhr.send();
}