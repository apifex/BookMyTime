import React, { useContext, useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { DayContext } from '../../contexts/day-context'
import './month.styles.scss'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const daysSm =['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const useMonthLogic = ({month}: IMonthProps) => {
    const [daysInMonth, setDaysInMonth]= useState([{id: 0,
                                                    date: 'string',
                                                    dayOfWeek: 0,
                                                    availble: true,
                                                    periodsForMeeting:
                                                         [{start: 'string',
                                                          end: 'string',
                                                          availble: true}]}])

    const {context, setContext} = useContext(DayContext)                                                  
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 968px)' })
    
    useEffect(()=>{
        const checkCalendar = async () => {
            let daysInMonth: IDaysInMonth[] = []
            try{
                let monthToCheck =
                {
                    "m": `${month.m<9?'0'+(month.m+1):month.m+1}`,
                    "y": month.y,
                    "length": month.length,
                }
                const response = await fetch ('http://localhost:5000/checkcalendar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json;charset=utf-8' },
                                body: JSON.stringify(monthToCheck)})
                const result = await response.json()
                daysInMonth = result
            } catch (err) {
                console.log("error when calling checkCalendar", err)
            }
            setDaysInMonth(daysInMonth)
        }
       checkCalendar() 
    }, [month])
    
    const handleClick = (e: any) => {
        if (setContext && context) {
            if (e.target.id === context.day.id.toString() && context.visible === true) {
                setContext({ day: daysInMonth[Number(e.target.id)-1],
                    position: [e.clientX, e.clientY],
                    visible: false});
            } else {
                setContext({ day: daysInMonth[Number(e.target.id)-1],
                    position: [e.clientX, e.clientY],
                    visible: true});
            }
        }   
    }
    
    const daysToDisplay: React.ReactElement[] = []; // type???
    
    daysInMonth.forEach((day): void => {
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

    return {
        daysToDisplay,
        isTabletOrMobile,
        handleClick,
    }
}


const Month = (month: IMonthProps) => {
    
    const {daysToDisplay, isTabletOrMobile} = useMonthLogic(month)
        
    return(
            isTabletOrMobile?
            <div className="calendarMonth-sm">
            {daysSm.map((day) => <div key={day} className='legend-sm'>{day}</div>)}
            {daysToDisplay.map(day => day)}
            </div>
            :
            <div className="calendarMonth">
            {days.map((day) => <div key={day} className='legend'>{day}</div>)}
            {daysToDisplay.map(day=>day)}
            </div>
    )
}

export default Month