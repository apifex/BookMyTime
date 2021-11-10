import dayjs, { Dayjs } from 'dayjs'
import updateLocal from 'dayjs/plugin/updateLocale'
import objectSupport from 'dayjs/plugin/objectSupport'
import { renderCalendar } from './utils/html/renderCalendar'
import { getCalendar } from './utils/api'
import { hoursComponent } from './components/hours.component'
import { reservationComponent } from './components/reservation.component'
import { IMonthObject } from './types'

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

export class CalendarWidget {
    state: {
        today: Dayjs,
        currentMonth: Dayjs,
        currentDate: Dayjs,
        monthObject: IMonthObject[] | undefined
    }

    constructor() {
        this.state = {
            today: dayjs(),
            currentMonth: dayjs(),
            currentDate: dayjs(),
            monthObject: undefined
        }
        this.startCalendar(this.state.currentMonth)
    }

    async startCalendar(date: Dayjs) {
        const monthObject = await getCalendar(date.get('year').toString(), date.get('month').toString())
        if (monthObject) {
            this.state.monthObject = monthObject
            renderCalendar(monthObject, this.state.currentMonth.format('MMMM - YYYY'), this.state.currentDate.format('D'))
            this.addEventListeners()
        } else {
            console.log('Internal error. Can not load calendar')
        }
    }

    navButtonHandler = (ev: Event) => {
        const button = ev.currentTarget as Element
        switch (button.id) {
            case 'pre-button': this.state.currentMonth = this.state.currentMonth.subtract(1, 'month')
                break;
            case 'next-button': this.state.currentMonth = this.state.currentMonth.add(1, 'month')
                break;
            case 'reset': this.state.currentMonth = dayjs();
                break;
        }
        this.state.currentDate = dayjs().set('month', this.state.currentMonth.get('month'))
        this.startCalendar(this.state.currentMonth)
    }

    clickDayHandler = (ev: Event) => {
        const target = ev.currentTarget as Element
        if (target.classList.value.search('disabled') != -1) return
        document.getElementsByClassName('selected')[0] ? document.getElementsByClassName('selected')[0].classList.remove('selected') : null
        target.classList.add('selected')
        this.state.currentDate = this.state.currentDate.set('date', Number(target.id))
        const dayDisplayed = document.getElementById('head-target')
        if (dayDisplayed) dayDisplayed.innerHTML = target.id
        if (this.state.monthObject) {
            document.getElementById('hours-wrap')?.replaceWith(hoursComponent(this.state.monthObject[Number(target.id) - 1].periodsForMeeting))
            this.addEventListeners()
        }
    }

    clickHourHandler = (ev: Event) => {
        const target = ev.currentTarget as Element
        if (target.classList.value.search('busy-period') != -1) return
        new reservationComponent(this.state.currentDate.set({ 'hour': Number(target.id.substr(0, 2)), 'minute': 0 }))
    }

    addEventListeners() {
        const reset = document.getElementById('reset')
        const previous = document.getElementById('pre-button')
        const next = document.getElementById('next-button')
        const days = document.getElementsByClassName('day')
        const hours = document.getElementsByClassName('hour')
        const reservation = document.getElementById('reservationModal')

        reset?.addEventListener('click', this.navButtonHandler)
        previous?.addEventListener('click', this.navButtonHandler)
        next?.addEventListener('click', this.navButtonHandler)
        reservation?.addEventListener('click', this.clickHourHandler)
        let daysLength = days.length
        while (daysLength--) {
            days[daysLength].addEventListener('click', this.clickDayHandler)
        }
        let hoursLength = hours.length
        while (hoursLength--) {
            hours[hoursLength].addEventListener('click', this.clickHourHandler)
        }
    }
}