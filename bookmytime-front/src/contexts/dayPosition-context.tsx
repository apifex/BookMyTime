import React from 'react';

interface DayPositionContextInterface {
    dayPositionContext: Array<number>,
    setDayPositionContext: any
}

export const DayPositionContext = React.createContext<DayPositionContextInterface | null>(null)