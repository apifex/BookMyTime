import React from 'react';

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
  
  type IDayContext = {
    context: {day: IDaysInMonth,
            position: number[],
            visible: boolean},
    setContext: React.Dispatch<React.SetStateAction<{
        day: IDaysInMonth,
        position: number[],
        visible: boolean;
    }>>
  }

export const DayContext = React.createContext<Partial<IDayContext>>({})