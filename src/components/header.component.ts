import { createElement } from '../utils/html/createHtmlElement'

export function headerComponent() {

    const headerComponent = createElement('div', ['wrap-header', 'd-flex', 'align-items-center', 'img'], 'wrap-header')
    headerComponent.style.backgroundImage = "url('https://i.guim.co.uk/img/media/6088d89032f8673c3473567a91157080840a7bb8/0_567_3840_2304/master/3840.jpg?width=1020&quality=85&auto=format&fit=max&s=3ad288353228d67132f5d946468ebfe8')"

    const header = createElement('div', ['p-0'], 'header')
    const todayBtn = createElement('p', undefined, 'reset', 'Today')

    const headerInfo = createElement('div', ['head-info'])
    const headMonth = createElement('div', ['head-month'], 'headMonth')
    
    const headDay = createElement('div', ['head-day'], 'headDay')


    headerInfo.appendChild(headMonth)
    headerInfo.appendChild(headDay)
    header.appendChild(headerInfo)
    headerComponent.appendChild(todayBtn)
    headerComponent.appendChild(header)

    return headerComponent
}
