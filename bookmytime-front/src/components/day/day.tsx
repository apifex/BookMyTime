import React, {useContext, useEffect, useState, useCallback} from 'react';
import Booking from '../booking/booking'
import {DayStyled} from './day.styled'
import {DayContext} from '../../contexts/day-context'
import {DayPositionContext} from '../../contexts/dayPosition-context'
import { useMediaQuery } from 'react-responsive'

import './day.scss'

const Day = () => {
    const date = useContext(DayContext)?.dayContext.date
    const visible = useContext(DayContext)?.dayContext.visible
    const setDayContext = useContext(DayContext)?.setDayContext
    
    const [bookingVisibility, setBookingVisibility] = useState(false)
    const [chosenHour, setChosenHour] = useState()

    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 968px)' })

    const handleClose = useCallback(() => 
    {setDayContext({date: {id: 0}, visible: false})},[setDayContext])
    
    const escFunction = useCallback((event) => {
        event.stopPropagation()
        if(event.keyCode === 27) {
          handleClose()
        }
      }, [handleClose]);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
          document.removeEventListener("keydown", escFunction, false);
        };
      }, [escFunction]);
    
    const handleClick = (e:any) => {
        setBookingVisibility(!bookingVisibility);
        setChosenHour(e.target.id) 
    }

    const closeBooking = () => {
        setBookingVisibility(false)
    }

    let dayPosition = useContext(DayPositionContext)?.dayPositionContext || [0,0]
    
    let top;
    let left;

    if (isTabletOrMobile) {
      left = dayPosition[0]>220?dayPosition[0]-200:dayPosition[0]
      top = dayPosition[1]>200?dayPosition[1]-200:dayPosition[1]
    } else {
      left = dayPosition[0]>900?dayPosition[0]-200:dayPosition[0]
      top = dayPosition[1]>300?dayPosition[1]-300:dayPosition[1]
    }
    
   
    return (
        visible?(
        <DayStyled top={top} left={left}>
          <div >
            <div className='close' onClick={handleClose}>x</div>
            <div className='day-header'>{date?.date}</div>
            <div>
            {date?.periodsForMeeting.map(el => <div 
                key={el.start}
                id={date.date + el.start}
                onClick={el.availble?handleClick:()=>{}}
                className={el.availble?'availble':'busyday'}>
                {el.start} - {el.end}</div>)
            }    
            </div>
            <div>
              {bookingVisibility?
                <Booking chosenHour={chosenHour} closeBooking={closeBooking}/>:null
              }
            </div>
          </div>
        </DayStyled>): null
    )
}

export default Day