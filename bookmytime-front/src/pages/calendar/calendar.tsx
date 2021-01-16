import React, {useState, useEffect} from 'react';
import { useMediaQuery } from 'react-responsive';
import { DayContext } from '../../contexts/day-context';
import Month from '../../components/month/month';
import Day from '../../components/day/day';
import Aside from '../../components/aside/aside';
import './calendar.scss'

const Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'Septembre', 'October', 'November', 'December']

const useCalendarLogic = () => {
    const [today] = useState(new Date());
    const [firstMonth, setFirstMonth] = useState({m: 0, y: 2020, length: 30})
    const [secondMonth, setSecondMonth] = useState({m: 0, y: 2020, length: 30})
    
    useEffect(()=>{
        setFirstMonth({m: today.getMonth(), y: today.getFullYear(), length: new Date(today.getFullYear(), today.getMonth()+1, 0).getDate()})
        let secondM = (today.getMonth()+1<12)?today.getMonth()+1:0
        let secondY = (today.getMonth()+1<12)?today.getFullYear():today.getFullYear()+1
        let secondLength = new Date((today.getMonth()+1<12)?today.getFullYear():today.getFullYear()+1, ((today.getMonth()+1<12)?today.getMonth()+1:0)+1, 0).getDate()
        setSecondMonth({m: secondM, y: secondY, length: secondLength})
    }, [today])

    const handleClick = (e:any) => { // type??
        let nextM = (secondMonth.m+1<12)?secondMonth.m+1:0
        let nextY = (nextM===0)?secondMonth.y+1:secondMonth.y
        let nextLength = new Date((nextM===0)?secondMonth.y+1:secondMonth.y, ((secondMonth.m+1<12)?secondMonth.m+1:0)+1, 0).getDate()

        let previousM = (firstMonth.m-1>=0)?firstMonth.m-1:11
        let previousY = (previousM===11)?firstMonth.y-1:firstMonth.y
        let previousLength = new Date(previousY, previousM+1, 0).getDate()

        if (e.target.id==='previous') {
            setSecondMonth({m: firstMonth.m, y: firstMonth.y, length: firstMonth.length})
            setFirstMonth({m: previousM, y: previousY, length: previousLength })
        }

        if (e.target.id==='next') {
            setFirstMonth({m: secondMonth.m, y: secondMonth.y, length: secondMonth.length})
            setSecondMonth({m: nextM, y: nextY, length: nextLength})
        }
    }

    const [context, setContext] = useState(
        {   day:{id: 0,
            date: 'string',
            dayOfWeek: 0,
            availble: true,
            periodsForMeeting:
                [{start: 'string',
                end: 'string',
                availble: true}]
                },
            position: [0,0], 
            visible: false
        }
    )
    
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 968px)' })

    return {
        firstMonth,
        secondMonth,
        handleClick,
        context,
        setContext,
        isTabletOrMobile,
    }
}

const Calendar = () => {
    const {firstMonth,
           secondMonth, 
           handleClick, 
           context, 
           setContext,
           isTabletOrMobile, } = useCalendarLogic()
    
    return(
        isTabletOrMobile?
        <div className="calendar-sm">
        <Aside/>
        <DayContext.Provider value={{context: context, setContext: setContext}}>
            <Day />      
            <div>
            <h3><span onClick={handleClick} id='previous' className='previous'>Previous</span>
                    {Months[firstMonth.m]}  {firstMonth.y}
                <span onClick={handleClick} className='next' id='next'>Next</span>
            </h3>
                <Month month={firstMonth} />
            </div>
        </DayContext.Provider>
        </div>
        :
        <div className="calendar">
        <Aside/>
        <DayContext.Provider value={{context: context, setContext: setContext}}>
            <Day />
            <div>
                <h3><span onClick={handleClick} id='previous' className='previous'>Previous</span> {Months[firstMonth.m]} {firstMonth.y}</h3>
                <Month month={firstMonth}/>
            </div>
            <div>
                <h3>{Months[secondMonth.m]} {secondMonth.y} <span onClick={handleClick} className='next' id='next'>Next</span></h3>
                <Month month={secondMonth}/>
            </div>
        </DayContext.Provider>
        </div>
    )
}

export default Calendar