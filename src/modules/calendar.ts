import dayjs, { Dayjs } from 'dayjs'
import updateLocal from 'dayjs/plugin/updateLocale'
import objectSupport from 'dayjs/plugin/objectSupport'

import { getCalendar } from '../api/api'
import { Reservation } from './reservation'

import { wrapperComponent, calendarBodyComponent, headerComponent  } from '../components'
import { createHoursTable, createDaysTable } from '../utils'

import { IMonthObject, ICalendarWidget} from '../types'

dayjs.extend(updateLocal)
dayjs.extend(objectSupport)

dayjs.updateLocale('en', {
    months: [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ],
    weekdays: [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ]
})

// w folderze config dodać localsy


export class CalendarWidget implements ICalendarWidget {
    state: {
        today: Dayjs,
        currentMonth: Dayjs,
        currentDate: Dayjs,
        monthObject: IMonthObject[] | null
    }

    elements: {
        [key: string]: HTMLElement | HTMLCollectionOf<Element> | null,
        calendarBody: HTMLElement,
        header: HTMLElement,
        headMonth: HTMLElement,
        headDay: HTMLElement,
        reset: HTMLElement,
        prev: HTMLElement,
        next: HTMLElement,
        days: HTMLCollectionOf<Element> | null,
        hours: HTMLCollectionOf<Element> | null
    } 
    // wstawic loader zamiast null
    constructor() {
        this.state = {
            today: dayjs(),
            currentMonth: dayjs(),
            currentDate: dayjs(),
            monthObject: null
        }
        this.renderCalendar()
        this.elements = {
            ...this.getHTMLElements(),
            days: null,
            hours: null,
        }
        this.startCalendar(this.state.currentMonth)
    }

    async startCalendar(date: Dayjs) {
        try {
            const monthObject = await getCalendar(date.get('year').toString(), date.get('month').toString())
            if (!monthObject) {
                throw Error('No connection with server. Try to refresh the page.')
            }
            this.state.monthObject = monthObject
            const calendarTable = document.getElementById('calendarTable')
            if (calendarTable) calendarTable.remove()
            this.elements.calendarBody.appendChild(createDaysTable(this.state.monthObject))
            this.elements.headMonth.innerText = this.state.currentMonth.format('MMMM YYYY')
            this.elements.headDay.innerText = this.state.currentDate.format('DD')
            const hoursTable = document.getElementById('hoursTable')
            if (hoursTable) hoursTable.remove()
            this.elements.header.appendChild(createHoursTable(this.state.monthObject[this.state.currentDate.date() - 1].periodsForMeeting))
            this.getHTMLElementsCollection()
            this.addEventListeners()
            this.addEventListenersForHours()
        } catch (error) {
            if (error instanceof Error) console.log("Error: ", error.message)
        }

    }

    renderCalendar() {
        document.getElementById('calendarWidget')?.remove()
        const calendar = wrapperComponent()
        if (calendar.lastElementChild) calendar.lastElementChild.append(headerComponent(), calendarBodyComponent())
        document.body.appendChild(calendar)
    }

    getHTMLElements() {
        const calendarBody = document.getElementById('calendarBody')
        const header = document.getElementById('header')
        const headMonth = document.getElementById('headMonth')
        const headDay = document.getElementById('headDay')
        const reset = document.getElementById('reset')
        const prev = document.getElementById('prev')
        const next = document.getElementById('next')

        if (!calendarBody || !header || !headMonth || !headDay || !reset || !prev || !next) {
            throw Error('Sorry, something went wrong. Try to refresh the page.')
        }
        return {
            calendarBody,
            header,
            headMonth,
            headDay,
            reset,
            prev,
            next
        }
    }

    getHTMLElementsCollection() {
        ['days', 'hours'].forEach(el => {
            this.elements[el] = document.getElementsByClassName(el)
        })
    }

    navButtonHandler = (ev: Event) => {
        const button = ev.currentTarget as Element
        if (!['prev', 'next', 'reset'].includes(button.id)) {
            throw Error('Sorry, something went wrong. Try to refresh the page.')
        }
        switch (button.id) {
            case 'prev': this.state.currentMonth = this.state.currentMonth.subtract(1, 'month')
                break;
            case 'next': this.state.currentMonth = this.state.currentMonth.add(1, 'month')
                break;
            case 'reset': this.state.currentMonth = dayjs();
                break;
        }
        this.state.currentDate = dayjs().set('month', this.state.currentMonth.get('month'))
        this.removeEventsListeners()
        this.startCalendar(this.state.currentMonth)
    }

    dayButtonHandler = (ev: Event) => {
        const target = ev.currentTarget as Element

        const isDisabled = target.classList.value.includes('disabled')
        if (isDisabled) return

        const selectedDay = document.getElementsByClassName('selected')
        if (selectedDay[0]) {
            selectedDay[0].classList.remove('selected')
        }
        target.classList.add('selected')

        this.state.currentDate = this.state.currentDate.set('date', Number(target.id))

        if (this.state.monthObject) {
            this.elements.headDay.innerText = target.id
            this.removeEventListenersForHours()
            this.elements.header.lastChild?.replaceWith(createHoursTable(this.state.monthObject[Number(target.id) - 1].periodsForMeeting))
            this.addEventListenersForHours()
        }
    }

    hourButtonHandler = (ev: Event) => {
        const target = ev.currentTarget as Element
        if (target.classList.value.search('busy-period') != -1) return
        new Reservation(this.state.currentDate.set({ 'hour': Number(target.id.substr(0, 2)), 'minute': 0 }))
    }

    addEventListeners() {
        if (!this.elements.days || this.elements.days.length === 0) throw Error('Sorry, something went wrong. Try to refresh the page.')
        this.elements.prev.addEventListener('click', this.navButtonHandler)
        this.elements.next.addEventListener('click', this.navButtonHandler)
        this.elements.reset.addEventListener('click', this.navButtonHandler)
        for (let i = 0; i < this.elements.days.length; i++) {
            if (!this.elements.days[i].classList.value.includes('disabled')) {
                this.elements.days[i].addEventListener('click', this.dayButtonHandler)
            }
        }
    }

    removeEventsListeners() {
        if (this.elements.prev) this.elements.prev.removeEventListener('click', this.navButtonHandler)
        if (this.elements.next) this.elements.next.removeEventListener('click', this.navButtonHandler)
        if (this.elements.reset) this.elements.reset.removeEventListener('click', this.navButtonHandler)
        if (this.elements.days) {
            for (let i = 0; i < this.elements.days.length; i++) {
                this.elements.days[i].removeEventListener('click', this.dayButtonHandler)
            }
        }
    }

    addEventListenersForHours() {
        if (!this.elements.hours || this.elements.hours.length === 0) throw Error('Sorry, something went wrong. Try to refresh the page.')
        for (let i = 0; i < this.elements.hours.length; i++) {
            if (!this.elements.hours[i].classList.value.includes('busy-period')) {
                this.elements.hours[i].addEventListener('click', this.hourButtonHandler)
            }
        }
    }

    removeEventListenersForHours() {
        if (this.elements.hours) {
            for (let i = 0; i < this.elements.hours.length; i++) {
                this.elements.hours[i].removeEventListener('click', this.hourButtonHandler)
            }
        }
    }
}