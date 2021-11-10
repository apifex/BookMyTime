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