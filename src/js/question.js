export class Question {
    static create(url) {
        return fetch(url)
            .then(response => response.json());
    }
    static renderList(response) {
        const questions = response;

        const html = questions.length
            ? questions.map(toCard).join('')
            : `<p style="font-size: 24px">Ничего не найдено</p>`;

        const list = document.querySelector('.row');

        list.innerHTML = html;
    }
}

function toCard(question) {
    return `
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <div class="card-content">
                            <h3 class="card-title">
                                <div class="card-title__body">
                                    <div class="card-title__logo">
                                        <img src="${question.owner.avatar_url}&size=40" alt>
                                    </div>
                                    <div class="card-title__link">
                                        <a href="${question.html_url}" target="_blank">${question.full_name}</a>
                                    </div>
                                </div>
                            </h3>
                            ${question.description ? `<p class="card-text">${question.description}</p>` : ''}
                            ${question.topics.length
                                ? `<div class="card-topics">${question.topics.map((topic, index)  => toBadge(topic, index)).join('')}</div>`
                                : ''
                            }
                            <div class="card-info">
                                <div class="card-info__language">${question.language ? question.language : ''}</div>
                                ${question.language ? `<span aria-hidden="true" class="card-info__circle">·</span>` : ''}
                                <a href="${question.stargazers_url.replace('api.', '').replace('repos/', '')}" target="_blank" class="card-info__stars">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
                                        <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
                                    </svg>
                                    <span class="card-info__stars-number">${getStars(question.stargazers_count)}</span>
                                </a>
                                <span aria-hidden="true" class="card-info__circle">·</span>
                                <div class="card-info__date">
                                    Обновлено
                                    <span class="card-info__date-date">
                                        ${getLastUpdate(question.pushed_at, question)}
                                        
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="card-buttons"></div>
                        <button type="button" class="btn card-buttons__btn">
                            <span class="card-buttons__btn-body">
                                <span class="card-buttons__btn-img">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
                                      <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
                                </svg>
                            </span>
                            <span class="card-buttons__btn-word">
                                Save
                            </span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        `
}

function toBadge(topic, index) {
    return !(index > 4)
        ? `<a href="https://github.com/topics/${topic}" target="_blank" class="badge rounded-pill text-bg-primary">${topic}</a>`
        : '';
}

function getStars(starsNumber) {
    if (starsNumber > 1000) return Math.floor(starsNumber / 1000) + 'k';
    if (starsNumber < 1000) return starsNumber;
}

const fixDate = date => date.replace('Z', '');
const getLastUpdate = date => isYear(fixDate(date))
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