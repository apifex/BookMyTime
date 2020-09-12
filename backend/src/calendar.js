import fs from 'fs';

import {google} from 'googleapis';

import {authorize, getNewAccessToken} from './oAuth2'


export const loadEventsList = (eventsNumber, callback) => {
    fs.readFile(process.env.CREDENTIALS_PATH, (err, content) => {
        if (err) return console.log(err);
        const auth = authorize(JSON.parse(content))
        fs.readFile(process.env.TOKEN_PATH, (err, token) => {
          if (err) return getNewAccessToken(auth);
          auth.setCredentials(JSON.parse(token));
          
          const calendar = google.calendar({version: 'v3', auth});
          calendar.events.list({
            calendarId: 'primary',
            timeMin: (new Date()).toISOString(),
            maxResults: eventsNumber,
            singleEvents: true,
            orderBy: 'startTime',
          }, (err, res) => {
            if (err) return console.log('The Calendar API returned an error: ' + err);
            const events = res.data.items;
            if (events.length) {
              callback(events)
            } else {
              callback(null)
            }
          });
        })
    });
}

export const createEvent = (event, callback) => {
    fs.readFile(process.env.CREDENTIALS_PATH, (err, content) => {
        if (err) return console.log('add Event error', err);
        const auth = authorize(JSON.parse(content))
        fs.readFile(process.env.TOKEN_PATH, (err, token) => {
          if (err) return getNewAccessToken(auth);
          auth.setCredentials(JSON.parse(token));
          const calendar = google.calendar({version: 'v3', auth});
          calendar.events.insert({
            auth: auth,
            calendarId: 'primary',
            resource: event,
          }, (err, event) => {
          if (err) return console.log('There was an error contacting the Calendar service: ' + err);
          callback(event.data.created)
        });
      });
  });
}


export const freeBusy = async (timeMin, timeMax, callback) => {
  try {
    const calendar = google.calendar({version: 'v3', auth: process.env.API_KEY});
    const response = await calendar.freebusy.query({
      "resource": {
        "timeMin": timeMin,
        "timeMax": timeMax,
        timeZone: 'Europe/Paris',
        items: [{ id: process.env.MAIL_ADDRESS }]
      }
    });
    callback(response.data.calendars[process.env.MAIL_ADDRESS].busy)
  } catch (error) {
    console.log("error freebussy:", error)
  }
}
