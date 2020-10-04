import React from 'react';

interface DayContextInterface {
    dayContext: {date: Date,
                 visible:boolean}
    setDayContext: any
}

export const DayContext = React.createContext<DayContextInterface | null>(null)