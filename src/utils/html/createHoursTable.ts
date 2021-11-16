import { createElement } from './createHtmlElement'

export function createHoursTable(periods: { start: string, end: string, availble: boolean }[]) {
    const hoursTable = createElement('div', ['hours-wrap'], 'hoursTable')
    periods.forEach(el => {
        let period = createElement('p', ['hours'], el.start, `${el.start}`)
        if (!el.availble) {
            period.classList.add('busy-period')
        }
        hoursTable.appendChild(period)
    })
    return hoursTable
}