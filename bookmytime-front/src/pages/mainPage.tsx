import React from 'react';
import {Calendar} from '../components/calendar'
import Day from '../components/day/day'


const MainPage = () => {

    return(
        <div>
            <h1>Book My Time</h1>

            <Calendar />
            <Day />
            
            
        </div>
        
    )

}

export default MainPage