import { google, calendar_v3 } from 'googleapis';
import { web } from './credentials/credentials.json'
import token from './credentials/token.json'

import Calendar = calendar_v3.Calendar;

// const CREDENTIALS_PATH = process.env.CREDENTIALS_PATH;
const TOKEN_PATH = './credentials/token.json'
const MAIL_ADDRESS = "apifex@gmail.com";
const SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://mail.google.com/'];

interface IFreeBusy {
    "start": string,
    "end": string
}

export const freeBusy = async (timeMin: string, timeMax: string ) => {
    const oAuth2Client = new google.auth.OAuth2(web.client_id, web.client_secret, web.redirect_uris[0]);
    oAuth2Client.setCredentials(token)
    const calendar: Calendar = google.calendar({version: 'v3', auth: oAuth2Client});
    const busy = await calendar.freebusy.query({
        requestBody: {
          "timeMin": timeMin,
          "timeMax": timeMax,
          "timeZone": "Europe/Paris",
          "items": [
            { "id": MAIL_ADDRESS }
          ],
        }
      })
    if (busy.data.calendars) return busy.data.calendars[MAIL_ADDRESS].busy
}

let x = freeBusy('2021-01-01T09:00:00-07:00','2021-01-25T09:00:00-07:00').then((res)=>console.log(res))

console.log("final", x)






// calendar.events.list({
        //   calendarId: 'primary',
        //   timeMin: (new Date()).toISOString(),
        //   maxResults: 10,
        //   singleEvents: true,
        //   orderBy: 'startTime',
        // }, (err, res) => {
        //   if (err) return console.log('The API returned an error: ' + err);
        //   const events = res?.data.items;
        //   if (events?.length) {
        //     console.log('Upcoming 10 events:');
        //     console.log(events)
        //   } else {
        //     console.log('No upcoming events found.');
        //   }
        // });

