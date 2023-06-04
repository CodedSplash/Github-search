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
                            <p class="card-text">${question.description}</p>
                            <div class="card-topics">
                                ${question.topics.map(topic => toBadge(topic)).join('')}
                            </div>
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
                                    Updated
                                    <span class="card-info__date-date">
                                        ${new Date(question.updated_at)}
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

function toBadge(topic) {
    return `
        <a href="https://github.com/topics/${topic}" target="_blank" class="badge rounded-pill text-bg-primary">${topic}</a>
    `
}

function getStars(starsNumber) {
    if (starsNumber > 1000) return Math.floor(starsNumber / 1000) + 'k';
    if (starsNumber < 1000) return starsNumber;
}