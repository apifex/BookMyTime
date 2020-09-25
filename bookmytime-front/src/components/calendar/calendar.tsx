import React from 'react';
import './calendar.scss';
import Month from '../Month/month'


const Calendar = (props:any) => {


    return(
        <div className="calendar">
            <div className='grid-one'>
            <Month today = {props.today}/>
            </div>
            
            <div className='grid-two'>
            <Month today = {new Date(2020, 9, 1)}/>
            </div>
        </div>
    )
}
    

export default Calendar