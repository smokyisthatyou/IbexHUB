export function getONFees(token,address,amount,curr=0,agent='') {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'User-Agent': ''+ agent,
            Authorization: '' + token
        }
    };

    fetch(`https://api-sandbox.poweredbyibex.io/v2/onchain/estimate-fee?address=${encodeURIComponent(address)}&amount=${amount}&currency-id=${curr}`,options)
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
if (args.length >= 3) {
    getONFees(...args); 
} else {
    console.log("Wrog parameters.");
}
