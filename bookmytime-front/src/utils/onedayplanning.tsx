const oneDayPlanning = async (day: string) => {

       const periodsForMeeting = [
        {
            "start": `${day}T08:00:00+02:00`,
            "end": `${day}T08:55:00+02:00`,
            availble: true,
        },
        {
            "start": `${day}T09:00:00+02:00`,
            "end": `${day}T09:55:00+02:00`,
            availble: true,
        },
        {
            "start": `${day}T10:00:00+02:00`,
            "end": `${day}T10:55:00+02:00`,
            availble: true,
        },
        {
            "start": `${day}T11:00:00+02:00`,
            "end": `${day}T11:55:00+02:00`,
            availble: true,
        },
        {
            "start": `${day}T12:00:00+02:00`,
            "end": `${day}T12:55:00+02:00`,
            availble: true,
        },
        {
            "start": `${day}T13:00:00+02:00`,
            "end": `${day}T13:55:00+02:00`,
            availble: true,
        },
        {
            "start": `${day}T14:00:00+02:00`,
            "end": `${day}T14:55:00+02:00`,
            availble: true,
        },
        {
            "start": `${day}T15:00:00+02:00`,
            "end": `${day}T15:55:00+02:00`,
            availble: true,
        },
        {
            "start": `${day}T16:00:00+02:00`,
            "end": `${day}T16:55:00+02:00`,
            availble: true,
        },
        {
            "start": `${day}T17:00:00+02:00`,
            "end": `${day}T17:55:00+02:00`,
            availble: true,
        },
    ]
    
    const checkBusy = async (day:string) => {
                
        let dayToCheck = 
            {
                "timeMin": `${day}T08:00:00+02:00`,
                "timeMax": `${day}T18:00:00+02:00`
            }
        const response = await fetch ('http://localhost:4000/freebusy', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(dayToCheck)
          });
          const result = await response.json()
          return result
    }

    const busy = await checkBusy(day)

    for (let i = 0; i<busy.length; i++) {
        
        let busyevent = busy[i]
        for (let k = 0; k<periodsForMeeting.length; k++){
            let timeformeet = periodsForMeeting[k]
            if (busyevent.start>=timeformeet.start && busyevent.end<=timeformeet.end) timeformeet.availble = false
            if (timeformeet.start>=busyevent.start && timeformeet.end<=busyevent.end) timeformeet.availble = false
            if (timeformeet.end>busyevent.start && timeformeet.end<busyevent.end) timeformeet.availble = false
        }
    }
    
    return {day: periodsForMeeting} 
}

export default oneDayPlanning