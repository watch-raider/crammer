let token;
let email;
let id;
var user;
const protocol = 'https://'
const endpoint = 'crammer-api-dev.azurewebsites.net';
const user_route = '/api/users/';
const usage_route = '/api/usage/';
const analytics_route = '/api/analytics/';
const initialise_route = '/api/initialise';

function userIdentity() {
  chrome.identity.getProfileUserInfo((userInfo) => {
    email = userInfo.email;
    token = userInfo.id;
    
    chrome.storage.sync.get(['userAccount'], function(result) {
      if (typeof result['userAccount'] === "undefined") {
        GetUser(token);
      } 
      else 
      {
        user = JSON.parse(result['userAccount']);
        if (user !== null && token === user.Token) {
            InitialiseApi();
        }
        else {
          GetUser(token);
        }
      }
    });
  });
};

function AddAccount(user_token, user_email) {

  user = { "Token": user_token, "Email": user_email };

  fetch(protocol + endpoint + user_route, {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
    .then((response) => response.json())
    .then((user) => {
      console.log('Success: ' + JSON.stringify(user));
    })
    .catch((error) => {
      console.log('Error: ' + JSON.stringify(error));
    });

}

function GetUser(user_token) {
  var requestOptions = {
    method: 'GET'
  };

  fetch(protocol + endpoint + user_route + user_token, requestOptions)
  .then((response) => response.json())
  .then((data) => {
    //var jsonResponse = JSON.parse(data);
      if (data.title == "Not Found") {
        //NEW ACCOUNT!
        AddAccount(token, email);
      }
      else {
        //ACCOUNT ALREADY ADDED!
        user = data;
        SaveData(user);
      }
  })
  .catch(error => console.log('error', error));
}

function InitialiseApi() {
  var requestOptions = {
    method: 'POST'
  };

  fetch(protocol + endpoint + initialise_route, requestOptions)
    .then(response => console.log(response.status))
    .catch(error => console.log('error', error));
}

function SaveData(userDetails) {
  chrome.storage.sync.set({'userAccount': JSON.stringify(userDetails)}, function() {
    console.log('Value is set');
  });
}