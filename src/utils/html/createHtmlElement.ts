export function createElement(tagName: string, classes?: string[], id?: string, innerText?: string) {
    const element = document.createElement(tagName)
    classes ? classes.forEach(el => element.classList.add(el)) : null
    id ? element.id = id : null
    innerText ? element.innerText = innerText : null
    return element
}