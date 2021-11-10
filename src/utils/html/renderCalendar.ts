import { wrapperComponent } from '../../components/wrapper.component'
import { headerComponent } from '../../components/header.component'
import { calendarBodyComponent } from '../../components/calendarBody.component'
import { IMonthObject } from '../../types'

export const renderCalendar = (monthObject: IMonthObject[], currentMonth: string, currentDay: string) => {
    document.getElementById('calendarWidget')?.remove()
    const wrapper = wrapperComponent()
    wrapper.getElementsByClassName('elegant-calendar')[0]
        .appendChild(headerComponent(currentMonth, currentDay, monthObject[Number(currentDay) - 1].periodsForMeeting))
    wrapper.getElementsByClassName('elegant-calendar')[0]
        .appendChild(calendarBodyComponent(monthObject))
    document.body.appendChild(wrapper)
}