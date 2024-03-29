import { createElement } from '../utils'

export function calendarBodyComponent() {
    const calendarBody = createElement('div', ['calendar-wrap'], 'calendarBody')
    const btnWrap = createElement('div', ['w-100', 'button-wrap'])
    
    const bodyYear = createElement('div', ['head-body-year'], 'headBodyYear')
    btnWrap.appendChild(bodyYear)
    
    const preBtn = createElement('div', ['pre-button', 'd-flex', 'align-items-center', 'justify-content-center'], 'prev')
    const preBtnI = createElement('i', ['bi-chevron-left'])
    preBtn.appendChild(preBtnI)
    btnWrap.appendChild(preBtn)

    const bodyMonth = createElement('div', ['head-body-month'], 'headBodyMonth')
    btnWrap.appendChild(bodyMonth)

    const nextBtn = createElement('div', ['next-button', 'd-flex', 'align-items-center', 'justify-content-center'], 'next')
    const nextBtnI = createElement('i', ['bi-chevron-right'])
    nextBtn.appendChild(nextBtnI)
    btnWrap.appendChild(nextBtn)

    calendarBody.appendChild(btnWrap)

    return calendarBody
}
