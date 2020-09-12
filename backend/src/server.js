import 'dotenv/config';
import cors from 'cors';
import express from 'express';

import { sendMail } from './mailer';
import { loadEventsList, createEvent, freeBusy } from  './calendar'

const port = process.env.PORT || 4000;
const app = express();

app.use(express.json());

app.use(cors())


app.get('/upcommingevents', (req, res)=>{
    if (req.body.value && req.body.value>0) {
    loadEventsList(req.body.value, (events)=> {
      if (events) {
        let list = []
        events.map((event) => list.push(event.summary))
        res.send(list)
      } else res.send('No upcomming events')
    })
  }
})

app.get('/freebusy', (req, res)=>{
  freeBusy(req.body.timeMin, req.body.timeMax, (busy)=>{
    res.send(busy)
  })
})


// PATTERN FOR EVENT 
// var event = {
//   'summary': 'Google I/O 2020',
//   'location': '800 Howard St., San Francisco, CA 94103',
//   'description': 'A chance to hear more about Google\'s developer products.',
//   'start': {
//     'dateTime': '2020-08-27T09:00:00-07:00',
//     'timeZone': 'America/Los_Angeles',
//   },
//   'end': {
//     'dateTime': '2020-08-27T17:00:00-07:00',
//     'timeZone': 'America/Los_Angeles',
//   },
//   'recurrence': [
//     'RRULE:FREQ=DAILY;COUNT=2'
//   ],
//   'attendees': [
//     {'email': 'apifex@gmail.com'},
//   ],
//   'reminders': {
//     'useDefault': false,
//     'overrides': [
//       {'method': 'email', 'minutes': 24 * 60},
//       {'method': 'popup', 'minutes': 10},
//     ],
//   },
// };


app.post('/createevent', (req, res) =>{
  createEvent(req.body, (createdAt) => {
    console.log('event created at ',createdAt);
    res.send(`event created at ${createdAt}` )
  }); 
})

// PATTERT FOR MAIL 
// const mailOptions = {
//   from: "pprzeb@gmail.com",
//   to: "apifex@gmail.com",
//   subject: "Node.js Email with Secure OAuth",
//   generateTextFromHTML: true,
//   html: "<b>hello johneeeee</b>"
// };


app.post('/sendmail', (req, res) =>{
  console.log('email send'),
  sendMail(req.body)
  res.send('email sent')
})


app.listen(port, () => 
console.log(`App is listening on port ${port}`));

