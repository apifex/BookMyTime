import fs from 'fs';
import readline from 'readline';
import {google} from 'googleapis';;

const CREDENTIALS_PATH = process.env.CREDENTIALS_PATH;
const TOKEN_PATH = process.env.TOKEN_PATH;
const MAIL_ADDRESS = process.env.MAIL_ADDRESS;
const SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://mail.google.com/'];

async function authorize() {
  try {
    const credentials = JSON.parse(await fs.promises.readFile(CREDENTIALS_PATH))
    const {client_secret, client_id, redirect_uris} = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    if (!fs.existsSync(TOKEN_PATH)) return getAccessToken(oAuth2Client)
    const token = JSON.parse(await fs.promises.readFile(TOKEN_PATH))
    oAuth2Client.setCredentials(token)
    return oAuth2Client
  } catch (err) {
    console.log("Error on authorization", err)
  } 
}

function getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to:', TOKEN_PATH);
      });
      authorize();
    });
  });
}

export const freeBusy = async (timeMin, timeMax) => {
    try {
      const auth = await authorize();
      const calendar = google.calendar({version: 'v3', auth});
      const response = await calendar.freebusy.query({
        "resource": {
          "timeMin": timeMin + ":00+00:00",
          "timeMax": timeMax + ":00+00:00",
          "timeZone": "Europe/Paris",
          items: [{ id: MAIL_ADDRESS }]
        }
      })
      return response.data.calendars[MAIL_ADDRESS].busy
    } catch (err) {
      console.log("Error on freeBussy:", err)
    }
  }

export const createEvent = async (eventToAdd) => {
  try {
    const auth = await authorize()
    const calendar = google.calendar({version: 'v3', auth});
    const response = await calendar.events.insert({
      auth: auth,
      calendarId: 'primary',
      resource: eventToAdd,
      });
    return response.statusText;
  } catch(err) {
    console.log("Error on CreateEvent: ", err)
  }
}

function makeMailBody(to, from, subject, message) {
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

export const sendMail = async ({to, from, subject, message}) => {
  try {
    const auth = await authorize()
    const encodedMail = makeMailBody(to, from, subject, message);
    const gmail = google.gmail({version: 'v1', auth});
    const response = await gmail.users.messages.send({
      auth: auth,
      userId: 'me',
      resource: {
        raw: encodedMail
      },
    })
    return response.statusText
  } catch(err) {
    console.log("Error on sendMail: ", err)
  }
}