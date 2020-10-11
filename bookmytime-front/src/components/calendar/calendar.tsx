import React, {useEffect, useState} from 'react';
import './calendar.scss';
import Month from '../Month/month'
import Day from '../day/day'


import {DayContext} from '../../contexts/day-context'
import {DayPositionContext} from '../../contexts/dayPosition-context'
import WithSpinner from '../spinner/spinner'

const MonthWithSpinner = WithSpinner(Month)

const Months = ['January', 'February', 'Mars', 'April', 'May', 'June', 'July', 'August', 'Septembre', 'October', 'November', 'December']

const Calendar = (props:any) => {
    const [isLoading, setIsLoading] = useState(true)
    const [dayContext, setDayContext] = useState({date: props.today, visible: false})
    const [dayPositionContext, setDayPositionContext] = useState([0,0])
    const [actualMonth, setActualMonth] = useState({m: 0, y: 2020})
    const [nextMonth, setNextMonth] = useState({m: 0, y: 2020})
    useEffect(()=>{
        setActualMonth({m: props.today.getMonth(), y: props.today.getFullYear()})
        let nextM = (props.today.getMonth()+1<12)?props.today.getMonth()+1:0
        let nextY = (nextM===0)?props.today.getFullYear()+1:props.today.getFullYear()
        setNextMonth({m: nextM, y: nextY})
        setIsLoading(false)
    }, [props.today])

    const handleClick = (e:any) => {
        let nextM = (actualMonth.m+1<12)?actualMonth.m+1:0
        let nextY = (nextM===0)?actualMonth.y+1:actualMonth.y
        
        let previousM = (actualMonth.m-1>=0)?actualMonth.m-1:11
        let previousY = (previousM===11)?actualMonth.y-1:actualMonth.y

        if (e.target.id==='previous') {
            setNextMonth({m: actualMonth.m, y: actualMonth.y})
            setActualMonth({m: previousM, y: previousY})
            
        }
        if (e.target.id==='next') {
            setActualMonth({m: nextM, y: nextY})
            setNextMonth({m: (nextM+1<12)?nextM+1:0, y: (nextM===11)?nextY+1:nextY})
        }
        
    }

    return(
        <DayContext.Provider value={{dayContext, setDayContext}}>
            <DayPositionContext.Provider value={{dayPositionContext, setDayPositionContext}}>
        <div className="calendar">
            <div className='grid-one'>
            <h3><span onClick={handleClick} id='previous' className='previous'>Previous</span> {Months[actualMonth.m]} {actualMonth.y}</h3>
            <MonthWithSpinner month={actualMonth} isLoading={isLoading}/>
            </div>
            <div className='grid-two'>
            <h3>{Months[nextMonth.m]} {nextMonth.y} <span onClick={handleClick} className='next' id='next'>Next</span></h3>
            <Month month = {nextMonth}/>
            </div>
            
            <Day/>   
        </div>
            </DayPositionContext.Provider>
        </DayContext.Provider>
    )
}

export default Calendar