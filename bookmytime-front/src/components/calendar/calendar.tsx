import React, { useEffect, useState } from 'react';
import './calendar.scss';

import Month from '../Month/month-class'

import oneDayPlanning from '../../utils/onedayplanning';

const days2: Array<string> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const months: Array<string> = ['January', 'February', 'March', 'April', 'May', 'Juny', 'July', 'August', 'September', 'October', 'November', 'December']


const Calendar = (props:any) => {
    const today = new Date()
    const [actualM, setMonth] = useState(today.getMonth())
    const [busy, setBusy] = useState('day')
    const [iks, setIks] = useState(['fdfsd'])

    const daysInMonth = (date: Date) => {
        
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
    console.log('test', iks)

    const actualMonth = daysInMonth(new Date(today.getFullYear(), actualM, 1))
    // const nextMonth = daysInMonth(new Date(today.getFullYear(), actualM+1, 1))
    
    
    useEffect(()=>{
        const checkForBusy = () => {
        const busyDays: any = []
        actualMonth.forEach(async day => {
                let dayForDate
                if (day.getDate()>9) {dayForDate = day.getDate()} else {dayForDate = `0${day.getDate()}`}
                let monthForDate
                if (day.getMonth()>8) {monthForDate = day.getMonth()+1} else {monthForDate = `0${day.getMonth()+1}`}
                let dateISO = `${day.getFullYear()}-${monthForDate}-${dayForDate}`
                console.log(dateISO);
                let result = await oneDayPlanning(dateISO)
                busyDays.push(result)
            })
            return busyDays    
        }
        let x = checkForBusy() 
        setIks(x)
        console.log(checkForBusy())
    }, [])
    
    const days: Array<string> = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const classForfirstDayinMonth: string = 'day ' + days[new Date(today.getFullYear(), today.getMonth(), 1).getDay()]
    console.log('class',classForfirstDayinMonth)
    const monthDaysToDisplay = [];
        
        const handleClick = (event: any) => {
            //test of handleClick
            console.log(event.target.id)
            event.target.className = event.target.className + ' otherMonth'
            console.log(event.target.className)
        }
        

    let firstDay = actualMonth.shift()
    monthDaysToDisplay.push(<div key={firstDay?.toString()} id={firstDay?.toString()} className={classForfirstDayinMonth} onClick={handleClick}>{firstDay?.getDate()}</div>)
    actualMonth.map((day)=>monthDaysToDisplay.push(<div key={day.toString()} id={day.toString()} className={busy} onClick={handleClick}>{day.getDate()}</div>))
    actualMonth.unshift(firstDay?firstDay:new Date())
    
    
    
    const actualMonthName: string = months[actualM%12]
    // const nextMonthName: string = months[(actualM+1)%12]
    
    // const actualMonth = daysInMonth(new Date(today.getFullYear(), actualM, 1))
    // const nextMonth = daysInMonth(new Date(today.getFullYear(), actualM+1, 1))

    
    return (
    <div>
        <div>
            <button onClick={() => setMonth(actualM-1) }>Prev</button>
            {actualMonthName} {actualMonth[0].getFullYear()}
            <button onClick={() => setMonth(actualM+1) }>Next</button>
        </div>
        <div className="calendarMonth">
        {days2.map((day)=><div key={day} className='legend'>{day}</div>)}
        {monthDaysToDisplay.map(day=>day)}
        </div>
        {/* <div>{nextMonthName} {nextMonth[0].getFullYear()}</div>
        <div className="calendarMonth">
        {days.map((day)=><div key={day} className='legend'>{day}</div>)}
        {nextMonth.monthDaysToDisplay.map(day=>day)}     
        </div> */}
    </div>
      
    )
}

export default Calendar