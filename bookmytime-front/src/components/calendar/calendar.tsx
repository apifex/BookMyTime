import React, {useState} from 'react';
import './calendar.scss';
import Month from '../Month/month'
import Day from '../day/day'


import {DayContext} from '../../contexts/day-context'
import {DayPositionContext} from '../../contexts/dayPosition-context'

const Calendar = (props:any) => {
    
    const [dayContext, setDayContext] = useState({date: props.today, visible: false})
    const [dayPositionContext, setDayPositionContext] = useState([0,0])
    
    
    return(
        <DayContext.Provider value={{dayContext, setDayContext}}>
            <DayPositionContext.Provider value={{dayPositionContext, setDayPositionContext}}>
        <div className="calendar">
            <div className='grid-one'>
            <Month today = {props.today}/>
            </div>
            <div className='grid-two'>
            <Month today = {new Date(2020, 9, 1)}/>
            </div>
            <Day/>
              
            
        </div>
            </DayPositionContext.Provider>
        </DayContext.Provider>
    )
}

export default Calendar