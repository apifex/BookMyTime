/// <reference types="react-scripts" />

interface IMonthProps{
    month: {
        m: number,
        y: number,
        length: number,
    }
}

interface IPeriodsForMeetings {
    start: string,
    end: string,
    availble: boolean,
}

interface IDaysInMonth {
    id: number,
    date: string,
    dayOfWeek: number,
    availble: boolean,
    periodsForMeeting: IPeriodsForMeetings[],
}

interface IDayStyled {
    top: number;
    left: number;
}

interface IBookingProps {
    targetHour: string,
    closeBooking: () => void,
}

interface IServerActionsProps {
    inputValue: {
        nameValue: string,
        mailValue: string,
        purposeValue: string,
        },
    start: string,
    end: string,
    targetHour: string,
}
