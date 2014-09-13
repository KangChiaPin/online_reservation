clientId = '1077475034690-9o6u1fr1d91epve7ufekdb7covhbs130.apps.googleusercontent.com'
apiKey = 'AIzaSyAzthbdil42RilFZfh3Y6km7Whg22k-HeI'
scopes = 'https://www.googleapis.com/auth/calendar'

function handleClientLoad
  gapi.client.setApiKey apiKey
  window.setTimeout checkAuth, 1

function checkAuth
  gapi.auth.authorize client_id: clientId, scope: scopes, immediate: true , handleAuthResult

function handleAuthResult authResult
  authorizeButton = document.getElementById \authorize-button
  if authResult and !authResult.error
    authorizeButton.style.visibility = \hidden
    makeApiCall!
  else
    authorizeButton.style.visibility = ''
    authorizeButton.onclick = handleAuthClick

function handleAuthClick event
  gapi.auth.authorize client_id: clientId, scope: scopes, immediate: false , handleAuthResult
  return false

function makeApiCall
  gapi.client.load \calendar, \v3 !->
    request = gapi.client.calendar.events.list \calendarId : \billy5521@gmail.com

    resp <-! request.execute
    $ \#name .text resp.summary

    console.log resp

    for i from 0 to resp.items.length
     li = document.createElement \li
     li.appendChild document.createTextNode resp.items[i].start.dateTime + " " + resp.items[i].summary
     document.getElementById \events .appendChild li
    
# vi:et:ft=ls:nowrap:sw=2:ts=2
