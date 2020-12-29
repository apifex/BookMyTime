import 'dotenv/config';
import cors from 'cors';
import express from 'express';

import {createEvent, freeBusy, sendMail} from './googleapis';

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors())

app.post('/freebusy', async (req, res) =>{
  try {
    const busy = await freeBusy(req.body.timeMin, req.body.timeMax)
    res.send(busy)
  } catch (err) {
    console.log("Error on server, when calling freebusy")
  }
})

// PATTERN FOR EVENT 
// let event = {
//   'summary': 'event name',
//   'description': 'some description',
//   'start': {
//     'dateTime': '2020-08-27T09:00:00-07:00'
//   },
//   'end': {
//     'dateTime': '2020-08-27T17:00:00-07:00'
//   }
// };


app.post('/createevent', async (req, res) =>{
  try{
    const response = await createEvent(req.body)
    res.send(response)
  } catch (err) {
    console.log("error on server, when creating event", err)
  }
})

// PATTERN FOR MAIL
// let mail = {
//   'to': 'someadress@blabla.com',
//   'from': 'myadresse@gmail.com',
//   'subject': 'some subject'
//   'message': 'some message'
// }

app.post('/sendmail', async (req, res) =>{
  try{
    const response = await sendMail(req.body)
    res.send(response)
  } catch(err) {
    console.log("error on server, when sending mail", err)
  }
})

app.listen(port, () => 
console.log(`App is listening on port ${port}`));