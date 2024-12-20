import readline from 'readline'; 

function createSplitRequest(splits, token, accountId, agent='') {
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'User-agent':''+agent,
      Authorization: token 
    },
    body: JSON.stringify(splits)
  };

  return fetch(`https://api-sandbox.poweredbyibex.io/account/${accountId}/splits`, options)
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

function askForSplits(token, accountId) {
  const splits = [];

  function askForSplit() {
    rl.question('Insert percentage (or write "end" to finish): ', (percent) => {
      if (percent.toLowerCase() === 'end') {
        rl.close();
        createSplitRequest(splits, token, accountId); 
        return;
      }

      rl.question('Insert destination: ', (destination) => {
        splits.push({ percent: parseFloat(percent), destination });
        askForSplit(); //Redo for another split
      });
    });
  }

  askForSplit(); 
}

const token = process.argv[2]; 
const userId = process.argv[3]; 


if (!token) {
  console.error('Error: Missing token');
  process.exit(1); 
}
if(!userId){
    console.error('Error: Missing User ID');
    process.error(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

askForSplits(token, userId);
