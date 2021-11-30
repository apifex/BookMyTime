import { createElement, createFormElement } from "../utils"

export const reservationComponent = (day: string, hour: string) => {
    const reservationComponent = createElement('div', ['modal'], 'reservationModal')
    const container = createElement('div', ['container'], 'reservationContainer')
    const body = createElement('div', ['body'], 'reservationBox')
    const alertPlaceholder = createElement('div', undefined, 'alertPlaceholder', undefined)
    const alertWrap = createElement('div', ['alert'], 'alert')
    const header = createElement('h5', ['modal-title'], undefined, `You are going to take a meeting on ${day} at ${hour} `)
    const form = createElement('form', undefined, 'reservationForm')
    const inputName = createFormElement('Your name:', 'inputName', 'name')
    const inputEmail = createFormElement('Your email:', 'inputEmail', 'email')
    const inputSubject = createFormElement('Subject of meeting:', 'inputSubject', 'subject')
    const confirmBtn = createElement('button', ['btn', 'btn-primary'], 'confirmBtn', 'Confirm')
    const cancelBtn = createElement('button', ['btn', 'btn-secondary'], 'cancelBtn', 'Cancel')
    alertPlaceholder.appendChild(alertWrap)
    form.append(inputName, inputEmail, inputSubject, confirmBtn, cancelBtn)
    body.append(alertPlaceholder, header, form)
    container.appendChild(body)
    reservationComponent.appendChild(container)
    return reservationComponent
}