
import 'dotenv/config'; 
import fs from 'fs'

import {google} from 'googleapis';

import nodemailer from 'nodemailer';

import {authorize, getAccessToken} from './oAuth2'

const TOKEN_PATH = 'src/credentials/token_calendar.json';


export const sendMail = (mailOptions) => {
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
          
          sendMail2(result, mailOptions)
         });
        })
  });
}




// const oAuth2Client = new OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET,
// "https://developers.google.com/oauthplayground")
// console.log(oAuth2Client)
// oAuth2Client.setCredentials({
//   refresh_token: process.env.REFRECH_TOKEN
// })

// const accessToken = oAuth2Client.getAccessToken()






export function sendMail2 (auth, mailOptions) {
  
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    
    auth: {
      type: 'OAuth2',
      user: 'apifex@gmail.com',
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refresh_token: auth.credentials.refresh_token,
      accessToken: auth.credentials.access_token
    }
  });
  
  transporter.sendMail(mailOptions)
}