import { createElement } from '../utils'

export function wrapperComponent() {
    const wrapper = createElement('div', ['container'], 'calendarWidget')
    const calendar = createElement('div', ['calendar', 'd-md-flex'], 'calendar')
    wrapper.appendChild(calendar)
    return wrapper
}
