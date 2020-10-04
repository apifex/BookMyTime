
import React, { useRef, useState, useEffect } from 'react';
import EmailValidator from 'email-validator';
import './booking.scss';


const Booking = (props:any) => {
    
    const nameInputRef = useRef<HTMLInputElement>(null)
    const mailInputRef = useRef<HTMLInputElement>(null)
    const reasonInputRef = useRef<HTMLTextAreaElement>(null)
    
    const [nameError, setNameError] = useState('')
    const [mailError, setMailError] = useState('');
    const [reasonError, setReasonError] = useState('')

    const [nameInputValue, setNameInputValue] = useState('')
    const [mailInputValue, setMailInputValue] = useState('')
    const [reasonValue, setReasonValue] = useState('')



    const handleConfirm = async () => {
        if (nameInputValue.length<3) {
            setNameError('please enter your name')
            return
        }
        
        if (!EmailValidator.validate(mailInputValue)) {
            setMailError('please enter your correct e-mail address');
            return
        }
        
        if (reasonValue.length<5) {
            setReasonError('please write a subject of meeting')
            return 
        }
        
        let start = props.chosenHour
        let end = start.substring(0,14) + '55' + start.substring(16)
    
        const eventToAdd = {
            'summary': `Meeting with ${nameInputValue}`,
            // 'location': 'Varsaw, Poland',
            'description': reasonValue,
            'start': {
                'dateTime': start,
                'timeZone': 'Europe/Paris',
            },
            'end': {
                'dateTime': end,
                'timeZone': 'Europe/Paris',
            },
            'reminders': {
                'useDefault': false,
            },
            };

        const addEvent = await fetch ('http://localhost:4000/createevent', {
            method: 'POST',
            headers: {
                  'Content-Type': 'application/json;charset=utf-8'
                },
            body: JSON.stringify(eventToAdd)
              })
              
            let result = await addEvent.text()
            console.log(result)

        const mailOptions = {
            from: "Mr Bean Office<apifex@gmail.com>",
            to: mailInputValue,
            subject: `Meeting with ${nameInputValue} is fixed to ${new Date(start).toLocaleDateString()} at ${new Date(start).toLocaleTimeString()}`,
            generateTextFromHTML: true,
            html: `<b>${reasonValue}</b>`
            };

        const mailer = await fetch ('http://localhost:4000/sendmail', {
            method: 'POST',
            headers: {
                  'Content-Type': 'application/json;charset=utf-8'
                },
            body: JSON.stringify(mailOptions)
              })
              
            let responseMailer = await mailer.text()
            console.log(responseMailer)
    }

    useEffect(()=>{
        if (reasonInputRef && reasonInputRef.current) {
            reasonInputRef.current.focus()}
    }, [reasonError])

    useEffect(()=>{
        if (mailInputRef && mailInputRef.current) {
            mailInputRef.current.focus()}
    }, [mailError])

    useEffect(()=>{
        if (nameInputRef && nameInputRef.current) {
            nameInputRef.current.focus()}
    }, [nameError])
    
    
    const handleCancel = () => {
        props.closeBooking()
    }
    
    const handleNameInput = (e:any) => {
        setNameInputValue(e.target.value);
        setNameError('')
    }
    const handleMailInput = (e:any) => {
        setMailInputValue(e.target.value);
        setMailError('')
    }
    const handleReasonInput = (e:any) => {
        setReasonValue(e.target.value)
        setReasonError('')
    }
    
    return(
        <div className='modal'>
            <div className='booking-wraper'>
                You are going to book you visit on<br></br>
                <b>{new Date(props.chosenHour).toDateString()} at {new Date(props.chosenHour).toLocaleTimeString()}</b> <br></br>
                Before you confirm, fill the form below:
                <div className="input-group">
                    <input ref={nameInputRef} value={nameInputValue} type="input" onChange={handleNameInput} className="input" placeholder="Name" name="name" id='name' required />
                    {(nameError!=='')?<span className="input-helper">{nameError}</span>:null}
                    <label htmlFor="name" className="label">Your Name</label>
                </div>
                <div className="input-group">
                    <input ref={mailInputRef} value={mailInputValue} type="input" onChange={handleMailInput} className="input" placeholder="Name" name="name" id='name' required />
                    <label htmlFor="name" className="label">Your e-mail</label>
                    {(mailError !== '')?<span className="input-helper">{mailError}</span>:null}
                </div>
            
                The purpose of your visit:
                <textarea className='booking-textArea' ref={reasonInputRef} value={reasonValue} onChange={handleReasonInput}/>
                    {(reasonError!=='')?<div className="input-helper">{reasonError}</div>:null}
                <button className='booking-button' onClick={handleConfirm}>Confirm</button>
                <button className='booking-button cancel' onClick={handleCancel}>Cancel</button>
            </div>
        </div>
    )
}

export default Booking 