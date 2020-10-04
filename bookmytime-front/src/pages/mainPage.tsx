import React from 'react';
import Calendar from '../components/calendar/calendar'


interface IProps {

}

interface IState {
  today: Date,
  
}

class MainPage extends React.Component<IProps, IState> {
    constructor(props:any) {
    super(props);

    this.state = {
        today: new Date(),
        
    }
}



render() {
    
    return(
        <div>
            <h1>Book My Time</h1>
            
            <Calendar today = {this.state.today}/>
           
        </div>  
    )
    }
}

export default MainPage