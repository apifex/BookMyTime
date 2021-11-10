import { createElement } from '../utils/html/createHtmlElement'

export function hoursComponent(periods: { start: string, end: string, availble: boolean }[]) {
    const hoursComponent = createElement('div', ['hours-wrap'], 'hours-wrap')
    periods.forEach(el => {
        let period = createElement('p', ['hour'], el.start, `${el.start}`)
        if (!el.availble) {
            period.classList.add('busy-period')
        }
        hoursComponent.appendChild(period)
    })
    return hoursComponent
}