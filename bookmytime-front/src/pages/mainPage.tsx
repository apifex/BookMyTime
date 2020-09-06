import React, { ReactElement } from 'react';
import {Calendar} from '../components/calendar'
const MainPage = ():ReactElement => {

    return(
        <div>
            <Calendar />
            <h1>Book My Time</h1>
        </div>
        
    )

}

export default MainPage