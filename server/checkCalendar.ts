import { freeBusy } from './googleApis';

export interface IMonth {
    m: string,
    y: string,
    length: number,
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


export const checkCalendar = async ({y, m, length}: IMonth):Promise<IDaysInMonth[]> => {
    const timeMin = `${y}-${m}-01T00:00:00+00:00`
    const timeMax = `${y}-${m}-${length}T23:59:00+00:00`
    
    const busy = await freeBusy( timeMin, timeMax );
    

    const daysInMonth: IDaysInMonth[] = [];
    const periodsForMeeting: IPeriodsForMeetings[] = [
        {
            start: `08:00`,
            end: `08:55`,
            availble: true,
        },
        {
            start: `09:00`,
            end: `09:55`,
            availble: true,
        },
        {
            start: `10:00`,
            end: `10:55`,
            availble: true,
        },
        {
            start: `11:00`,
            end: `11:55`,
            availble: true,
        },
        {
            start: `12:00`,
            end: `12:55`,
            availble: true,
        },
        {
            start: `13:00`,
            end: `13:55`,
            availble: true,
        },
        {
            start: `14:00`,
            end: `14:55`,
            availble: true,
        },
        {
            start: `15:00`,
            end: `15:55`,
            availble: true,
        },
        {
            start: `16:00`,
            end: `16:55`,
            availble: true,
        },
        {
            start: `17:00`,
            end: `17:55`,
            availble: true,
        }
    ]

    for(let i = 1; i <= length; i++){
        let dayT = new Date(Date.UTC(Number(y), Number(m)-1, i));
        let day = `${dayT.getFullYear()}-${m}-${i>9?i:'0'+i}`
        let dayOfWeek = dayT.getDay()
        let isAvailble = true;
        
        if (dayT.getDay() === 0 || dayT.getDay() ===6) isAvailble = false;
        daysInMonth.push(
            {
                id: i,
                date: day,
                dayOfWeek: dayOfWeek,
                availble: isAvailble,
                periodsForMeeting: [
                    {
                        start: `08:00`,
                        end: `08:55`,
                        availble: true,
                    },
                    {
                        start: `09:00`,
                        end: `09:55`,
                        availble: true,
                    },
                    {
                        start: `10:00`,
                        end: `10:55`,
                        availble: true,
                    },
                    {
                        start: `11:00`,
                        end: `11:55`,
                        availble: true,
                    },
                    {
                        start: `12:00`,
                        end: `12:55`,
                        availble: true,
                    },
                    {
                        start: `13:00`,
                        end: `13:55`,
                        availble: true,
                    },
                    {
                        start: `14:00`,
                        end: `14:55`,
                        availble: true,
                    },
                    {
                        start: `15:00`,
                        end: `15:55`,
                        availble: true,
                    },
                    {
                        start: `16:00`,
                        end: `16:55`,
                        availble: true,
                    },
                    {
                        start: `17:00`,
                        end: `17:55`,
                        availble: true,
                    }
                ]
            }
        )
    }
    if (busy) {
    for(let i = 0; i < busy.length; i++) {
        let busyStart = busy[i].start
        let busyEnd = busy[i].end
        let dayIdx = Number(busyStart.slice(8,10))-1

        let needToAdd = false;
        let idStart = 0
        let idEnd = 0
        let searchStart = true;
        let daysDiffrence = Number(busyEnd.slice(8,10)) - Number(busyStart.slice(8,10))

        for(let k = 0; k < periodsForMeeting.length; k++) {
            if (busyStart.slice(11,16) <= periodsForMeeting[k].end && searchStart) {
                idStart = k
                needToAdd = true
                searchStart = false
            }
            if (busyEnd.slice(11,16) >= periodsForMeeting[k].end) {
                    idEnd = k
                    needToAdd = true
            } 
        }         

        if (needToAdd) {
            if (daysDiffrence === 0) {
                if (idStart === 0 && idEnd === periodsForMeeting.length-1) {
                    daysInMonth[dayIdx].availble = false
                } else {
                    for (let n = idStart; n <= idEnd; n++) {
                        daysInMonth[dayIdx].periodsForMeeting[n].availble = false
                    }
                }
            } else {
                for (let q = 0; q <= daysDiffrence; q++) {
                if (q === 0) {
                    if (idStart === 0) {
                        for (let m = 0; m < daysDiffrence; m++) {
                            daysInMonth[dayIdx+m].availble = false
                        } 
                    } else {
                            for(let p = idStart; p < periodsForMeeting.length; p++) {
                                daysInMonth[dayIdx].periodsForMeeting[p].availble = false
                            }
                        }
                } else if (q === daysDiffrence) {
                    for(let p = 0; p< idEnd ; p++) {
                        daysInMonth[dayIdx+q].periodsForMeeting[p].availble = false
                    }
                } else {                        
                    daysInMonth[dayIdx+q].availble = false
                }
                }
            }
            }
        if (daysInMonth[dayIdx].availble) {
            let x = 0;
            for (let z = 0; z < periodsForMeeting.length; z++) {
                if (!daysInMonth[dayIdx].periodsForMeeting[z].availble) x++ 
            }
            if (x === periodsForMeeting.length) {daysInMonth[dayIdx].availble = false}
        }
            
        }
    }   
    return daysInMonth
}
            