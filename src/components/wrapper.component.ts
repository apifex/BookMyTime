import { createElement } from '../utils/html/createHtmlElement'

export function wrapperComponent() {
    const wrapper = createElement('div', ['container'], 'calendarWidget')
    const row = createElement('div', ['row'])
    const col = createElement('div', ['col-md-12'])
    const calendar = createElement('div', ['elegant-calendar', 'd-md-flex'])

    col.appendChild(calendar)
    row.appendChild(col)
    wrapper.appendChild(row)

    return wrapper
}
