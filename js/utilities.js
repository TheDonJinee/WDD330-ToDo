export function qs(selector) {
    return document.getElementById(selector);;
}

export function onTouch(elementSelector, callback) {
    qs(elementSelector).addEventListener('touchend', e => e.currentTarget.click(callback), false);
}