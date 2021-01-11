import express from 'express';
import cors from 'cors';

import {checkCalendar} from './checkCalendar';

const PORT = process.env.PORT || 5000
const server = express();

server.use(express.json())
server.use(cors())
    
server.post('/checkcalendar', async (req, res) => {
    try{
        const daysInMonth = await checkCalendar(req.body);
        res.send(daysInMonth)
    } catch(error) {
        console.log("error on checkcalendar: ", error)
    }
    
})

server.listen(PORT, () => console.log(`Listening on port ${PORT}`))