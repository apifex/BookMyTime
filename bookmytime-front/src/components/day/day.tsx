import React, {useEffect, useState} from 'react';
import styled from 'styled-components';


import Booking from '../booking/Booking'
import './day.scss'

interface IProps {
    dayPosition: Array<number>,
    dayVisibility: boolean,
    dayToDisplay: Date
}

const Day = ({dayVisibility = false, ...props}:IProps) => {
    const date = props.dayToDisplay

    const [bookingPosition, setBookingPosition] = useState([0,0])
    const [bookingVisibility, setBookingVisibility] = useState(false)
    

    const [days, setDays] = useState([{
        "start":`2020-09-01T09:00:00+02:00`,
        "end": `2020-09-01T09:55:00+02:00`,
        availble: true,
    }])
    
    useEffect(()=>{
        
        const checkBusy = async () => {    
            let dayForDate: string
                if (date.getDate()>9) {dayForDate = date.getDate().toString()} else {dayForDate = `0${date.getDate()}`}
                let monthForDate
                if (date.getMonth()>8) {monthForDate = date.getMonth()+1} else {monthForDate = `0${date.getMonth()+1}`}
                const dateISO = `${date.getFullYear()}-${monthForDate}-${dayForDate}`
            let dayToCheck =
                {
                    "timeMin": `${dateISO}T08:00:00+02:00`,
                    "timeMax": `${dateISO}T18:00:00+02:00`
                }
            const response = await fetch ('http://localhost:4000/freebusy', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(dayToCheck)
              });
              const result = await response.json()
              const day = checkLocaly(result, dateISO)
              setDays(day)       
        }

        const checkLocaly = (busy:any, day:string) => {
            const periodsForMeeting = [
                {
                    "start": `${day}T08:00:00+02:00`,
                    "end": `${day}T08:55:00+02:00`,
                    availble: true,
                },
                {
                    "start": `${day}T09:00:00+02:00`,
                    "end": `${day}T09:55:00+02:00`,
                    availble: true,
                },
                {
                    "start": `${day}T10:00:00+02:00`,
                    "end": `${day}T10:55:00+02:00`,
                    availble: true,
                },
                {
                    "start": `${day}T11:00:00+02:00`,
                    "end": `${day}T11:55:00+02:00`,
                    availble: true,
                },
                {
                    "start": `${day}T12:00:00+02:00`,
                    "end": `${day}T12:55:00+02:00`,
                    availble: true,
                },
                {
                    "start": `${day}T13:00:00+02:00`,
                    "end": `${day}T13:55:00+02:00`,
                    availble: true,
                },
                {
                    "start": `${day}T14:00:00+02:00`,
                    "end": `${day}T14:55:00+02:00`,
                    availble: true,
                },
                {
                    "start": `${day}T15:00:00+02:00`,
                    "end": `${day}T15:55:00+02:00`,
                    availble: true,
                },
                {
                    "start": `${day}T16:00:00+02:00`,
                    "end": `${day}T16:55:00+02:00`,
                    availble: true,
                },
                {
                    "start": `${day}T17:00:00+02:00`,
                    "end": `${day}T17:55:00+02:00`,
                    availble: true,
                },
            ]
            for (let i = 0; i<busy.length; i++) {
                let busyevent = busy[i]
                for (let k = 0; k<periodsForMeeting.length; k++){
                    let timeformeet = periodsForMeeting[k]
                    if (busyevent.start>=timeformeet.start && busyevent.end<=timeformeet.end) timeformeet.availble = false
                    if (timeformeet.start>=busyevent.start && timeformeet.end<=busyevent.end) timeformeet.availble = false
                    if (timeformeet.end>busyevent.start && timeformeet.end<busyevent.end) timeformeet.availble = false
                }
            }
            return periodsForMeeting
        }
       checkBusy()
    },[date])

    const handleClick = (e:any) => {
        setBookingPosition([e.clientX, e.clientY]);
        setBookingVisibility(!bookingVisibility)
    }
    const DDy = styled.div`
    position: absolute;
    top: ${props.dayPosition[1]}px;
    left: ${props.dayPosition[0]}px;
    background-color: #A8DADC;
    width: 200px;
    padding: 10px;
    border-radius: 5px;
    border-width: 1px;
    border-style: solid; 
    border-color: #457B9D;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    `
    
    return (
    
    dayVisibility?
        <div>
        <DDy>
        <div>
        {days.map(el => <div 
            key={el.start}
            id={el.start}
            onClick={handleClick}
            className={el.availble?'availble':'busyday'}>
            {new Date(el.start).getHours()}:{new Date(el.start).getMinutes()} - {new Date(el.end).getHours()}:{new Date(el.end).getMinutes()}</div>)}    
        </div>
        </DDy>
        <div>
        <Booking bookingPosition={bookingPosition} visibility={bookingVisibility}/>
        </div>
        </div>
        :
        null
    
    
    )

}

export default Day