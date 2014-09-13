var clientId = '1077475034690-9o6u1fr1d91epve7ufekdb7covhbs130.apps.googleusercontent.com';
var apiKey = 'AIzaSyAzthbdil42RilFZfh3Y6km7Whg22k-HeI';
var scopes = 'https://www.googleapis.com/auth/calendar';

var gcEvents;
var newEvents = [];

$(document).ready(function(){
  $("#hideSource").click(function(){
    $("#sourceEvents").toggle();
  });
  $("#hideExternal").click(function(){
    $("#externalEvents").toggle();
  });

  $("#submit").click(function(){
    submitNewEventsToGoogle();
    location.reload();
  });
});

function submitNewEventsToGoogle(){
  for(var i in newEvents){
  gapi.client.load('calendar', 'v3', function() {
    var request = gapi.client.calendar.events.insert({
      'calendarId': 'billy5521@gmail.com',
      'resource': gcfy(newEvents[i])
    });

    request.execute(function(resp) {
      console.log(resp);
    });
  });
  }
}

function gcfy(fcEvent){
  var gcEvent = {
    end: {dateTime: fcEvent.end.toDate()},
    start: {dateTime: fcEvent.start.toDate()},
    summary: fcEvent.title
  };
  return gcEvent;
}

function reformat(gcEvents){
  var events = [];
  for(var i in gcEvents.items){
  var event = {};
    event.title = gcEvents.items[i].summary;
    event.start = gcEvents.items[i].start.dateTime;
    event.end = gcEvents.items[i].end.dateTime;
    events.push(event);
  }
  console.log(gcEvents);
  return events;
}

function initialise_calendar(){
  calendar = $('#calendar').fullCalendar({
    header: {
      left: 'today prev,next',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    },
      events: reformat(gcEvents),
      timezone: 'locale',
      defaultView: 'agendaWeek',
    selectable: true,
    selectHelper: true,
    select: function(start, end, allDay) {
    console.log(start.stripZone());
    console.log(end.stripZone());
      if (isOverlapping(start.stripZone(), end.stripZone())) {
        alert("overlapping occurs");
      }
      else{
        var title = prompt('Event Title:');
        if(title){
          calendar.fullCalendar('renderEvent',
            {
              title: title,
              start: start,
              end: end,
            },
            true
          );
          var event = new Object();
          event.title = title;
          event.start = start;
          event.end = end;
          newEvents.push(event);

          var li = document.createElement('li');
          li.appendChild(document.createTextNode(Date(event.start) + " " + event.title));
          document.getElementById("externalEvents").appendChild(li);
        }
      }
      calendar.fullCalendar('unselect');
    },
    editable: true
  });
}

function isOverlapping(start, end){
  var array = calendar.fullCalendar('clientEvents');
  var check = false;
  for(i in array){
  console.log(array[i].title+" : "+array[i].start.toDate());
  console.log("new : " + start.toDate());
    if(!(Date(array[i].start) >= Date(end) && Date(array[i].end) <= Date(start))){
      check = true;
    }
  }
  return check;
}

function handleClientLoad() {
  gapi.client.setApiKey(apiKey);
  window.setTimeout(checkAuth,1);
}

function checkAuth() {
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
}

function handleAuthResult(authResult) {
  var authorizeButton = document.getElementById('authorize-button');
  if (authResult && !authResult.error) {
    authorizeButton.style.visibility = 'hidden';
    makeApiCall();
  } else {
    authorizeButton.style.visibility = '';
    authorizeButton.onclick = handleAuthClick;
  }
}

function handleAuthClick(event) {
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
  return false;
}

function makeApiCall() {
  gapi.client.load('calendar', 'v3', function() {
    var request = gapi.client.calendar.events.list({
      'calendarId': 'billy5521@gmail.com'
    });

    request.execute(function(resp) {
      /*$("#name").text(resp.summary);*/
      gcEvents = resp;

      initialise_calendar();
      for (var i = 0; i < resp.items.length; i++) {
        var li = document.createElement('li');
  li.appendChild(document.createTextNode(resp.items[i].start.dateTime + " " + resp.items[i].summary));
  document.getElementById('sourceEvents').appendChild(li);
      }
    });
  });
}



// vi:et:ft=ls:nowrap:sw=2:ts=2
