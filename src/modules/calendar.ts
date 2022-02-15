import { Dayjs } from 'dayjs'
import dayjs from '../config/dayjs.config'

import { getCalendar } from '../api/api'
import { Reservation } from './reservation'

import { wrapperComponent, calendarBodyComponent, headerComponent } from '../components'
import { createHoursTable, createDaysTable } from '../utils'

import { IMonthObject, ICalendarWidget } from '../types'


export class CalendarWidget implements ICalendarWidget {
    state: {
        today: Dayjs,
        currentMonth: Dayjs,
        currentDate: Dayjs,
        monthObject: IMonthObject[] | null
    }
    elements: {
        calendarBody: HTMLElement,
        header: HTMLElement,
        headMonth: HTMLElement,
        headBodyMonth: HTMLElement,
        headBodyYear: HTMLElement,
        headDay: HTMLElement,
        reset: HTMLElement,
        close: HTMLElement,
        prev: HTMLElement,
        next: HTMLElement,
        days: HTMLCollectionOf<Element>,
        hours: HTMLCollectionOf<Element>
    }

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
            days: this.getHTMLElementsCollection('days'),
            hours: this.getHTMLElementsCollection('hours'),
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
            this.elements.headBodyYear.innerText = this.state.currentMonth.format('YYYY')
            this.elements.headBodyMonth.innerText = this.state.currentMonth.format('MMMM')
            this.elements.headDay.innerText = this.state.currentDate.format('DD')
            const hoursTable = document.getElementById('hoursTable')
            if (hoursTable) hoursTable.remove()
            this.elements.header.appendChild(createHoursTable(this.state.monthObject[this.state.currentDate.date() - 1].periodsForMeeting))
            this.elements.days = this.getHTMLElementsCollection('days')
            this.elements.hours = this.getHTMLElementsCollection('hours')
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
        const headBodyMonth = document.getElementById('headBodyMonth')
        const headBodyYear = document.getElementById('headBodyYear')
        const headDay = document.getElementById('headDay')
        const reset = document.getElementById('resetBtn')
        const close = document.getElementById('closeBtn')
        const prev = document.getElementById('prev')
        const next = document.getElementById('next')

        if (!calendarBody || !header || !headMonth || !headBodyMonth || !headBodyYear || !headDay || !reset || !close || !prev || !next) {
            throw Error('Sorry, something went wrong. Try to refresh the page.')
        }
        return {
            calendarBody,
            header,
            headMonth,
            headBodyMonth,
            headBodyYear,
            headDay,
            reset,
            close,
            prev,
            next
        }
    }

    getHTMLElementsCollection(el: string) {
        const collection = document.getElementsByClassName(el)
        return collection
    }

    navButtonHandler = (ev: Event) => {
        const button = ev.currentTarget as Element
        if (!['prev', 'next', 'resetBtn', 'closeBtn'].includes(button.id)) {
            throw Error('Sorry, something went wrong. Try to refresh the page.')
        }
        switch (button.id) {
            case 'prev': this.state.currentMonth = this.state.currentMonth.subtract(1, 'month')
                break;
            case 'next': this.state.currentMonth = this.state.currentMonth.add(1, 'month')
                break;
            case 'resetBtn': this.state.currentMonth = dayjs();
                break;
            case 'closeBtn': this.closeCalendar()
                return
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
        this.elements.close.addEventListener('click', this.navButtonHandler)
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
        if (this.elements.close) this.elements.close.removeEventListener('click', this.navButtonHandler)
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

    closeCalendar() {
        this.removeEventListenersForHours()
        this.removeEventsListeners()
        const calendarWidget = document.getElementById('calendarWidget')
        if (calendarWidget) calendarWidget.remove()
    }
}