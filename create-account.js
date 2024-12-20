export function createAccount(token, username, currCode=0, agent=""){
    const options = {
        method: 'POST',
        headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'User-Agent': ''+ agent,
        Authorization: '' + token
        },
        body: JSON.stringify({currencyId: parseInt(currCode, 10), name: '' + username})
    };
    
    fetch('https://api-sandbox.poweredbyibex.io/account/create', options)
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
    createAccount(...args); 
} else {
    console.log("Wrog parameters.");
}