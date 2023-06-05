export function isValidValue(value) {
    return value.length >= 1;
}

export function isDisabledButton(button) {
    return button.disabled = !button.disabled;
}

export function createUrl(searchValue, page = 1) {
    return `https://api.github.com/search/repositories?q=${searchValue.trim()}&page=${page}`;
}