const svgMultiply = `
    <svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" version="1.1" x="0px" y="0px" viewBox="0 0 823.93427 1029.8962375" enable-background="new 0 0 2000 2000" xml:space="preserve"><path style="" d="m 776.75678,0 c -12.064,0 -24.124,4.608 -33.345,13.828 L 411.94378,345.27301 80.52575,13.879 c -18.443,-18.441 -48.255,-18.441 -66.695,0 -18.441,18.44 -18.441,48.244 0,66.685 l 331.418,331.39601 -331.418,331.399 c -18.441,18.44 -18.441,48.25 0,66.691 9.198,9.198 21.272,13.817 33.347,13.817 12.073,0 24.15,-4.619 33.348,-13.817 l 331.41803,-331.398 331.468,331.445 c 9.197,9.198 21.271,13.82 33.345,13.82 12.074,0 24.101,-4.622 33.346,-13.82 18.442,-18.441 18.442,-48.247 0,-66.687 l -331.464,-331.446 331.464,-331.44501 c 18.442,-18.441 18.442,-48.25 0,-66.691 C 800.88178,4.608 788.81678,0 776.75678,0 Z" fill="#666666"/></svg>
`;
const svgEquals = `
    <svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" version="1.1" x="0px" y="0px" viewBox="0 0 100 125"><g transform="translate(0,-952.36218)"><path style="text-indent:0;text-transform:none;direction:ltr;block-progression:tb;baseline-shift:baseline;color:#000000;enable-background:accumulate;" d="m 23,991.36218 c -1.10457,0 -2,0.8954 -2,2 0,1.1045 0.89543,2 2,2 l 54,0 c 1.10457,0 2,-0.8955 2,-2 0,-1.1046 -0.89543,-2 -2,-2 l -54,0 z m 0,18.00002 c -1.10457,0 -2,0.8954 -2,2 0,1.1045 0.89543,2 2,2 l 54,0 c 1.10457,0 2,-0.8955 2,-2 0,-1.1046 -0.89543,-2 -2,-2 l -54,0 z" fill="#666666" fill-opacity="1" stroke="none" marker="none" visibility="visible" display="inline" overflow="visible"/></g></svg>
`;


function validateInput(input) {
    const catchPoundChar = isNaN(input.charAt(0));
    const currencyValidation = new RegExp(/(?=.)^\£?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)?(\.[0-9]{1,2})?p?$/);
    if (input.match(currencyValidation) && (!catchPoundChar || catchPoundChar && input.length > 1)) {
        return true;
    }
    return false;
}

function whichCoins(input, totals, i) {
    const coins = [200, 100, 50, 20, 10, 5, 2, 1];
    if (i < coins.length) {
        const remainder = input % coins[i];
        const numberOfCoin = (input - remainder) / coins[i];
        if (numberOfCoin) {
            totals.push({
                coin: coins[i],
                number: numberOfCoin
            });
        }
        whichCoins(remainder, totals, i + 1);
    }

    return totals;
}

function justNumbers(input) {
    let value = input;
    if (isNaN(value.charAt(0))) {
        value = value.slice(1);
    }

    if (isNaN(value.charAt(value.length - 1))) {
        value = value.slice(0, value.length - 1);
    }

    if (value.indexOf(',') > -1) {
        value = value.split(',').join('');
    }
    return value;
}

function getNumber(numberString) {
    let isPounds = isNaN(numberString.charAt(0)) || numberString.indexOf('.') > -1;
    let value = parseFloat(justNumbers(numberString));
    const multiplier = isPounds ? 100 : 1;
    return parseInt(value * multiplier);
}

function toPrettyCurrency(value){
    if (value >= 100) {
        return `£${value / 100}`;
    }
    return `${value}p`;
}


document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const input = form.querySelector('.coinify__input__form');
    const button = form.querySelector('.coinify__input__button');

    function styleValidation(e) {
        if (validateInput(e.target.value)) {
            form.classList.add('valid');
            form.classList.remove('invalid');
        }
        else if (e.target.value.length === 0) {
            form.classList.remove('valid');
            form.classList.remove('invalid');
        }
        else {
            form.classList.remove('valid');
            form.classList.add('invalid');
        }
    }

    function showResult(coinsObj) {
        const resultContainer = document.querySelector('.coinify__output');
        const coinIds = Object.keys(coinsObj);
        const rows = [];
        coinIds.forEach(id => {
            const displayCoin = toPrettyCurrency(coinsObj[id].coin);
            const coinValue = coinsObj[id].coin;
            const row = `
                <div class="output__row">
                    <span class="output__coin"><i class="coin output__coin--${coinValue}"></i></span>
                    <span class="output__coin-value">${displayCoin}</span>
                    <span class="output__multiply">${svgMultiply}</span>
                    <span class="output__number">${coinsObj[id].number}</span>
                    <span class="output__equals">${svgEquals}</span>
                    <span class="output__subtotal">${toPrettyCurrency(coinsObj[id].number * coinsObj[id].coin)}</span>
                </div>
            `;
            rows.push(row);
        });
        rows.forEach(row => resultContainer.innerHTML += row);
    }

    form.querySelector('.coinify__input__form').addEventListener('keyup', styleValidation);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateInput(input.value)) {
            document.querySelector('.coinify__output').innerHTML = '';
            const coinified = whichCoins(getNumber(input.value), [], 0);
            showResult(coinified);
        }
        else {
            console.log('Try again');
        }
    });

});
