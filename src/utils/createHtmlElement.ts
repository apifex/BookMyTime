export function createElement(tagName: string, classes?: string[], id?: string, innerText?: string) {
    const element = document.createElement(tagName)
    if (classes) classes.forEach(el => element.classList.add(el))
    if (id) element.id = id
    if (innerText) element.innerText = innerText
    return element
}