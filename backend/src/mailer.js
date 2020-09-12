import 'dotenv/config'; 
import fs from 'fs'
import nodemailer from 'nodemailer';
import {authorize, getNewAccessToken} from './oAuth2'

export const sendMail = (mailOptions) => {
  fs.readFile(process.env.CREDENTIALS_PATH, (err, data) => {
      if (err) return console.log(err);
      const auth = authorize(JSON.parse(data))
      fs.readFile(process.env.TOKEN_PATH, async (err, token) => {
        if (err) return getNewAccessToken(auth);
        auth.setCredentials(JSON.parse(token));
        const accessToken = await auth.getAccessToken()
        const transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            type: 'OAuth2',
            user: process.env.MAIL_ADDRESS,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            accessToken: accessToken.token,
            refresh_token: accessToken.res.data.refresh_token,
          }
        });
        transporter.sendMail(mailOptions)
        });
  });
}
