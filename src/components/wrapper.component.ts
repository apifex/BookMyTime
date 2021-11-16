import { createElement } from '../utils/html/createHtmlElement'

export function wrapperComponent() {
    const wrapper = createElement('div', ['container'], 'calendarWidget')
    const calendar = createElement('div', ['calendar', 'd-md-flex'], 'calendar')
    wrapper.appendChild(calendar)
    return wrapper
}
