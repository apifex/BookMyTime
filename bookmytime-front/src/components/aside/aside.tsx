import React from 'react';
import {useMediaQuery} from 'react-responsive'
import mrbean from '../../assets/mr-bean.png';

import './aside.scss'

const Aside = () => {
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 968px)' })    
    return(
        isTabletOrMobile?
        <div className="grid-aside">
            <img src={mrbean} alt="mrbean" className='mrbean-sm'/>
            <h3 className="welcome-sm">Welcome in Mr.Been's office</h3>
            <p>Do you want to meet with me?</p>
            <p>Just click on the calendar!</p>
        </div>
        :
        <div className="grid-aside">
            <h3 className="welcome">Welcome in Mr.Been's office</h3>
            <p>Do you want to meet with me?</p>
            <p>Just click on the calendar!</p>
            <img src={mrbean} alt="mrbean" className='mrbean'/>
        </div>
    )
}

export default Aside;