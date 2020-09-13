import React, { useState } from 'react';
import './calendar.scss';

const days: Array<string> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const days2: Array<string> = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months: Array<string> = ['January', 'February', 'March', 'April', 'May', 'Juny', 'July', 'August', 'September', 'October', 'November', 'December']

const daysofmonth = (date: Date) => {
    
    let monthDays: Array<Date> = [];
       
    let lastDayinMonth: number = new Date(date.getFullYear(), date.getMonth()+1,0).getDate()

    for (let i=0; i<lastDayinMonth; i++) {
        let y = date.getFullYear()
        let m = date.getMonth();
        let d = 1+i
        monthDays.push(new Date(y,m,d))
    }
    const handleClick = (event: any) => {
        //test of handleClick
        console.log(event.target.id)
        event.target.className = event.target.className + ' otherMonth'
        console.log(event.target.className)
    }

    let classForfirstDayinMonth: string = 'day ' + days2[new Date(date.getFullYear(), date.getMonth(), 1).getDay()]

    let monthDaysToDisplay = [];

    let firstDay = monthDays.shift()
    monthDaysToDisplay.push(<div key={firstDay?.toString()} id={firstDay?.toString()} className={classForfirstDayinMonth} onClick={handleClick}>{firstDay?.getDate()}</div>)
    monthDays.map((day)=>monthDaysToDisplay.push(<div key={day.toString()} id={day.toString()} className="day" onClick={handleClick}>{day.getDate()}</div>))
    monthDays.unshift(firstDay?firstDay:new Date())
return {monthDaysToDisplay, monthDays}
}

export const Calendar = () => {
    const today: Date = new Date();

    const [actualM, setMonth] = useState(today.getMonth())
    
    let actualMonthName: string = months[actualM%12]
    let nextMonthName: string = months[(actualM+1)%12]
    
    let actualMonth = daysofmonth(new Date(today.getFullYear(), actualM, 1))
    let nextMonth = daysofmonth(new Date(today.getFullYear(), actualM+1, 1))

    
    return (
    <div>
        <div>
            <button onClick={() => setMonth(actualM-1) }>Prev</button>
            {actualMonthName} {actualMonth.monthDays[0].getFullYear()}
            <button onClick={() => setMonth(actualM+1) }>Next</button>
        </div>
        <div className="calendarMonth">
        {days.map((day)=><div key={day} className='legend'>{day}</div>)}
        {actualMonth.monthDaysToDisplay.map(day=>day)}
        </div>
        <div>{nextMonthName} {nextMonth.monthDays[0].getFullYear()}</div>
        <div className="calendarMonth">
        {days.map((day)=><div key={day} className='legend'>{day}</div>)}
        {nextMonth.monthDaysToDisplay.map(day=>day)}     
        </div>
    </div>
      
    )
}

