export function getAccountDetails(token,accountId,agent='') {
const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'User-agent':'' + agent,
      Authorization: '' + token
    }
  };
  
  fetch(`https://api-sandbox.poweredbyibex.io/v2/account/${encodeURIComponent(accountId)}`, options)
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
    getAccountDetails(...args); 
} else {
    console.log("Wrong parameters");
}