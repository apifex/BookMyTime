import dayjs from 'dayjs'
import updateLocal from 'dayjs/plugin/updateLocale'
import objectSupport from 'dayjs/plugin/objectSupport'

dayjs.extend(updateLocal)
dayjs.extend(objectSupport)

dayjs.updateLocale('en', {
    months: [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ],
    weekdays: [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ]
})

export default dayjs