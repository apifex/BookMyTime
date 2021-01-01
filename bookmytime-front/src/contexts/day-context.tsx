import React from 'react';

interface DayContextInterface {
    dayContext: {
                 date: 
                    {
                        id: number,
                        date: string,
                        dayOfWeek: number,
                        availble: boolean,
                        periodsForMeeting:
                        Array<{
                                start: string,
                                end: string,
                                availble: boolean
                              }>
                    },
                 visible:boolean
                }
    setDayContext: any
}

export const DayContext = React.createContext<DayContextInterface | null>(null)