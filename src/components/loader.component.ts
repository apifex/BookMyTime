import { createElement } from '../utils'

export function loaderComponent() {
    const loader = createElement('div', ['loader'], 'loader')
    loader.appendChild(createElement('div', ['typing_loader']))
    return loader
}