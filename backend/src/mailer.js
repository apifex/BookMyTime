
import {google} from 'googleapis';

import nodemailer from 'nodemailer';

const OAuth2 = google.auth.OAuth2;

const {CLIENT_ID, CLIENT_SECRET, MAIL_ADDRESS, REFRECH_TOKEN} =  process.env;

const oAuth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET,
"https://developers.google.com/oauthplayground")

oAuth2Client.setCredentials({
  refresh_token: REFRECH_TOKEN
})

const accessToken = oAuth2Client.getAccessToken()

const smtpTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
       type: "OAuth2",
       user: MAIL_ADDRESS, 
       clientId: CLIENT_ID,
       clientSecret: CLIENT_SECRET,
       refreshToken: REFRECH_TOKEN,
       accessToken: accessToken
  }
});


export function sendMail (mailOptions) {
  smtpTransport.sendMail(mailOptions, (error, response) => {
    error ? console.log(error) : console.log(response);
    smtpTransport.close();
  });
}



