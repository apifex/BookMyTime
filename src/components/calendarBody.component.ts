import { createElement } from '../utils/html/createHtmlElement'
import { createDaysTable } from '../utils/html/createDaysTable'
import { IMonthObject } from '../types'

export function calendarBodyComponent(monthObject: IMonthObject[]) {
    const calendarBody = createElement('div', ['calendar-wrap'])
    const btnWrap = createElement('div', ['w-100', 'button-wrap'])

    const preBtn = createElement('div', ['pre-button', 'd-flex', 'align-items-center', 'justify-content-center'], 'pre-button')
    const preBtnI = createElement('i', ['bi-chevron-left'])
    preBtn.appendChild(preBtnI)
    btnWrap.appendChild(preBtn)

    const nextBtn = createElement('div', ['next-button', 'd-flex', 'align-items-center', 'justify-content-center'], 'next-button')
    const nextBtnI = createElement('i', ['bi-chevron-right'])
    nextBtn.appendChild(nextBtnI)
    btnWrap.appendChild(nextBtn)

    calendarBody.appendChild(btnWrap)
    calendarBody.appendChild(createDaysTable(monthObject))

    return calendarBody
}
