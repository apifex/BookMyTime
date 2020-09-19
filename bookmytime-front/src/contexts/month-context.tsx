import React from 'react';

export const MonthContext = React.createContext({
    daysinmonth: 'zzz',
    daysUpdater: () => {}
})