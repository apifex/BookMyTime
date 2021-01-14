import fs from 'fs';
import readline from 'readline';
import {google} from 'googleapis';
import credentials from './credentials/credentials.json'
//TODO 
//change the way you take token
const TOKEN_PATH = './credentials/token.json'
const SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://mail.google.com/'];

export const getAccessToken = () => {
    const oAuth2Client = new google.auth.OAuth2(credentials.web.client_id, credentials.web.client_secret, credentials.web.redirect_uris[0]);
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
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to:', TOKEN_PATH);
        });
      });
    });
  }


