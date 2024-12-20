export function getInvoice(token,amount,lnAdd,comment="",agent='') {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'User-Agent': ''+ agent,
            Authorization: '' + token
        }
    };

    fetch(`https://api-sandbox.poweredbyibex.io/lnurl/pay/invoice?amount=${amount}&ln-address=${encodeURIComponent(lnAdd)}&comment=${encodeURIComponent(comment)}`,options)
    .then(response => {
        if (!response.ok) {
            return response.text().then(body => {
                throw new Error(`HTTP error! status: ${response.status} : ${body}`);
            });
        }
        return response.json(); 
    })
    .then(res => console.log(res))
    .catch(err => console.error(err));
}

const args = process.argv.slice(2);
if (args.length >= 2) {
    getInvoice(...args); 
} else {
    console.log("Wrog parameters.");
}
