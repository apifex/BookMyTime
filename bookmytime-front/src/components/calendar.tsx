import React from 'react';
import './calendar.scss';

export const Calendar = () => {
    const today: Date = new Date();
    
    const days: Array<string> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const months: Array<string> = ['January', 'February', 'March', 'April', 'May', 'Juny', 'July', 'August', 'September', 'October', 'November', 'December']
    
    let actualMonthName: string = months[today.getMonth()]
    let nextMonthName: string = months[today.getMonth()+1]
    
    let nextMonth = new Date(today.getFullYear(), today.getMonth()+1, 1)

    const daysofmonth = (date: Date) => {
        let firstDayinMonth = new Date(date.getFullYear(), date.getMonth(), 1)
        let classForfirstDayinMonth = 'day ' + days[firstDayinMonth.getDay()-1]
        let monthDays = [];
               
        let lastDayinMonth = new Date(date.getFullYear(), date.getMonth()+1,0).getDate()
    
        for (let i=1; i<lastDayinMonth; i++) {
            let y = date.getFullYear()
            let m = date.getMonth();
            let d = 1+i
            monthDays.push(new Date(y,m,d))
        }
    return {firstDayinMonth, classForfirstDayinMonth, monthDays}
    }

    const handleClick = (event: any) => {
        //test of handleClick
        console.log(event.target.id)
        event.target.className = event.target.className + ' otherMonth'
        console.log(event.target.className)
    }
    
    return (
    <div>
        <div>{actualMonthName}</div>
        <div className="calendarMonth">
    {days.map((day)=><div key={day} className='legend'>{day}</div>)}
            <div key='first' id={daysofmonth(today).firstDayinMonth.toString()} className={daysofmonth(today).classForfirstDayinMonth} onClick={handleClick}>1</div>
            {daysofmonth(today).monthDays.map(day=><div key={day.toString()} id={day.toString()} className="day" onClick={handleClick}>{day.getDate()}</div>)}
        </div>
        <div>{nextMonthName}</div>
        <div className="calendarMonth">
    {days.map((day)=><div key={day} className='legend'>{day}</div>)}
            <div key='first2' id={daysofmonth(nextMonth).firstDayinMonth.toString()} className={daysofmonth(nextMonth).classForfirstDayinMonth} onClick={handleClick}>1</div>
            {daysofmonth(nextMonth).monthDays.map(day=><div key={day.toString()} id={day.toString()} className="day" onClick={handleClick}>{day.getDate()}</div>)}     
        </div>
    </div>
      
    )
}

