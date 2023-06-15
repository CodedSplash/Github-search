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

export function getRepositoryId(event) {
    return Number(event.target.closest('.card').getAttribute('data-repository-id'));
}

export function getRepositoryObj(fullListRepositories, id) {
    return fullListRepositories.find(rep => rep.id === id);
}

export function getCurrentPage() {
    return Number(document.querySelector('.page-link.active').getAttribute('data-page'));
}

//=== Card functions =====================================================================================================================================================

export function toBadge(topic, index) {
    return index < 5
        ? `<a href="https://github.com/topics/${topic}" target="_blank" class="badge rounded-pill text-bg-primary">${topic}</a>`
        : '';
}

export function getStars(starsNumber) {
    if (starsNumber > 1000) return Math.floor(starsNumber / 1000) + 'k';
    if (starsNumber < 1000) return starsNumber;
}

const fixDate = date => date !== null ? date.replace('Z', '') : new Date(0);
export const getLastUpdate = date => isYear(fixDate(date))
    || isMonth(fixDate(date))
    || isDay(fixDate(date))
    || isHour(fixDate(date))
    || isMinute(fixDate(date))
    || isSecond(fixDate(date));

const monthNames = ['янв.', 'фев.', 'мар.', 'апр.', 'май.', 'июн.', 'июл.', 'авг.', 'сен.', 'окт.', 'ноя.', 'дек.'];

const changeYear = date => new Date().getFullYear() - new Date(date).getFullYear();
const changeMonth = date => new Date().getMonth() - new Date(date).getMonth();
const changeDay = date => new Date().getDate() - new Date(date).getDate();
const changeHour = date => new Date().getHours() - new Date(date).getHours();
const changeMinute = date => new Date().getMinutes() - new Date(date).getMinutes();
const changeSecond = date => new Date().getSeconds() - new Date(date).getSeconds();
const outputEndings = (date, endings, dataType, endingsDefault) => endings[new Date(date).dataType] ? `${endings[new Date(date).dataType]}` : `${endingsDefault}`;

function isYear(date) {
    if(changeYear(date))
        return `${new Date(date).getDate()} ${monthNames[new Date(date).getMonth()]}  ${new Date(date).getFullYear()} г.`;
}

function isMonth(date) {
    if(changeMonth(date))
        return `${new Date(date).getDate()} ${monthNames[new Date(date).getMonth()]}`;
}

function isDay(date) {
    if(changeDay(date) === 1)
        return 'вчера';
    if(changeDay(date))
        return `${new Date(date).getDate()} ${(new Date(date).getDate() > 4) ? 'дней' : 'дня'} назад`;
}

function isHour(date) {
    const endings = {
        1: 'час',
        2: 'часа',
        3: 'часа',
        4: 'часа',
        21: 'час',
        22: 'часа',
        23: 'часа',
        24: 'часа'
    };
    if(changeHour(date))
        return `${changeHour(date)} ${outputEndings(date, endings, 'getHours()', 'часов')} назад`;
}

function isMinute(date) {
    const endings = {
        1: 'минуту',
        2: 'минуты',
        3: 'минуты',
        4: 'минуты',
        21: 'минуту',
        22: 'минуты',
        23: 'минуты',
        24: 'минуты',
        31: 'минуту',
        32: 'минуты',
        33: 'минуты',
        34: 'минуты',
        41: 'минуту',
        42: 'минуты',
        43: 'минуты',
        44: 'минуты',
        51: 'минуту',
        52: 'минуты',
        53: 'минуты',
        54: 'минуты'
    };
    if(changeMinute(date))
        return `${changeMinute(date)} ${outputEndings(date, endings, 'getMinutes()', 'минут')} назад`;
}

function isSecond(date) {
    const endings = {
        1: 'секунду',
        2: 'секунды',
        3: 'секунды',
        4: 'секунды',
        21: 'секунду',
        22: 'секунды',
        23: 'секунды',
        24: 'секунды',
        31: 'секунду',
        32: 'секунды',
        33: 'секунды',
        34: 'секунды',
        41: 'секунду',
        42: 'секунды',
        43: 'секунды',
        44: 'секунды',
        51: 'секунду',
        52: 'секунды',
        53: 'секунды',
        54: 'секунды'
    };
    if(changeSecond(date))
        return `${changeSecond(date)} ${outputEndings(date, endings, 'getSeconds()', 'секунд')} назад`;
}

export function isSaveButton(outputRepositories) {
    const saveRepositories = JSON.parse(localStorage.getItem('repositories')) || [];

    saveRepositories.forEach(rep => {
        outputRepositories.forEach(outputRep => {
            if (rep.id === outputRep.id) outputRep.isSaveButton = !outputRep.isSaveButton;
        })
    });
}