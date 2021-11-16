import { createElement } from "./createHtmlElement"

export function createFormElement(label: string, inputId: string, inputName: string) {
    const formElement = createElement('div', ['form-group'])
    const labelForElement = createElement('label', ['col-form-label'], undefined, label)
    labelForElement.setAttribute('for', inputId)
    const input = createElement('input', ['form-control'], inputId) as HTMLInputElement
    input.inputMode = 'text'
    input.name = inputName
    formElement.appendChild(labelForElement)
    formElement.appendChild(input)
    return formElement
}