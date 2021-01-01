
import React, {useContext, useEffect, useState} from 'react'
import { useMediaQuery } from 'react-responsive'
import {DayContext} from '../../contexts/day-context'
import {DayPositionContext} from '../../contexts/dayPosition-context'
import './month.styles.scss'


interface IProps{
    month: {
        m: number,
        y: number
    }
}

const Month = ({month}: IProps) => {
    
    const [daysInMonth, setDaysInMonth] = useState([{id: 0, date: 'string', dayOfWeek: 0, availble: true, periodsForMeetings: [{start: 'string', end: 'string', availble: true}]}])
    const setDayContext = useContext(DayContext)?.setDayContext
    const dayContext = useContext(DayContext)?.dayContext
    const setDayPositionContext = useContext(DayPositionContext)?.setDayPositionContext
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 968px)' })
    
    useEffect(()=>{
        const checkBusy = async () => {
            let daysInMonth:any = []
            try{
                let periodToCheck =
                {
                    "m": `${month.m<9?'0'+(month.m+1):month.m+1}`,
                    "y": month.y
                }
                const response = await fetch ('http://localhost:5000/freebusymonth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json;charset=utf-8' },
                                body: JSON.stringify(periodToCheck)})
             
                const result = await response.json()
                daysInMonth = result
                
            } catch (err) {
                console.log("error when calling freebusy", err)
            }
            setDaysInMonth(daysInMonth)
        }
       checkBusy() 
    }, [month])
    
    const handleClick = (e:any) => {
        if (dayContext?.date.id.toString() === e.target.id.toString()) {
            return setDayContext({date: {id: 0}, visible: false});
        }
        setDayContext({date: daysInMonth[Number(e.target.id)-1], visible: true});
        setDayPositionContext([e.clientX, e.clientY]);
    }
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const daysSm =['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
    
    const daysToDisplay:Array<any> = [];
    
    daysInMonth.forEach((day):void => {
        if (day.id === 1) {
            let fstDay
            if (day.dayOfWeek-1>=0) {fstDay = day.dayOfWeek-1} else fstDay = 6
            daysToDisplay.push(<div key={day.date} 
                                    id={day.id.toString()} 
                                    className={day.availble?`day ${days[fstDay]}`: `day ${days[fstDay]} busy`}
                                    onClick={day.availble?handleClick:()=>{}}>
                                    {day.id}
                               </div>)
        } else {
            daysToDisplay.push(<div key={day.date} 
                                    id={day.id.toString()}
                                    className={day.availble?'day':'day busy'}
                                    onClick={day.availble?handleClick:()=>{}}>
                                    {day.id}
                               </div>
                )    
            }
        }
    )

        
    return(
            isTabletOrMobile?
            <div className="calendarMonth-sm">
            {daysSm.map((day)=><div
                key={day}
                className='legend-sm'>{day}</div>)}
            {daysToDisplay.map(day=>day)}
            </div>
            :
            <div className="calendarMonth">
            {days.map((day)=><div
                key={day}
                className='legend'>{day}</div>)}
            {daysToDisplay.map(day=>day)}
            </div>   
    )
}

export default Month