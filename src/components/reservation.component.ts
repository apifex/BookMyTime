import { Dayjs } from "dayjs";
import { sendEmail, addEventToCalendar } from "../utils/api";
import { createElement } from "../utils/html/createHtmlElement"


//TODO form validation 

export class reservationComponent {
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


    constructor(day: Dayjs) {
        this.date = day
        this.hour = day.format('HH:mm')
        this.day = day.format(`dddd, MMMM DD`)
        this.startTime = day.format()
        //TODO : add 'time of meetig ... 30min... 45min'
        this.endTime = day.set('minute', 55).format()
        //TODO : add 'chose locatiom'
        this.state = { name: '', email: '', subject: '', location: 'online' }
        this.render()
    }

    inputHandler = (ev: Event) => {
        const target = ev.currentTarget as HTMLInputElement
        this.state[target.id] = target.value
    }

    confirmHandler = async (ev: Event) => {
        ev.preventDefault()
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
            } else {this.alert('error')}
        } else {this.alert('error')}
    }

    alert = (type: string) => {
        const successMsg = 'Your meeting have been confirmed! You will recive a confirmation email. Thank you!'
        const errorMsg = `Somethik went wrong. Try again, or contact our support. We are sorry.`
        const alertWrap = createElement('div', ['alert', type === 'success'?'alert-success':'alert-danger'], 'alert', type === 'success'?successMsg:errorMsg)
        document.getElementById('alert-placeholder')?.replaceWith(alertWrap)
    }


    closeReservationHandler = (ev: Event) => {
        ev.preventDefault()
        const target = ev.currentTarget as Element
        if (target.id == 'reservationContainer' || target.id == 'cancelBtn') document.getElementById('reservationModal')?.remove()
    }

    render = () => {
        const reservationComponent = createElement('div', ['modal'], 'reservationModal')
        const container = createElement('div', ['container'], 'reservationContainer')
        const body = createElement('div', ['body'])
        const alertPlaceholder = createElement('div', undefined, 'alert-placeholder', undefined)
        const header = createElement('h5', ['modal-title'], undefined, `You are going to take a meeting on ${this.day} at ${this.hour} `)
        const form = createElement('form', undefined,)
        // TODO export to function createFormElement
        const formDiv1 = createElement('div', ['form-group'])
        const labelName = createElement('label', ['col-form-label'], undefined, 'Your name:')
        labelName.setAttribute('for', 'name')
        const inputName = createElement('input', ['form-control'], 'name') as HTMLInputElement
        inputName.inputMode = 'text'
        inputName.value = this.state.name
        inputName.oninput = this.inputHandler
        formDiv1.appendChild(labelName)
        formDiv1.appendChild(inputName)
        const formDiv2 = createElement('div', ['form-group'])
        const labelEmail = createElement('label', ['col-form-label'], undefined, 'Your email:')
        labelEmail.setAttribute('for', 'email')
        const inputEmail = createElement('input', ['form-control'], 'email') as HTMLInputElement
        inputEmail.inputMode = 'text'
        inputEmail.value = this.state.email
        inputEmail.oninput = this.inputHandler
        formDiv2.appendChild(labelEmail)
        formDiv2.appendChild(inputEmail)
        const formDiv3 = createElement('div', ['form-group'])
        const labelSubject = createElement('label', ['col-form-label'], undefined, 'Subject of meeting:')
        labelSubject.setAttribute('for', 'subject')
        const inputSubject = createElement('textarea', ['form-control'], 'subject') as HTMLInputElement
        inputSubject.value = this.state.subject
        inputSubject.oninput = this.inputHandler
        formDiv3.appendChild(labelSubject)
        formDiv3.appendChild(inputSubject)

        const confirmBtn = createElement('button', ['btn', 'btn-primary'], 'confirmBtn', 'Confirm')
        const cancelBtn = createElement('button', ['btn', 'btn-secondary'], 'cancelBtn', 'Cancel')
        form.appendChild(formDiv1)
        form.appendChild(formDiv2)
        form.appendChild(formDiv3)
        form.appendChild(confirmBtn).addEventListener('click', this.confirmHandler)
        form.appendChild(cancelBtn).addEventListener('click', this.closeReservationHandler)
        body.appendChild(alertPlaceholder)
        body.appendChild(header)
        body.appendChild(form)
        container.appendChild(body)
        reservationComponent.appendChild(container)
        document.body.appendChild(reservationComponent).addEventListener('click', this.closeReservationHandler)
    }

}

