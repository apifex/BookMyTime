import express from 'express';
import cors from 'cors';

import { checkCalendar } from './checkCalendar';
import { createEvent, sendMail } from './googleApis'
import { IMonth } from './checkCalendar';
import { IEvent, IMail } from './googleApis';

const PORT = process.env.PORT || 5000
const server = express();

server.use(express.json())
server.use(cors())
    
const validateCheckCal = (data: IMonth) => {
  if (!data.length || !data.m || !data.y) return false
  return true
}

server.post('/checkcalendar', async (req, res) => {
    try{
        if (!validateCheckCal(req.body)) {
          throw Error('Wrongs request datas on checkcalendar endpoint')
        } else {
          const daysInMonth = await checkCalendar(req.body);
          res.send(daysInMonth)
        }
    } catch(error) {
        console.log("error on server, when checking calendar: ", error)
    }
    
})

const validateCreateEvent = (data: IEvent) => {
  if (!data.description || !data.start || !data.end || !data.summary) return false
  return true
}

server.post('/createevent', async (req, res) =>{
    try{
      if (!validateCreateEvent(req.body)) {
       throw Error("Wrongs request datas on create event endpoint ") 
      } else {
        const response = await createEvent(req.body)
        res.send(response)
      }
    } catch (err) {
      console.log("error on server, when creating event", err)
    }
  })

  const validateSendMail = (data: IMail) => {
    if (!data.from || !data.to || !data.subject || !data.message) return false
    return true
  }

  server.post('/sendmail', async (req, res) =>{
    try{
      if (!validateSendMail(req.body)) {
        throw Error("Wrongs request datas on sendmail endpoint ")
      } else {
        const response = await sendMail(req.body)
        res.send(response)
      }
    } catch(err) {
      console.log("error on server, when sending mail", err)
    }
  })

//TODO 
//endpoint for Admin, for configuration and connection with googleAPI
//   server.get('/admin', async (req, res) => {
//       const res = await getAccessToken
//   } )

server.listen(PORT, () => console.log(`Listening on port ${PORT}`))