import React, {useContext, useEffect, useState} from 'react'
import {DayContext} from '../../contexts/day-context'
import {DayPositionContext} from '../../contexts/dayPosition-context'
import './month.styles.scss'

interface IProps{
    today: Date
}

const Month = (props: IProps) => {
    const today = props.today
    const [actualMonth, setActualMonth] = useState([today])
    const [busyHours, setBusyHours] = useState([[{start: 'string', end:'string', availble: true}]])
    const dayContext = useContext(DayContext)?.dayContext
    const setDayContext = useContext(DayContext)?.setDayContext
    const setDayPositionContext = useContext(DayPositionContext)?.setDayPositionContext

    console.log('log from month', dayContext)
    useEffect(()=>{
        const calculateDaysInMonth = (date: Date):Array<Date> => {
            const daysInMonth: Array<Date> = [];
            const lastDayinMonth: number = new Date(date.getFullYear(), date.getMonth()+1,0).getDate()
            for (let i=0; i<lastDayinMonth; i++) {
                let y: number = date.getFullYear()
                let m: number = date.getMonth();
                let d: number = 1+i
                daysInMonth.push(new Date(y,m,d))
            }
            return daysInMonth
        }
        setActualMonth(calculateDaysInMonth(today))
        
    },[today]);

    useEffect(()=>{
        if (actualMonth.length<2) return
        const checkBusy = async () => {    
            let monthToCheck =
                {
                    "timeMin": `${actualMonth[0].toISOString()}`,
                    "timeMax": `${actualMonth[actualMonth.length-1].toISOString()}`
                }
            const response = await fetch ('http://localhost:4000/freebusy', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(monthToCheck)
              });
              const result = await response.json()
              const busy:any = []
              actualMonth.forEach(day=>{
                let dayForDate: string
                if (day.getDate()>9) {dayForDate = day.getDate().toString()} else {dayForDate = `0${day.getDate()}`}
                let monthForDate
                if (day.getMonth()>8) {monthForDate = day.getMonth()+1} else {monthForDate = `0${day.getMonth()+1}`}
                let dateISO = `${day.getFullYear()}-${monthForDate}-${dayForDate}`
                busy.push(checkLocaly(result, dateISO.toString()))
              })
              setBusyHours(busy)
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
    }, [actualMonth])
    
    const handleClick = (e:any) => {
        console.log('from month',[e.clientX, e.clientY]);
        console.log('from month', e.target.id)
        setDayContext({date: new Date(e.target.id), visible: true})
        setDayPositionContext([e.clientX, e.clientY])
    }
    
    const days: Array<string> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    let dayx
    if (actualMonth[0].getDay()-1>=0) {dayx = actualMonth[0].getDay()-1} else dayx = 6
    const classForfirstDayinMonth: string = 'day ' + days[dayx]
        
    const daysToDisplay:Array<any> = [];
    
    let busyFirst = 'busy'
    for (let i = 0; i<10; i++) {
        if (busyHours[0][i].availble) {busyFirst = ''; i = 10}
    }
    
    let firstDay = actualMonth.shift()
    daysToDisplay.push(<div key={'firstDay'} 
                            id={firstDay?.toString()} 
                            className={`${classForfirstDayinMonth} ${busyFirst}`}
                            onClick={busyFirst==='busy'?()=>{}:handleClick}>
                            {firstDay?.getDate()}
                        </div>)
    
    actualMonth.map((day)=>{
        
        let busy = true
        if (busyHours.length === actualMonth.length+1) {
        for (let i = 0; i<10; i++) {
            if (busyHours[day.getDate()-1][i].availble) {busy = false; i = 10}
        }}
        if (day.getDay()>0 && day.getDay()<6) {
            daysToDisplay.push(<div key={day.toString()} 
            id={day.toISOString()}
            className={busy?'day busy':'day'}
            onClick={busy?()=>{}:handleClick}>
            {day.getDate()}
            </div>)    
        } else {
            daysToDisplay.push(<div key={day.toString()} 
            id={day.toISOString()}
            className={'day busy'}
            >
            {day.getDate()}
            </div>)
        }
        
                            return null})

    actualMonth.unshift(firstDay?firstDay:new Date())
    
    return(
            <div className="calendarMonth">
            {days.map((day)=><div
                key={day} 
                className='legend'>{day}</div>)}
                {daysToDisplay.map(day=>day)}
            </div>   
    )
}

export default Month