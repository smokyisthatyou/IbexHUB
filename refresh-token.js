export function refreshToken(refreshToken, agent=''){
    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': ''+ agent,
        },
        body: JSON.stringify({refreshToken: ''+refreshToken,})
    };

    fetch('https://api-sandbox.poweredbyibex.io/auth/refresh-access-token', options)
    .then(response => {
        if (!response.ok) {
            
            return response.text().then(body => {
                throw new Error(`HTTP error! status: ${response.status} : ${body}`);
            });
        }
        return response.json(); 
    })
    .then(data => {
        const refreshedAccessToken = data.accessToken;
        console.log(`${JSON.stringify(data, null, 2)}`);
    })
    .catch(error => {
        console.error('Errore:', error);
    });

}

const args = process.argv.slice(2);
if (args.length > 0) {
    refreshToken(...args); 
} else {
    console.log("No token has been specified.");
}