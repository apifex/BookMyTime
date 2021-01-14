import { google, calendar_v3 } from 'googleapis';
import { web } from './credentials/credentials.json'
import token from './credentials/token.json'

import Calendar = calendar_v3.Calendar;

const MAIL_ADDRESS = "apifex@gmail.com";

interface IFreeBusy {
    "start": string,
    "end": string
}

export interface IEvent {
  "summary": string,
  "description": string,
  "start": {
    "dateTime": string
  },
  "end": {
    "dateTime": string
  }
}

export interface IMail {
  to: string,
  from: string,
  subject: string,
  message: string

}

export const freeBusy = async (timeMin: string, timeMax: string ) => {
    try {
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
    if (busy.data.calendars) return busy.data.calendars[MAIL_ADDRESS].busy as IFreeBusy[]
    } catch(error) {
      console.log('Erron on freeBusy in googleApis ', error)
    }
}

export const createEvent = async (eventToAdd: IEvent) => {
  try {
    const oAuth2Client = new google.auth.OAuth2(web.client_id, web.client_secret, web.redirect_uris[0]);
    oAuth2Client.setCredentials(token)
    const calendar: Calendar = google.calendar({version: 'v3', auth: oAuth2Client});
    const createEventRespons = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: eventToAdd,
      });
    return createEventRespons.statusText;
  } catch(error) {
    console.log("Error on CreateEvent in googleApis: ", error)
  }
}

const makeMailBody = ({to, from, subject, message}:IMail) => {
  const str = ["Content-Type: text/plain; charset=\"UTF-8\"\n",
      "MIME-Version: 1.0\n",
      "Content-Transfer-Encoding: 7bit\n",
      "to: ", to, "\n",
      "from: ", from, "\n",
      "subject: ", subject, "\n\n",
      message
  ].join('');
  return Buffer.from(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
}

export const sendMail = async ({to, from, subject, message}: IMail) => {
  try {
    const oAuth2Client = new google.auth.OAuth2(web.client_id, web.client_secret, web.redirect_uris[0]);
    oAuth2Client.setCredentials(token)
    const encodedMail = makeMailBody({to, from, subject, message});
    const gmail = google.gmail({version: 'v1', auth: oAuth2Client});
    const sendMailResponse = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMail
      },
    })
    return sendMailResponse.statusText
  } catch(error) {
    console.log("Error on sendMail in googleApi: ", error)
  }
}