import './scss/custom.scss'

import { CalendarWidget } from './modules/calendar'
import { createElement } from './utils'


//TODO 'env' with time zone and mail in config... 

//div for test
document.body.append(createElement('div', undefined, 'calendar-widget'))
// end 

const calendarButton = createElement('div', ['open-calendar-button'], 'openCalendarButton')
const widgetDiv = document.getElementById('calendar-widget')
if (widgetDiv) {
    widgetDiv.replaceWith(calendarButton)
} else {
    throw Error(`'calendar-widget' div not found.`)
}

let calendarInstance: CalendarWidget | null = null
const openCalendar = () => {
    if (!calendarInstance) {
        calendarInstance = new CalendarWidget()
    } else {
        calendarInstance.closeCalendar()
        calendarInstance = null
    }
}

calendarButton.addEventListener('click', openCalendar)






