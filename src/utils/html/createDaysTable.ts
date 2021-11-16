import { createElement } from "./createHtmlElement"
import { IMonthObject } from "../../types"
import dayjs from "dayjs"
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
dayjs.extend(isSameOrBefore)

export function createDaysTable(monthObject: IMonthObject[]): HTMLElement {
    const table = createElement('table', undefined, 'calendarTable')
    const thead = createElement('thead')
    const tDaysRow = createElement('tr')
    const days = ['Sun', 'Mon', 'Thu', 'Wed', 'Thr', 'Fri', 'Sat']
    days.forEach((el) => {
        tDaysRow.appendChild(createElement('th', undefined, undefined, el))
    })
    thead.appendChild(tDaysRow)
    table.appendChild(thead)

    const tbody = createElement('tbody')

    let acc = 0
    let tr = createElement('tr')
    monthObject.forEach((day, index) => {
        let isToday = dayjs().isSame(day.date, 'day')
        let isBefore = dayjs().isSameOrBefore(day.date, 'day')
        if (index == 0) {
            let position = 0
            while (position < day.dayOfWeek) {
                tr.appendChild(createElement('td', ['disabled']))
                acc++
                position++
            }
        }

        if (acc == 7) {
            tbody.appendChild(tr)
            tr = createElement('tr')
            acc = 0
        }
        tr.appendChild(createElement('td', [
            'days',
            day.availble ? 'free' : 'busy',
            isToday ? 'today' : 'null',
            isBefore ? 'null' : 'disabled'], day.id.toString(), day.id.toString()))
        acc++
        if (index == monthObject.length - 1) tbody.appendChild(tr)
    })

    table.appendChild(tbody)

    return table
}