export function isValidValue(value) {
    return value.length >= 1;
}

export function isDisabledButton(button) {
    return button.disabled = !button.disabled;
}

export function createUrl(searchValue, page = 1) {
    return `https://api.github.com/search/repositories?q=${searchValue.trim()}&page=${page}&per_page=100`;
}

export function getTotalPages(totalCount) {
    if (totalCount > 1000) return 100;
    if (totalCount < 1000) return Math.ceil(totalCount / 10);
}

export function getTotalQueryPages(totalCount) {
    if (totalCount > 1000) return 10;
    if (totalCount < 1000) return Math.ceil(totalCount / 100);
}

export function changeButtonSearch(button, type = 'search') {
    if (type === 'search') {
        return button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
        `;
    }
    if (type === 'loading') {
        return button.innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span class="visually-hidden">Загрузка...</span>
        `;
    }
}