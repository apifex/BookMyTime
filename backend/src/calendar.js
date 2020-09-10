import fs from 'fs';

import {google} from 'googleapis';

import {authorize, getAccessToken} from './oAuth2'

const TOKEN_PATH = 'src/credentials/token_calendar.json';

export const loadEventsList = (eventsNumber, callback) => {
    fs.readFile('src/credentials/credentials.json', (err, content) => {
        if (err) return console.log(err);
        let promise =  new Promise((resolve, reject)=>{
          resolve(authorize(JSON.parse(content)));
          reject('error')
        })  
        
        promise.then((result,error) => {
          fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getAccessToken(result, 'calendar');
            result.setCredentials(JSON.parse(token));
            listEvents(result, eventsNumber, callback)
           });
          })
    });
}

export const addEvent = (event, callback) => {
    fs.readFile('src/credentials/credentials.json', (err, content) => {
        if (err) return console.log(err);
        let promise =  new Promise((resolve, reject)=>{
          resolve(authorize(JSON.parse(content)));
          reject('error')
        })  
        
        promise.then((result,error) => {
          fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getAccessToken(result, 'calendar');
            result.setCredentials(JSON.parse(token));
            insertEvent(result, event, callback)
           });
          })
    });
}

function listEvents(auth, eventsNumber, callback) {
    const calendar = google.calendar({version: 'v3', auth});
    calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: eventsNumber,
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const events = res.data.items;
      if (events.length) {
        console.log(`Upcoming ${eventsNumber} events:`);
        events.map((event, i) => {
          const start = event.start.dateTime || event.start.date;
          console.log(`${start} - ${event.summary}`);
          
          });
        callback(events)

      } else {
        console.log('No upcoming events found.');
      }
    });
   
  }

  
function insertEvent(auth, event, callback) {
    const calendar = google.calendar({version: 'v3', auth});
    calendar.events.insert({
        auth: auth,
        calendarId: 'primary',
        resource: event,
      }, function(err, event) {
        if (err) {
          console.log('There was an error contacting the Calendar service: ' + err);
          return;
        }
        listEvents(auth, 5, callback)
        console.log('Event created', event.data.htmlLink);
      });
  }
