import axios, { Method } from 'axios'
import { IMonthObject } from '../types'

async function errorHandler(promise: any) {
    try {
        const response = await promise()
        return response
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.log(error.response.data, error.response.status)
            } else if (error.request) {
                console.log(error.request)
            } else {
                console.log('Error', error)
            }
        }
    }
}

function requestToApi(endpoint = "calendar/check", params = {}, requestData = {}, method = 'GET' as Method) {
    return errorHandler(async () => {
        const { data } = await axios({
            method,
            url: `/api/${endpoint}`,
            params,
            data: requestData
        })
        return data
    })

}

export const getCalendar = async (year: string, month: string): Promise<IMonthObject[] | undefined> =>
    await requestToApi('calendar/check', { year, month })

export const addEventToCalendar = async (startTime: string, endTime: string, summary: string, description: string, attendees: { email: string }[]) =>
    await requestToApi('calendar/event', undefined, { startTime, endTime, summary, description, attendees }, 'POST')

export const sendEmail = async (email: string, eventDetails: { guestName: string, start: string, end: string, summary: string, location: string }) =>
    await requestToApi('email/send', undefined, { from: 'apifex@gmail.com', to: email, subject: 'Meeting with Apifex', eventDetails }, 'POST')
