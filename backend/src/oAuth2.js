import fs from 'fs';
import readline from 'readline';
import {google} from 'googleapis';

let SCOPES;
let TOKEN_PATH;


export function authorize(credentials){
    const {client_secret, client_id, redirect_uris} = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
    return oAuth2Client
  }

export function getAccessToken(oAuth2Client, service) {

  
    if (service === 'calendar') {
        SCOPES = ['https://mail.google.com/',
        'https://www.googleapis.com/auth/calendar'];
        TOKEN_PATH = 'src/credentials/token_calendar.json'} 

    
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
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        
      });
    });
    return oAuth2Client
  }
