export function signIn(email, pwd, agent=""){
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-agent':''+agent
    }, body : JSON.stringify ({email:  email, password: pwd})
  };

  return fetch('https://api-sandbox.poweredbyibex.io/auth/signin', options)
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
if (args.length >= 1) {
  signIn(...args); 
} else {
  console.log("Wrog parameters.");
}