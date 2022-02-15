import { Dayjs } from "dayjs";
import { sendEmail, addEventToCalendar } from "../api/api";
import { reservationComponent } from "../components";
import { IReservation } from "../types";
import joi from 'joi'
import { loaderComponent } from "../components/loader.component";

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
    loaderState: boolean
    elements: {
        reservationModal: HTMLElement,
        reservationForm: HTMLElement,
        confirmBtn: HTMLElement,
        cancelBtn: HTMLElement,
        inputName: HTMLInputElement,
        inputEmail: HTMLInputElement,
        inputSubject: HTMLInputElement,
        alert: HTMLElement,
        loader: HTMLElement | null
    }
    
    constructor(day: Dayjs) {
        this.date = day
        this.hour = day.format('HH:mm')
        this.day = day.format(`dddd, MMMM DD`)
        this.startTime = day.format()
        //TODO : add 'time of meetig ... 30min... 45min'
        this.endTime = day.set('minute', 55).format()
        //TODO : add 'chose location'
        this.state = { name: '', email: '', subject: '', location: 'online' }
        document.body.append(reservationComponent(this.day, this.hour))
        this.elements = {...this.getHTMLElements(), loader: null}
        this.addEventListeners()
        this.loaderState = false
    }

    getHTMLElements() {
        const reservationModal = document.getElementById('reservationModal')
        const reservationForm = document.getElementById('reservationForm')
        const confirmBtn = document.getElementById('confirmBtn')
        const cancelBtn = document.getElementById('cancelBtn')
        const inputName = document.getElementById('inputName') as HTMLInputElement
        const inputEmail = document.getElementById('inputEmail') as HTMLInputElement
        const inputSubject = document.getElementById('inputSubject') as HTMLInputElement
        const alert = document.getElementById('alert')
        if (!reservationModal || !reservationForm || !confirmBtn || !cancelBtn || !inputName || !inputEmail || !inputSubject || !alert) {
            throw Error('Sorry, something went wrong. Try to refresh the page.')
        }
        return {
            reservationModal,
            reservationForm,
            confirmBtn,
            cancelBtn,
            inputName,
            inputEmail,
            inputSubject,
            alert
        }
    }

    addEventListeners() {
        this.elements.confirmBtn.addEventListener('click', this.clickHandler)
        this.elements.cancelBtn.addEventListener('click', this.clickHandler)
        this.elements.inputName.oninput = this.inputHandler
        this.elements.inputEmail.oninput = this.inputHandler
        this.elements.inputSubject.oninput = this.inputHandler
        this.elements.inputName.value = this.state.name
        this.elements.inputEmail.value = this.state.email
        this.elements.inputSubject.value = this.state.subject
        document.addEventListener('keydown', this.keyboardHandler)
    }

    removeEventListeners() {
        if (this.elements.confirmBtn) this.elements.confirmBtn.removeEventListener('click', this.clickHandler)
        if (this.elements.cancelBtn) this.elements.cancelBtn.removeEventListener('click', this.clickHandler)
        document.removeEventListener('keydown', this.keyboardHandler)
    }

    inputHandler = (ev: Event) => {
        this.alert('clear')
        const target = ev.currentTarget as HTMLInputElement
        this.state[target.name] = target.value
    }

    clickHandler = (ev: MouseEvent) => {
        if (this.loaderState) return
        ev.preventDefault()
        const target = ev.currentTarget as Element
        if (target.id == 'confirmBtn') this.confirm()
        if (target.id == 'cancelBtn') this.close()
    }
    
    keyboardHandler = (ev: KeyboardEvent) => {
        if (this.loaderState) return
        if (ev.code == 'Escape') this.close()
        if (ev.code == 'Enter') {
            ev.preventDefault()
            this.confirm()
        }
    }

    loader = (state: boolean) => {
        const loader = loaderComponent()
        if (state) {
            this.elements.loader = loader
            this.elements.reservationModal.appendChild(loader)
            this.loaderState = true
        } else {
            this.loaderState = false
            if (this.elements.loader) this.elements.loader.remove()
        }
    }

    confirm = async () => {
        this.loader(true)
        const formValidationSchema = joi.object({
            name: joi.string().min(3).max(40).required(),
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
                    this.loader(false)
                    this.alert('success')
                    this.elements.confirmBtn.remove()
                    this.elements.cancelBtn.innerText = 'Exit'
                } else {
                    this.loader(false)
                    this.alert('error')
                }
            } else {
                this.loader(false)
                this.alert('error')
            }
        } catch (error) {
            if (error instanceof Error) {
                this.loader(false)
                this.alert(error.message)
                console.log('Error', error.message)
            }
        }
    }

    close = () => {
        this.elements.reservationModal.remove()
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
