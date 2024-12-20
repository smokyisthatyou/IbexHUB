````toc
````
## Abstract
This document provides comprehensive documentation for a straightforward implementation of several APIs offered by IbexHUB.

It begins with instructions on how to execute all the code available in this repository and will proceed with a detailed explanation of each implemented functionality.

Each task will include a section dedicated to testing and simulating requests and responses for every endpoint utilized.
Additionally, the document will offer suggestions for enhancing the user experience.
## Introduction
IBEXHub is an API service that enables the integration of Bitcoin and Lightning Network functionalities into applications. A dedicated team of engineers manages a cluster of Lightning nodes, liquidity, and channels, ensuring the proper operation of the APIs.

IbexHUB has requested the implementation and testing of five of their available APIs, accompanied by thorough documentation to support the process.

The following paragraphs will focus on each of the different APIs that have been tested, providing detailed documentation for each step, along with relevant test cases. Any errors or unexpected behaviors encountered will be reported and analyzed.
## Initial set-up
My implementation is built using a Node.js project, all the HTTP requests are done using the *fetch* API and the packet manager used is npm. Each significant function is encapsulated within its own CommonJS module to facilitate testing.

To get started, it is important to check if Node is already present and installed on the computer. It is advisable also to install node-fetch, if not already present. 
Then you can clone the Git repository to your local machine and run the following command after navigating to the directory:
```shell
npm install
```

To run any of the modules:
```shell
npm run module_name 
```
followed by the required parameters, described below.  
### Modules
Here is a brief explanation of how to run each module, along with the required parameters. Each function accepts an optional parameter for the user-agent of the client. By default, this parameter is not specified.

> [!note]
> For an easier use, i suggest exporting the often used variables in the shell for future uses, like so:
>```shell
export EMAIL=’your_email’
export PWD=’your_pwd’ 
>```
#### sign-in.js
 ```shell
 npm run sign-in -- $EMAIL $PWD

  ```
  To get a new accessToken and refreshToken.
  
  Again, I suggest exporting this two variables as
  ```shell
export ACCESS=’your_access_token’
export REFRESH=’your_refresh_token’ 
```
> [!note] 
> Remember to redo the export of ACCESS every time you do a refresh token. 
#### refresh-token.js
   ```shell
 npm run refresh-token -- $REFRESH
  ```
 To get a newly created accessToken everytime an endpoint returns a 401 code response. The accessToken has a limited lifetime of 1 hour, while a refreshtoken has an expiration time of 7 days.
#### create-account.js
   ```shell
 npm run create-account -- $ACCESS account_name optional_currency_id 
  ```
This will return a newly created account along with its _accountId_ and _userId_, and it will associate the specified currency with that particular account. If this parameter is not provided, the account will be created with _msats_ as the default currency.

To retrieve a list of all available currencies, run:
 ```shell
 npm run get-all-currencies
```
#### generate-lightning-address.js
  ```shell
 npm run generate-lightning-address -- $ACCESS account_id username
  ```
This function returns a Lightning address that includes the specified username (e.g., [gigi@api-sandbox.poweredbyibex.io](mailto:gigi@api-sandbox.poweredbyibex.io) if "gigi" is provided) and is associated with the specific account identified by its ID.

Please note that the _account_id_ refers to the _accountId_ obtained by running the create-account module.
#### generate-invoice.js
  ```shell
 npm run generate-invoice -- $ACCESS amount lightning_address optional_comment
  ```
Generated a Bolt11 invoice from the lightning address specified as parameter. 
#### generate-onchain-address.js
  ```shell
 npm run generate-onchain-address -- $ACCESS account_id
  ```
Generate an Pay to Witness Public Key Hash (P2WPKH) address.  
#### estimate-fees.js
  ```shell
 npm run estimate-fees -- $ACCESS onchain_address amount optional_currencie_id
  ```
Returns, given an on-chain address and an amount, the estimated fees to perform a payment. 
#### create-split.js
  ```shell
 npm run create-split -- $ACCESS account_id
  ```
Payment splits are a "promise" made from one account to another account, a Lightning address, or an on-chain address. They are activated to the designated destination once funds are received in the account.

The function specified in this module takes an array as a parameter, which includes the percentages and destinations. These details are requested during execution and can be manually added by the user.
## Authentication
The first step to using the APIs is authentication.

To test the API, I obtained a username and password, which are required in the body of a POST request to the Sign In endpoint to receive an Access Token. IbexHUB authentication is based on the JWT method, so whenever an endpoint returns a 401 response code, it indicates that the Access Token has expired, and it is necessary to call the Refresh Access Token endpoint.

![[Plan B Tech School - IbexHUB APIs documentation and testing-1.png]]
### Implementation
The signIn function takes 3 parameters: email, pwd and one optional parameter for the user-agent. 
The function creates a JSON with email and password in the body, and makes a POST request to the Sign In endpoint (https://api-sandbox.poweredbyibex.io/auth/signin).
If the response is a 200 code, the JSON contains the accessToken, the expirationTime and the refreshToken. 

> [!note]
> For an easier use, i suggest exporting a TOKEN and a REFRESH variables in the shell for future uses, like so: 
> ```shell
> export TOKEN=’yourtokenhere’
> export REFRESH=’yourrefreshtokenhere’
> ```
> Later on you can use them as parameters for other functions, for example:
> ```shell
> npm run refresh-toekn — $REFRESH
> ```
### Tests and  status code
Here a list of some possibile test cases taken in order to see how te API behaves: 
- 403 forbidden - wrong credentials: as a response code when email wrong or both wrong.
- 404-not found:  when pwd is wrong.
### Advice
- In the documentation 401 response code is not always specified as a possible response code, even if, testing some of them out, they return it a a value once the access token is expired. 
- The web UI for this API is not responsive right now, so it is not possible to insert manually email, pwd and authentication token.
- I never reached the maximum of possibile accessToken that one can create from a single refreshToken in a given amount of time, but, if not already present, I suggest putting a threshold to this number as a security measure. 
## Create and associate a lightning address to your IBEXHub account
Lightning addresses are a user-friendly way to facilitate payments on the Lightning Network. This innovation aims to enhance the usability of Bitcoin for everyday purchases. This functionalities permits to create a lightning address matching it from an account. From the same account, it is possibile to create multiples lightning addresses.
### Implementation
First step of the implementation was creating some new user account thanks to the API Create User. This behaviour is implemented in the create-user module, that takes as parameters an *accessToken*, a *username* and the Id of the currency you want the new account will use. The response will contain the *accountID* (useful for future use, so it is important to store it somewhere, maybe using the export command explained previously), the *userID*, the *organizationId* (same for every account created by the same operator account), the chosen name and the *currencyId*. The JSON should also contain the balance of every account, but during my tests this was never showed. In order to get the balance of a specific account, it is enough to use the Account Details API (https://api-sandbox.poweredbyibex.io/v2/account/{accountId}); in my specific implementation this is done running the *get-account-details* module, with the *accountId* as parameter, additionally to the *accessToken*. 
Regarding the specific implementation of the feature, the module that created the address is *generate-lightning-address*. It contains a function that takes as parameters the *accessToken*, the *accountId* and the *username* for the new account. This values are then passed as a JSON file in the body of the POST request to the endpoint (https://api-sandbox.poweredbyibex.io/lightning-address). The response will contain the *Id*, the *accountId* and the *lightningAddress* with the username specified. 
### Tests and status code
-  404-not found: account is not found from the list of existing one.
- 400 - bad request: the *accountId* attribute is written in a wrong format (characters are not the expected ones, length of string is not the default one etc.) or the *username* specified has already been used.
- 401 - unauthorized: wrong access token or expired token. 
- 201 - created: a new lightning address with the username specified is created. 
### Advice
- The web interface example in Javascript does not currently work: 400 response code for a EOF error. 
- It is not clear from the documentation what the attribute *accountId* is used for; I made the hypothesis it is the *accountId* of the operator creating the accounts, but it cannot be used as a standard *accountId* for operations that requires it as a parameter.
## Create a Bolt11 invoice using your lightning address
BOLT11 invoices are a standardized format for requesting payments on the Lightning Network. This structured format allows users to generate and share invoices easily, enabling quick payments. This functionality permits to create a Bolt11 invoice from an existing lightning address. 
### Implementation
The module that implement this feature is *generate-invoice*. It contains a function that takes as parameters the *accessToken*, the *amount* of the invoice, the *lightning address* linked to a specific account and an optional *comment*. This values are then passed as parameters in the URL of the GET request to the endpoint (https://api-sandbox.poweredbyibex.io/lnurl/pay/invoice?amount={amount}&ln-address={ln-address}&comment={comment}).
The behaviour of this API was not the one expected, so it is possible that something is not working. Specifically, regarding that the request is done in a correct or incorrect form (putting al parameters, parameters are wrong in number or form, etc.), the response code is always 201, and the response body contains:

  ```json
{
  "reason": "record not found",
  "status": "ERROR"
}
  ```
I was still able to get a Bolt11 invoice using the Add Invoice using the Add Invoice V2 API, that requires as parameter not the *lightning address* but the *accountId*. 
I then proceed in doing a payment towards that invoice, that was performed correctly. 
### Tests and status codes
Both trying from the web UI and directly with my implementation ,the response is always a 201 code. 
Even trying with a wrong *accessToken* gives a 201 response code, with the same body. 
### Advice
I could not find from the documentation what the filed k1 is used for. 
## Generate onchain address for your IBEXHub account

### Implementation
This feature is implemented in the module *generate-onchain-address*. It contains a function that takes as parameters the *accessToken* and the *accountId*. It proceed in doing a POST request to the endpoint (https://api-sandbox.poweredbyibex.io/onchain/address). 
### Tests
- 404 - not found: account is not present from the list of accounts. 
- 400 - bad request: the account is specified in an unexpected format. 
- 401 - unauthorized: invalid token. 
- 201 - created: a new P2WPKH is created 
### Advice
In the documentation there is truncated sentence: “Funds will only show up after a transaction's status is.”
## Estimate fee required to send sats to your IBEXHub onchain address-V2
### Implementation
This feature is implemented in the module *estimate-fees*. It contains a function that takes as parameters the *accessToken*, the *on-chain address* and a simulated *amount* of millisats. It proceed in doing a GET request to the endpoint (https://api-sandbox.poweredbyibex.io/v2/onchain/estimate-fee?address={address}&amount={amount}&currency-id={curr}). It returns an estimation of the fees required to send sats to the onchain address specified. 
### Tests and status codes
- 400 - bas request: if bitcoin address specified is invalid or if amount it is not in the range specified
- 401 - unauthorized: invalid token
- 200 - OK : fees estimation is returned (in my case they were always 0, but I suppose it was due to the fact that no sats where present in any of my accounts.)
### Advice
The endpoint specified in the documentation is missing the parameters.
## Create a payment Split for your IBEXHub account
A payment split consist in dividing a single payment into multiple parts. It acts as a promise, activated to the designated destinations once funds are received in the account.
### Implementation
The module that implements the split functionality is *create-split*. It contains a function that takes as parameters the *accessToken*, the *accountId* and an array containing the various splits. The JSON request body will have the format:
```JSON
[
  {
    "percent": "",
    "destination": "" // onchain address
  },
  {
    "percent": "",
    "destination": "" // lightning address
  },
  {
    "percent": "",
    "destination": "" // hub account UUID
  }
]
```
The percent will specify the percentage of funds that will arrive at each specified destination. Destinations can be expressed as lightning addresses, on-chain address or accountId. 
In my specific implementation, this attributes of a split are requested during the execution and are inserted by the user. 
### Tests
 - 404 - not found: account specified is not found
 - 400 - bad request: edge between address1 and address2 is already known; src address ad destination address specified are the same; duplicates not allowed if destinations specified in the JSON body are the same
 - 200 - OK: the splits has the right format and the specified destinations exists, are in the right format and are different from the source address
### Advice
The example in web UI is not  interactive, so it is not possibile to actually make the request from there. 