import React, {useContext, useEffect, useState, useCallback} from 'react';
import Booking from '../booking/booking'
import {DayStyled} from './day.styled'
import {DayContext} from '../../contexts/day-context'
import { useMediaQuery } from 'react-responsive'

import './day.scss'

const useDayLogic = () => {
    const {context} = useContext(DayContext)
    const [isDayVisible, setIsDayVisible] = useState(false)
    const [isbookingVisible, setIsBookingVisibile] = useState(false)
    const [targetHour, setTargetHour] = useState('')
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 968px)' })

    useEffect(()=>{
      if (context) setIsDayVisible(context.visible)
    },[context])

    const handleClose = useCallback(() => 
    {setIsDayVisible(false)},[setIsDayVisible])
    
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
        setIsBookingVisibile(!isbookingVisible);
        setTargetHour(e.target.id) 
    }

    const closeBooking = () => {
        setIsBookingVisibile(false)
    }
    
    let dayPosition = context?context.position:[0,0]
    
    if (isTabletOrMobile) {
      dayPosition[0] = dayPosition[0]>220?dayPosition[0]-200:dayPosition[0]
      dayPosition[1] = dayPosition[1]>200?dayPosition[1]-200:dayPosition[1]
    } else {
      dayPosition[0] = dayPosition[0]>900?dayPosition[0]-200:dayPosition[0]
      dayPosition[1] = dayPosition[1]>300?dayPosition[1]-300:dayPosition[1]
    }

    return {
      context,
      isbookingVisible,
      isDayVisible,
      dayPosition,
      handleClose,
      handleClick,
      closeBooking,
      targetHour,
    }
   
}

const Day = () => {
    
  const {context,
         isbookingVisible,
         isDayVisible,
         dayPosition,
         handleClose,
         handleClick,
         closeBooking,
         targetHour} = useDayLogic()
    
   return (
        context?isDayVisible?(
        <DayStyled top={dayPosition[1]} left={dayPosition[0]}>
          <div>
            <div className='close' onClick={handleClose}>x</div>
            <div className='day-header'>{context.day.date}</div>
            <div>
              {context.day.periodsForMeeting.map((el: IPeriodsForMeetings) => <div
                  key={el.start}
                  id={context.day.date + el.start}
                  onClick={el.availble?handleClick:()=>{}}
                  className={el.availble?'availble':'busyday'}>
                  {el.start} - {el.end}</div>)
              }    
            </div>
            <div>
              {isbookingVisible?
                <Booking targetHour={targetHour} closeBooking={closeBooking}/>:null
              }
            </div>
          </div>
        </DayStyled>): null:null
    )
}

export default Day