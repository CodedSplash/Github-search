import {getLastUpdate, getStars, toBadge} from "./cardFunctions";
import {Repository} from "./repository";

export class Question {
    static create(url) {
        return fetch(url)
            .then(response => {
                if (response.status === 403) throw 'Вы превысили лимит запросов. Подождите какое-то время и попробуйте сделать запрос снова.';
                return response;
            })
            .then(response => response.json());
    }
    static renderList(repositoryList, currentPage) {
        const repositories = repositoryList;

        const start = currentPage === 1 ? 0 : (currentPage * 10) - 10;
        const end = start + 10;
        const outputRepositories = repositories.slice(start, end);

        isSaveButton(outputRepositories);

        const html = repositories.length
            ? outputRepositories.map(toCard).join('')
            : `<p style="font-size: 24px">Ничего не найдено</p>`;

        const list = document.querySelector('.row');
        list.innerHTML = html;

        Repository.addToLocaleStorage(repositoryList);
    }

    static renderPagination(currentPage, totalPages, repositoryList) {
        const html = repositoryList.length
            ? `
            <ul class="pagination justify-content-center">
                <li class="page-item"><button class="page-link${currentPage === 1 ? ' disabled' : ''}" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>Назад</button></li>
                ${currentPage > 4
                ? `
                        <li class="page-item"><button class="page-link" data-page="1" aria-label="Страница 1">1</button></li>
                        <li class="page-item"><span class="page-link disabled" aria-label="Троеточие">...</span></li>
                    `
                : ''
            }
                ${toButtonsPagination(currentPage, totalPages)}
                ${currentPage < totalPages - 3
                ? `
                        <li class="page-item"><span class="page-link disabled" aria-label="Троеточие">...</span></li>
                        <li class="page-item"><button class="page-link" data-page="${totalPages}" aria-label="Страница ${totalPages}">${totalPages}</button></li>
                    `
                : ''
            }
                <li class="page-item"><button class="page-link${currentPage === totalPages ? ' disabled' : ''}" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>Вперёд</button></li>
            </ul>
        `
        : '';

        const paginationContainer = document.querySelector('.pagination-container');
        paginationContainer.innerHTML = html;

        const paginationButtons = document.querySelectorAll('.page-link');
        paginationButtons.forEach(btn => btn.addEventListener('click', (event) => {
            const selectedPage = Number(event.target.getAttribute('data-page'));
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            Question.renderList(repositoryList, selectedPage);
            Question.renderPagination(selectedPage, totalPages, repositoryList);
        }))
    }
}

function toCard(question) {
    return `
            <div class="col-12">
                <div class="card" data-repository-id="${question.id}">
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
                            ${question.description ? `<p class="card-text">${question.description.replaceAll('</', '').replaceAll('<', '').replaceAll('>', '')}</p>` : ''}
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
                        ${toSaveButton(question.isSaveButton)}
                    </div>
                </div>
            </div>
        `
}

function toSaveButton(isSaveButton) {
    if (isSaveButton) {
        return `
            <button type="button" class="btn card-buttons__btn card-buttons__btn-save">
                <span class="card-buttons__btn-body">
                    <span class="card-buttons__btn-img">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#eac54f" class="bi bi-star-fill" viewBox="0 0 16 16">
                      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                    </svg>
                </span>
                <span class="card-buttons__btn-word">
                    Save
                </span>
                </span>
            </button>
        `;
    } else {
        return `
            <button type="button" class="btn card-buttons__btn card-buttons__btn-save">
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
        `;
    }
}

function isSaveButton(outputRepositories) {
    const saveRepositories = JSON.parse(localStorage.getItem('repositories')) || [];

    saveRepositories.forEach(rep => {
        outputRepositories.forEach(outputRep => {
            if (rep.id === outputRep.id) outputRep.isSaveButton = true;
        })
    });
}

function toButtonsPagination(currentPage, totalPages) {
    const outputPages = [
        currentPage - 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        currentPage + 2
    ];
    if (totalPages < 6) {
        let outputRepositories = [];
        for (let i = 0; i < totalPages; i++) {
            outputRepositories.push(`
                <li class="page-item"><button class="page-link${currentPage === i + 1 ? ' active' : ''}" data-page="${i + 1}" aria-label="Страница ${i + 1}">${i + 1}</button></li>
            `);
        }
        return outputRepositories.join('');
    }
    if (currentPage > 4 && !(currentPage >= totalPages - 3)) {
        return `
            <li class="page-item"><button class="page-link" data-page="${outputPages[0]}" aria-label="Страница ${outputPages[0]}">${outputPages[0]}</button></li>
            <li class="page-item"><button class="page-link" data-page="${outputPages[1]}" aria-label="Страница ${outputPages[1]}">${outputPages[1]}</button></li>
            <li class="page-item"><button class="page-link active" data-page="${outputPages[2]}" aria-label="Страница ${outputPages[2]}">${outputPages[2]}</button></li>
            <li class="page-item"><button class="page-link" data-page="${outputPages[3]}" aria-label="Страница ${outputPages[3]}">${outputPages[3]}</button></li>
            <li class="page-item"><button class="page-link" data-page="${outputPages[4]}" aria-label="Страница ${outputPages[4]}">${outputPages[4]}</button></li>
        `;
    }
    if (currentPage >= totalPages - 3) {
        return `
            <li class="page-item"><button class="page-link${currentPage === totalPages - 5 ? ' active' : ''}" data-page="${totalPages - 5}" aria-label="Страница ${totalPages - 5}">${totalPages - 5}</button></li>
            <li class="page-item"><button class="page-link${currentPage === totalPages - 4 ? ' active' : ''}" data-page="${totalPages - 4}" aria-label="Страница ${totalPages - 4}">${totalPages - 4}</button></li>
            <li class="page-item"><button class="page-link${currentPage === totalPages - 3 ? ' active' : ''}" data-page="${totalPages - 3}" aria-label="Страница ${totalPages - 3}">${totalPages - 3}</button></li>
            <li class="page-item"><button class="page-link${currentPage === totalPages - 2 ? ' active' : ''}" data-page="${totalPages - 2}" aria-label="Страница ${totalPages - 2}">${totalPages - 2}</button></li>
            <li class="page-item"><button class="page-link${currentPage === totalPages - 1 ? ' active' : ''}" data-page="${totalPages - 1}" aria-label="Страница ${totalPages - 1}">${totalPages - 1}</button></li>
            <li class="page-item"><button class="page-link${currentPage === totalPages ? ' active' : ''}" data-page="${totalPages}" aria-label="Страница ${totalPages}">${totalPages}</button></li>
        `;
    }
    return `
        <li class="page-item"><button class="page-link${currentPage === 1 ? ' active' : ''}" data-page="1" aria-label="Страница 1">1</button></li>
        <li class="page-item"><button class="page-link${currentPage === 2 ? ' active' : ''}" data-page="2" aria-label="Страница 2">2</button></li>
        <li class="page-item"><button class="page-link${currentPage === 3 ? ' active' : ''}" data-page="3" aria-label="Страница 3">3</button></li>
        <li class="page-item"><button class="page-link${currentPage === 4 ? ' active' : ''}" data-page="4" aria-label="Страница 4">4</button></li>
        <li class="page-item"><button class="page-link${currentPage === 5 ? ' active' : ''}" data-page="5" aria-label="Страница 5">5</button></li>
        <li class="page-item"><button class="page-link${currentPage === 6 ? ' active' : ''}" data-page="6" aria-label="Страница 6">6</button></li>
    `;
}