import React, {useState, useEffect} from 'react';
import WithSpinner from '../../components/spinner/spinner'
import { useMediaQuery } from 'react-responsive';
import {DayPositionContext} from '../../contexts/dayPosition-context'
import {DayContext} from '../../contexts/day-context'
import Month from '../../components/month/month';
import Day from '../../components/day/day';
import Aside from '../../components/aside/aside'
import './mainPage.scss'

const MonthWithSpinner = WithSpinner(Month)
const Months = ['January', 'February', 'Mars', 'April', 'May', 'June', 'July', 'August', 'Septembre', 'October', 'November', 'December']

const MainPage = () => {
    
    const [today] = useState(new Date());
    const [isLoading, setIsLoading] = useState(true)
    const [dayContext, setDayContext] = useState({
                                                    date:
                                                        {id: 0,
                                                        date: 'string',
                                                        dayOfWeek: 0,
                                                        availble: true,
                                                        periodsForMeeting: [
                                                            {start: 'string',
                                                            end: 'string',
                                                            availble: true}]
                                                        },
                                                    visible:false
                                                })
    const [dayPositionContext, setDayPositionContext] = useState([0,0])
    const [actualMonth, setActualMonth] = useState({m: 0, y: 2020})
    const [nextMonth, setNextMonth] = useState({m: 0, y: 2020})
    
    useEffect(()=>{
        setActualMonth({m: today.getMonth(), y: today.getFullYear()})
        let nextM = (today.getMonth()+1<12)?today.getMonth()+1:0
        let nextY = (nextM===0)?today.getFullYear()+1:today.getFullYear()
        setNextMonth({m: nextM, y: nextY})
        setIsLoading(false)
    }, [today])

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
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 968px)' })

    return(
        <DayContext.Provider value={{dayContext, setDayContext}}>
            <DayPositionContext.Provider value={{dayPositionContext, setDayPositionContext}}>
            {isTabletOrMobile?
            <div>
                <div className="calendar-sm">
                <Aside/>
                    <div>
                    <h3><span onClick={handleClick} id='previous' className='previous'>Previous</span>
                         {Months[actualMonth.m]}  {actualMonth.y}
                         <span onClick={handleClick} className='next' id='next'>Next</span>
                    </h3>
                        <MonthWithSpinner month={actualMonth} isLoading={isLoading}/>
                    </div>
                    <Day/>   
                </div>
            </div>
            :
            <div>    
                <div className="calendar">
                <Aside/>
                    <div>
                        <h3><span onClick={handleClick} id='previous' className='previous'>Previous</span> {Months[actualMonth.m]} {actualMonth.y}</h3>
                        <MonthWithSpinner month={actualMonth} isLoading={isLoading}/>
                    </div>
                    
                    <div>
                        <h3>{Months[nextMonth.m]} {nextMonth.y} <span onClick={handleClick} className='next' id='next'>Next</span></h3>
                        <MonthWithSpinner month = {nextMonth} isLoading={isLoading}/>
                    </div>
                    <Day/>   
                </div>
            </div>
            }
            </DayPositionContext.Provider>
        </DayContext.Provider> 
    )
}

export default MainPage