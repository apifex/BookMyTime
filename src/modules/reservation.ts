import { Dayjs } from "dayjs";
import { sendEmail, addEventToCalendar } from "../api/api";
import { reservationComponent } from "../components/reservation.component";
import joi from 'joi'

export interface IReservation {
    date: Dayjs
    hour: string
    day: string
    startTime: string
    endTime: string
    state: {
        [key: string]: string,
        name: string,
        email: string,
        subject: string,
        location: string
    }
    elements: IElements
}

interface IElements {
    reservationModal: HTMLElement,
    confirmBtn: HTMLElement,
    cancelBtn: HTMLElement,
    inputName: HTMLInputElement,
    inputEmail: HTMLInputElement,
    inputSubject: HTMLInputElement,
    alert: HTMLElement,
}

export class Reservation implements IReservation {
    date: Dayjs
    hour: string
    day: string
    startTime: string
    endTime: string
    state: {
        [key: string]: string,
        name: string,
        email: string,
        subject: string,
        location: string
    }
    elements: {
        reservationModal: HTMLElement,
        confirmBtn: HTMLElement,
        cancelBtn: HTMLElement,
        inputName: HTMLInputElement,
        inputEmail: HTMLInputElement,
        inputSubject: HTMLInputElement,
        alert: HTMLElement,
    }


    constructor(day: Dayjs) {
        this.date = day
        this.hour = day.format('HH:mm')
        this.day = day.format(`dddd, MMMM DD`)
        this.startTime = day.format()
        //TODO : add 'time of meetig ... 30min... 45min'
        this.endTime = day.set('minute', 55).format()
        //TODO : add 'chose locatiom'
        this.state = { name: '', email: '', subject: '', location: 'online' }
        document.body.append(reservationComponent(this.day, this.hour))
        this.elements = this.getHTMLElements()
        this.addEventListeners()
    }

    getHTMLElements () {
        const reservationModal = document.getElementById('reservationModal')
        const confirmBtn = document.getElementById('confirmBtn')
        const cancelBtn = document.getElementById('cancelBtn')
        const inputName = document.getElementById('inputName') as HTMLInputElement
        const inputEmail = document.getElementById('inputEmail') as HTMLInputElement
        const inputSubject = document.getElementById('inputSubject') as HTMLInputElement
        const alert = document.getElementById('alert')
        if (!reservationModal || !confirmBtn || !cancelBtn || !inputName || !inputEmail || !inputSubject || !alert) {
            throw Error('Sorry, something went wrong. Try to refresh the page.')
        }
        return {
            reservationModal,
            confirmBtn,
            cancelBtn,
            inputName,
            inputEmail,
            inputSubject,
            alert
        }
    }

    addEventListeners() {
        this.elements.confirmBtn.addEventListener('click', this.confirmHandler)
        this.elements.cancelBtn.addEventListener('click', this.closeReservationHandler)
        this.elements.inputName.oninput = this.inputHandler
        this.elements.inputEmail.oninput = this.inputHandler
        this.elements.inputSubject.oninput = this.inputHandler
        this.elements.inputName.value = this.state.name
        this.elements.inputEmail.value = this.state.email
        this.elements.inputSubject.value = this.state.subject
    }

    removeEventListeners() {
        if (this.elements.confirmBtn) this.elements.confirmBtn.removeEventListener('click', this.confirmHandler)
        if (this.elements.cancelBtn) this.elements.cancelBtn.removeEventListener('click', this.closeReservationHandler)
    }

    inputHandler = (ev: Event) => {
        this.alert('clear')
        const target = ev.currentTarget as HTMLInputElement
        this.state[target.name] = target.value
    }

    confirmHandler = async (ev: Event) => {
        ev.preventDefault()
        const formValidationSchema = joi.object({
            name: joi.string().alphanum().min(3).max(30).required(),
            email: joi.string().email({ minDomainSegments: 2, tlds: false }).required(),
            subject: joi.string().required()
        })
        try {
            const formValidation = formValidationSchema.validate({ name: this.state.name, email: this.state.email, subject: this.state.subject })
            if (formValidation.error) throw Error(formValidation.error.message)
            const addEventResponse = await addEventToCalendar(this.startTime,
                this.endTime,
                `Meeting with ${this.state.name}`,
                this.state.subject,
                [{ email: this.state.email }])
            if (addEventResponse && addEventResponse.status === 'confirmed') {
                const sendEmailResponse = await sendEmail(this.state.email, {
                    guestName: this.state.name,
                    start: this.startTime,
                    end: this.endTime,
                    summary: this.state.subject,
                    location: this.state.location
                })
                if (sendEmailResponse === 'OK') {
                    this.alert('success')
                } else { this.alert('error') }
            } else { this.alert('error') }
        } catch (error) {
            if (error instanceof Error) {
                this.alert(error.message)
                console.log('Error', error.message)
            }
        }
    }

    closeReservationHandler = (ev: Event) => {
        ev.preventDefault()
        const target = ev.currentTarget as Element
        if (target.id == 'reservationContainer' || target.id == 'cancelBtn') this.elements.reservationModal.remove()
        this.removeEventListeners()
    }

    alert = (type: string) => {
        switch (type) {
            case 'clear':
                this.elements.alert.innerText = ''
                this.elements.alert.classList.remove('alert-success', 'alert-danger')
                break
            case 'success':
                this.elements.alert.classList.add('alert-success')
                this.elements.alert.innerText = 'Your meeting have been confirmed! You will recive a confirmation email. Thank you!'
                break
            case 'error':
                this.elements.alert.classList.add('alert-danger')
                this.elements.alert.innerText = `Somethik went wrong. Try again, or contact our support. We are sorry.`
                break;
            default:
                this.elements.alert.classList.add('alert-danger')
                this.elements.alert.innerText = type
        }
    }
}
