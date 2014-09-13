var clientId, apiKey, scopes;
clientId = '1077475034690-9o6u1fr1d91epve7ufekdb7covhbs130.apps.googleusercontent.com';
apiKey = 'AIzaSyAzthbdil42RilFZfh3Y6km7Whg22k-HeI';
scopes = 'https://www.googleapis.com/auth/calendar';
function handleClientLoad(){
  gapi.client.setApiKey(apiKey);
  return window.setTimeout(checkAuth, 1);
}
function checkAuth(){
  return gapi.auth.authorize({
    client_id: clientId,
    scope: scopes,
    immediate: true
  }, handleAuthResult);
}
function handleAuthResult(authResult){
  var authorizeButton;
  authorizeButton = document.getElementById('authorize-button');
  if (authResult && !authResult.error) {
    authorizeButton.style.visibility = 'hidden';
    return makeApiCall();
  } else {
    authorizeButton.style.visibility = '';
    return authorizeButton.onclick = handleAuthClick;
  }
}
function handleAuthClick(event){
  gapi.auth.authorize({
    client_id: clientId,
    scope: scopes,
    immediate: false
  }, handleAuthResult);
  return false;
}
function makeApiCall(){
  return gapi.client.load('calendar', 'v3', function(){
    var request;
    request = gapi.client.calendar.events.list({
      'calendarId': 'billy5521@gmail.com'
    });
    request.execute(function(resp){
      var i$, to$, i, li;
      $('#name').text(resp.summary);
      console.log(resp);
      for (i$ = 0, to$ = resp.items.length; i$ <= to$; ++i$) {
        i = i$;
        li = document.createElement('li');
        li.appendChild(document.createTextNode(resp.items[i].start.dateTime + " " + resp.items[i].summary));
        document.getElementById('events').appendChild(li);
      }
    });
  });
}