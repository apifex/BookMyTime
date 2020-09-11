
import 'dotenv/config'; 
import fs from 'fs'

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
        fs.readFile(TOKEN_PATH, async (err, token) => {
          if (err) return getAccessToken(result, 'calendar');
          result.setCredentials(JSON.parse(token));
          let accessToken = await result.getAccessToken()

          sendMail2(accessToken, mailOptions)
         });
        })
  });
}



export function sendMail2 (accessToken, mailOptions) {
  
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    
    auth: {
      type: 'OAuth2',
      user: 'apifex@gmail.com',
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      accessToken: accessToken.token,
      refresh_token: accessToken.res.data.refresh_token,
      
    }
  });
  
  transporter.sendMail(mailOptions)
}