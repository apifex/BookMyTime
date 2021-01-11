"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.freeBusy = void 0;
const googleapis_1 = require("googleapis");
const credentials_json_1 = require("./credentials/credentials.json");
const token_json_1 = __importDefault(require("./credentials/token.json"));
// const CREDENTIALS_PATH = process.env.CREDENTIALS_PATH;
const TOKEN_PATH = './credentials/token.json';
const MAIL_ADDRESS = "apifex@gmail.com";
const SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://mail.google.com/'];
const freeBusy = (timeMin, timeMax) => __awaiter(void 0, void 0, void 0, function* () {
    const oAuth2Client = new googleapis_1.google.auth.OAuth2(credentials_json_1.web.client_id, credentials_json_1.web.client_secret, credentials_json_1.web.redirect_uris[0]);
    oAuth2Client.setCredentials(token_json_1.default);
    const calendar = googleapis_1.google.calendar({ version: 'v3', auth: oAuth2Client });
    const busy = yield calendar.freebusy.query({
        requestBody: {
            "timeMin": timeMin,
            "timeMax": timeMax,
            "timeZone": "Europe/Paris",
            "items": [
                { "id": MAIL_ADDRESS }
            ],
        }
    });
    if (busy.data.calendars)
        return busy.data.calendars[MAIL_ADDRESS].busy;
});
exports.freeBusy = freeBusy;
let x = exports.freeBusy('2021-01-01T09:00:00-07:00', '2021-01-25T09:00:00-07:00').then((res) => console.log(res));
console.log("final", x);
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
