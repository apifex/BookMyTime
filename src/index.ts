import _ from 'lodash'
import './style.scss'

import printMe from './print'
import { printComp } from './comp'

function component() {
    const element = document.createElement('div')
    const button = document.createElement('button')
    const button2 = document.createElement('button')
    const button3 = document.createElement('button')
    element.innerHTML = _.join(['Hello', 'Webpack'], ' ')
    element.classList.add('cool')

    button.innerHTML = "click me"
    button.onclick = printMe


    button2.innerHTML = "click me comp"
    button2.onclick = printComp
    button3.innerHTML = "a lala"
    
    element.appendChild(button2)
    element.appendChild(button)
    console.log('hello')
    return element
}

document.body.appendChild(component())