import React from 'react';
import styled from 'styled-components';


import oneDayPlanning from '../../utils/onedayplanning';
import './day.scss'

interface IProps {
    dayPosition: Array<number>
}
interface IState {
    date: Array<{
        start: string,
        end: string,
        availble: boolean
    }>
}

class Day extends React.Component<IProps, IState> {
constructor(props: IProps) {
    super(props)
    this.state = {date: [{
        "start": `2020-09-01T08:00:00+02:00`,
        "end": `2020-09-01T08:55:00+02:00`,
        availble: true,
        }]}   
}

    



async componentDidMount () {
    const data = await oneDayPlanning('2020-09-18')
    this.setState({date: data.day})
    
}




render() {
    const DDy = styled.div`
    position: absolute;
    margin-top: ${this.props.dayPosition[1]}px;
    margin-left: ${this.props.dayPosition[0]}px;
    background-color: rgba(0, 0, 0, 0.226);

    `
    
    return (
    <DDy>
    <div>
    {this.state.date.map(el => <div 
        key={el.start} 
        className={el.availble?'availble':'busy'}>
            {new Date(el.start).getHours()}:{new Date(el.start).getMinutes()} - {new Date(el.end).getHours()}:{new Date(el.end).getMinutes()}</div>)}    
    </div>
    </DDy>
    )}

}

export default Day