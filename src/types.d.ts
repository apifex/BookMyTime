export interface ICalendarWidget {
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
        headDay: HTMLElement,
        reset: HTMLElement,
        close: HTMLElement,
        prev: HTMLElement,
        next: HTMLElement,
        days: HTMLCollectionOf<Element>,
        hours: HTMLCollectionOf<Element>
    }
}

export interface IMonthObject {
    id: number,
    date: string,
    dayOfWeek: number,
    availble: boolean,
    periodsForMeeting:
    {
        start: string,
        end: string,
        availble: boolean
    }[],
}

export interface IReservation {
    date: Dayjs
    hour: string
    day: string
    startTime: string
    endTime: string
    state: {
        [key: string]: string,
        name: string,
        email: string,
        subject: string,
        location: string
    }
    loaderState: boolean
    elements: IElements
}

interface IElements {
    reservationModal: HTMLElement,
    reservationForm: HTMLElement,
    confirmBtn: HTMLElement,
    cancelBtn: HTMLElement,
    inputName: HTMLInputElement,
    inputEmail: HTMLInputElement,
    inputSubject: HTMLInputElement,
    alert: HTMLElement,
}