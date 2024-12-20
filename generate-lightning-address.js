export function generateLNAddress(token,accountID,username,agent='') {
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'User-Agent': ''+ agent,
            Authorization: '' + token
        },
        body: JSON.stringify({accountId: ''+ accountID, username: ''+ username}) 
    };

    fetch('https://api-sandbox.poweredbyibex.io/lightning-address', options)
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
    generateLNAddress(...args); 
} else {
    console.log("Wrog parameters.");
}
