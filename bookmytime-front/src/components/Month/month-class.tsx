import React from 'react'

import './month.styles.scss'
import oneDayPlanning from '../../utils/onedayplanning';

interface IProps{
    today: Date
}

interface IState{
    classForDay: Array<string>;
    daysInMonth: Array<Date>;
}



class Month extends React.Component<IProps, IState> {
    constructor(props:IProps){
        super(props)
        this.state = {
            classForDay: ['0'],
            daysInMonth: []
        }
        
    }

    componentDidMount() {
        function calculateDaysInMonth (date: Date):Array<Date> {
            const daysInMonth: Array<Date> = [];
               
            const lastDayinMonth: number = new Date(date.getFullYear(), date.getMonth()+1,0).getDate()
            for (let i=0; i<lastDayinMonth; i++) {
                let y: number = date.getFullYear()
                let m: number = date.getMonth();
                let d: number = 1+i
                daysInMonth.push(new Date(y,m,d))
            }
            return daysInMonth
        }
        const x = calculateDaysInMonth(this.props.today)
        this.setState({daysInMonth: x })
    
        let availbleDays: Array<string> = []
        const checkForAvailble = async () => {
        for(const day of x) {
            let dayForDate: string
            if (day.getDate()>9) {dayForDate = day.getDate().toString()} else {dayForDate = `0${day.getDate()}`}
            let monthForDate
            if (day.getMonth()>8) {monthForDate = day.getMonth()+1} else {monthForDate = `0${day.getMonth()+1}`}
            let dateISO = `${day.getFullYear()}-${monthForDate}-${dayForDate}`
            
            let result = await oneDayPlanning(dateISO)
            let x = result.day.find((day)=> day.availble===true)
            
            if (x) {
                availbleDays.push(dayForDate)      
            }
         }
         this.setState({classForDay: availbleDays})
        }
        checkForAvailble()
         
        }
    
    render() {
    
    console.log('render')
    const days: Array<string> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const daysNames: Array<string> = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    
    const classForfirstDayinMonth: string = 'day ' + daysNames[new Date(this.props.today.getFullYear(), this.props.today.getMonth(), 1).getDay()]
        
    const daysToDisplay = [];

    
    let firstDay = this.state.daysInMonth.shift()
    daysToDisplay.push(<div key={'firstDay'} 
                            id={firstDay?.toString()} 
                            className={this.state.classForDay.find(
                                el=> el==='01')
                                ?classForfirstDayinMonth:classForfirstDayinMonth +' busy'}>
                                {firstDay?.getDate()}
                        </div>)
    this.state.daysInMonth.map((day)=>{
        let dayClass: string
        if (day.getDate()>9) {dayClass = day.getDate().toString()} else {dayClass = `0${day.getDate()}`}
        daysToDisplay.push(<div key={day.toString()} 
                                                    id={day.toString()} 
                                                    className={
                                                        this.state.classForDay.find(
                                                            el=> el===dayClass)
                                                            ?'day':'day busy'}>
                                                    {day.getDate()}
                                                </div>)
                                                return null})
    this.state.daysInMonth.unshift(firstDay?firstDay:new Date())
    
    return(
        <div className="calendarMonth">
            {days.map((day)=><div key={day} className='legend'>{day}</div>)}
            {daysToDisplay.map(day=>day)}
        </div>
    )
    }
}


export default Month