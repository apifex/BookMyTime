import React, {useEffect, useState} from 'react';
import styled from 'styled-components';


// import oneDayPlanning from '../../utils/onedayplanning';
import './day.scss'

interface IProps {
    dayPosition: Array<number>,
    dayVisibility: boolean,
    dayToDisplay: Date
}

const Day = (props:IProps) => {
    const date = props.dayToDisplay
    

    const [dayT, setDayT] = useState([{
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
              const d = checkLocaly(result, dateISO)
              setDayT(d)       
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
    },[props.dayToDisplay])


    const DDy = styled.div`
    position: absolute;
    top: ${props.dayPosition[1]}px;
    left: ${props.dayPosition[0]}px;
    background-color: rgba(0, 0, 0, 0.226);
    `
    
    return (
    <DDy>
    {props.dayVisibility?
        <div>
        {dayT.map(el => <div 
        key={el.start} 
        className={el.availble?'availble':'busy'}>
            {new Date(el.start).getHours()}:{new Date(el.start).getMinutes()} - {new Date(el.end).getHours()}:{new Date(el.end).getMinutes()}</div>)}    
        </div>:
        null
    }
    </DDy>
    )

}

export default Day