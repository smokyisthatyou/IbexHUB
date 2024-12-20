const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:133.0) Gecko/20100101 Firefox/133.0'
    }
  };
  
  fetch('https://api-sandbox.poweredbyibex.io/currency/all', options)
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
    