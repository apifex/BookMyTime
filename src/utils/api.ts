import axios from 'axios'
import { IMonthObject } from '../types'

async function errorHandler(promise: any) {
    try {
        const response = await promise()
        return response
    }
    catch (err) {
        //TODO
        //@ts-ignore
        console.log('in handler', err.response.data)
    }
}

export const getCalendar = (year: string, month: string): Promise<IMonthObject[] | undefined> => {
    return errorHandler(async () => {
        const response = await axios({
            method: 'get',
            url: `http://localhost:4000/calendar/check`,
            params: {
                year,
                month
            }
        })
        return response.data
    })

}

export const addEventToCalendar = async (startTime: string, endTime: string, summary: string, description: string, attendees: { email: string }[]) => {
    return errorHandler(async () => {
        const response = await axios({
            method: 'POST',
            url: `http://localhost:4000/calendar/event`,
            data: {
                startTime,
                endTime,
                summary,
                description,
                attendees,
            }
        })
        return response.data
    })
}

export const sendEmail = async (email: string, eventDetails: { guestName: string, start: string, end: string, summary: string, location: string }) => {
    return errorHandler(async () => {
        const response = await axios({
            method: 'POST',
            url: `http://localhost:4000/email/send`,
            data: {
                //TODO
                from: 'apifex@gmail.com',
                to: email,
                subject: 'Meeting with Apifex',
                eventDetails: eventDetails
            }
        })
        return response.data
    })

}