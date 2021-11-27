import { createElement } from '../utils'

export function headerComponent() {

    const headerComponent = createElement('div', ['wrap-header', 'd-flex', 'align-items-center', 'img'], 'wrap-header')
    headerComponent.style.backgroundImage = "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')"

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
