import React from 'react';
import oneDayPlanning from '../../utils/onedayplanning';
import './day.scss'

class Day extends React.Component {
state = {data: [{
    "start": `2020-09-01T08:00:00+02:00`,
    "end": `2020-09-01T08:55:00+02:00`,
    availble: true,
}]}


async componentDidMount () {
    const data = await oneDayPlanning('2020-09-18')
    this.setState({data: data.day})
    
}



render() {
    
    return (
    <div className='dayx'>
    {this.state.data.map(el => <div key={el.start} className={el.availble?'availble':'busy'}>{new Date(el.start).getHours()}:{new Date(el.start).getMinutes()} - {new Date(el.end).getHours()}:{new Date(el.end).getMinutes()}</div>)}    
    </div>
    )}

}

export default Day