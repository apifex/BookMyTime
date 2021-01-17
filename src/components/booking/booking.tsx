import React, { useRef, useState, useEffect, useCallback } from 'react';
import EmailValidator from 'email-validator';
import { useMediaQuery } from 'react-responsive'
import './booking.scss';

const useBookingLogic = (props: IBookingProps) => {
    const nameInputRef = useRef<HTMLInputElement>(null)
    const mailInputRef = useRef<HTMLInputElement>(null)
    const purposeInputRef = useRef<HTMLTextAreaElement>(null)
    
    const [inputError, setInputError] = useState({
                                                nameError: '',
                                                mailError: '',
                                                purposeError: '',
                                                })

    const [inputValue, setInputValue] = useState({
                                                nameValue: '',
                                                mailValue: '',
                                                purposeValue: '',
                                                })                                                
    
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 968px)' })

    useEffect(()=>{
        if (purposeInputRef && purposeInputRef.current) {
            purposeInputRef.current.focus()}
    }, [inputError.purposeError])

    useEffect(()=>{
        if (mailInputRef && mailInputRef.current) {
            mailInputRef.current.focus()}
    }, [inputError.mailError])

    useEffect(()=>{
        if (nameInputRef && nameInputRef.current) {
            nameInputRef.current.focus()}
    }, [inputError.nameError])
    
    const handleCancel = useCallback(()=> 
    {props.closeBooking()
    }, [props])

    const escFunction = useCallback((event) => {
        event.stopPropagation()
        if(event.keyCode === 27) {
            handleCancel()
        }
      }, [handleCancel])

    useEffect(() => {
        document.addEventListener("keydown", escFunction, true);
        return () => {
          document.removeEventListener("keydown", escFunction, true);
        };
      }, [escFunction]);
    
    
    const handleInput = (e:any) => {
        switch (e.target.id) {
            case 'nameInput':
                setInputValue({...inputValue, nameValue: e.target.value});
                setInputError({...inputError, nameError: ''})
                break;
            case 'mailInput':
                setInputValue({...inputValue, mailValue: e.target.value});
                setInputError({...inputError, mailError: ''})
                break;
            case 'purposeInput':
                setInputValue({...inputValue, purposeValue: e.target.value});
                setInputError({...inputError, purposeError: ''})
                break;
        }
    }

    const handleConfirm = async () => {
        if (inputValue.nameValue.length<3) {
            return setInputError({...inputError, nameError: 'please enter your name'})
        }
        
        if (!EmailValidator.validate(inputValue.mailValue)) {
            return setInputError({...inputError, mailError: 'please enter correct e-mail address'});
        }
        
        if (inputValue.purposeValue.length<5) {
            return setInputError({...inputError, purposeError: 'please write a subject of meeting'})
        }
        
        let start = props.targetHour.substring(0,10)+"T"+props.targetHour.substring(10,15)+":00"
        let end = start.substring(0,14) + '55' + start.substring(16)
                
        await serverActions({inputValue: inputValue, start: start, end: end, targetHour: props.targetHour})
        window.location.reload()
    }

    return {
        nameInputRef,
        mailInputRef,
        purposeInputRef,
        inputError,
        inputValue,
        handleInput,
        handleConfirm,
        handleCancel,
        isTabletOrMobile
    }
}

const serverActions = async ({inputValue, start, end, targetHour}:IServerActionsProps) => {
    const eventToAdd = {
        'summary': `Meeting with ${inputValue.nameValue}`,
        'description': inputValue.purposeValue,
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

    const addEvent = await fetch ('api/createevent', {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify(eventToAdd)
        })  
    const responseAddEvent = await addEvent.text()
    
    if (responseAddEvent === "OK") {
        const mailOptions = {
            from: `Mr Bean Office<apifex@gmail.com>`,
            to: inputValue.mailValue,
            subject: `Meeting confirmation`,
            message: `Hello, Your meeting with Mr. Bean is fixed to ${targetHour.substring(0,10)} at ${targetHour.substring(10,15)}`
            };   
        const sendMail = await fetch ('api/sendmail', {
            method: 'POST',
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify(mailOptions)
            })
        const responseMail = await sendMail.text()

        const mailForAdminOptions = {
            from: `Mr Bean Office<apifex@gmail.com>`,
            to: 'apifex@gmail.com',
            subject: `Meeting with ${inputValue.nameValue}`,
            message: `Hello, Mr. Bean, ${inputValue.nameValue} wish to meet with you. The meeting has been fixed to ${targetHour.substring(0,10)} at ${targetHour.substring(10,15)}. The purpose of the meeting: ${inputValue.purposeValue}. We've saved those informations in your calendar.`
            };
    
        fetch ('api/sendmail', {
            method: 'POST',
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify(mailForAdminOptions)
            })
        
        if (responseMail === 'OK') alert ('Your meeting has been fixed, you will recive a confirmation mail.')
    } else alert("We are so sorry, but somethink went wrong... Try again!")
}

const Booking = (props: IBookingProps) => {
    
    const {nameInputRef,
        mailInputRef,
        purposeInputRef,
        inputError,
        inputValue,
        handleInput,
        handleConfirm,
        handleCancel,
        isTabletOrMobile
    } = useBookingLogic(props)
   

    return(
        <div className={props.waitingOnClickOutside?'modal':''}>
            <div className={isTabletOrMobile?'booking-wraper-sm':'booking-wraper'}>
                You are going to book you visit on<br></br>
                <b>{props.targetHour.substring(0,10)} at {props.targetHour.substring(10,15)}</b> <br></br>
                Before you confirm, fill the form below:
                <div className="input-group">
                    <input ref={nameInputRef} value={inputValue.nameValue} type="input" onChange={handleInput} className="input" placeholder="Name" name="name" id='nameInput' required />
                    {(inputError.nameError!=='')?<span className="input-helper">{inputError.nameError}</span>:null}
                    <label htmlFor="name" className="label">Your Name</label>
                </div>
                <div className="input-group">
                    <input ref={mailInputRef} value={inputValue.mailValue} type="input" onChange={handleInput} className="input" placeholder="Email address" name="mail" id='mailInput' required />
                    <label htmlFor="name" className="label">Your e-mail</label>
                    {(inputError.mailError !== '')?<span className="input-helper">{inputError.mailError}</span>:null}
                </div>
                The purpose of your visit:
                <textarea className='booking-textArea' ref={purposeInputRef} value={inputValue.purposeValue} onChange={handleInput} id='purposeInput'/>
                    {(inputError.purposeError!=='')?<div className="input-helper">{inputError.purposeError}</div>:null}
                <button className='booking-button' onClick={handleConfirm}>Confirm</button>
                <button className='booking-button cancel' onClick={handleCancel}>Cancel</button>
            </div>
        </div>
    )
}

export default Booking;