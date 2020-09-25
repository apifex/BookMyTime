import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import CustomInput from '../customInput.component'

const Booking = (props:any) => {
    let top = props.bookingPosition[1];
    let left = props.bookingPosition[0];
    if (props.bookingPosition[1]>300) top = props.bookingPosition[1]-300
    const Booking = styled.div`
    position: absolute;
    top: ${top}px;
    left: ${left}px;
    background-color: #A8DADC;
    width: 400px;
    height: 300px;
    padding: 10px;
    border-radius: 5px;
    border-width: 1px;
    border-style: solid; 
    border-color: #457B9D;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    `
    const Button = styled.button`
        border-radius: 10px;
		border: 0;
		
		color: #F1FAEE;
		cursor: pointer;
		display: inline-block;
		
		background-color: #E42535;
		letter-spacing: 0.1em;
		height: 2.85em;
		line-height: 2.95em;
		padding: 0 2em;
		text-align: center;
		text-decoration: none;
		white-space: nowrap;
		margin: 5px;
		&:hover {
			filter: brightness(110%);
			text-decoration: none;
			outline: none
		}
		&:active {
			filter: brightness(80%);
			text-decoration: none;
		}
		&:focus {
			outline: none
		}
`

const TextArea = styled.textarea`
    background-color: #F1FAEE;
    width: 80%;
    height: 5rem;
    resize: none;
    padding: 5px;
    margin: 10px;
    border-radius: 5px;
    border-width: 1px;
    border-style: solid; 
    border-color: #457B9D;
    
`
    return(
        props.visibility?
        <Booking> 
            <CustomInput label='Your Name' required=' ' inputSize='90%'/>
            <CustomInput label='Your e-mail' type='mail' required=' ' inputSize='90%'/>
            The purpous of your visit:
            <TextArea/>
            <Button>Confirm</Button>
        </Booking>:
        null
    )
}

export default Booking 