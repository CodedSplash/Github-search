import {
    getLastUpdate,
    getStars,
    toBadge,
    getRepositoryId,
    getRepositoryObj,
    getCurrentPage
} from "./utils";
import {Question} from "./question";

export class Repository {
    static addToLocaleStorage(fullListRepositories) {
        const saveButtons = document.querySelectorAll('.card-buttons__btn-save');
        saveButtons.forEach(btn => {
            btn.addEventListener('click', event => {
                let saveRepositories = JSON.parse(localStorage.getItem('repositories') || '[]');
                const repository = getRepositoryObj(fullListRepositories, getRepositoryId(event));
                let isAdd = true;
                let repositoryIndex = 0;
                saveRepositories.forEach((rep, index) => {
                    if (rep.id === repository.id) {
                        repositoryIndex = index;
                        isAdd = false;
                    }
                });
                if (isAdd) {
                    saveRepositories.push(repository);
                    localStorage.setItem('repositories', JSON.stringify(saveRepositories));
                    Repository.renderList(saveRepositories, fullListRepositories);
                    Question.renderList(fullListRepositories, getCurrentPage());
                }
                if (!isAdd) {
                    saveRepositories.splice(repositoryIndex, 1);
                    localStorage.setItem('repositories', JSON.stringify(saveRepositories));
                    Repository.renderList(saveRepositories, fullListRepositories);
                    Question.renderList(fullListRepositories, getCurrentPage());
                }
            }, { once: true });
        });
    }

    static removeRepository(fullListRepositories) {
        const fullRepositories = fullListRepositories;
        const removeButtons = document.querySelectorAll('.card-buttons__btn-remove');
        removeButtons.forEach(btn => {
            btn.addEventListener('click', event => {
                let saveRepositories = JSON.parse(localStorage.getItem('repositories'));
                const repositoryId = getRepositoryId(event);
                saveRepositories.forEach((rep, index) => {
                    if (rep.id === repositoryId) {
                        saveRepositories.splice(index, 1);
                        localStorage.setItem('repositories', JSON.stringify(saveRepositories));
                        Repository.renderList(saveRepositories, fullRepositories);
                    }
                });
            });
        });
    }

    static renderList(saveListRepositories, fullListRepositories = []) {
        const repositories = saveListRepositories || [];
        const fullRepositories = fullListRepositories;

        const html = JSON.stringify(repositories) !== '[]'
            ? repositories.map(toCard).join('')
            : `<p class="col-12">Список пустой.</p>`;

        const list = document.querySelector('.saved-repositories__body .row');

        list.innerHTML = html;
        Repository.removeRepository(fullRepositories);
        if (fullRepositories.length) Question.renderList(fullRepositories, getCurrentPage());
    }
}

function toCard(repository) {
    return `
            <div class="col-12">
                <div class="card" data-repository-id="${repository.id}">
                    <div class="card-body">
                        <div class="card-content">
                            <h3 class="card-title">
                                <div class="card-title__body">
                                    <div class="card-title__logo">
                                        <img src="${repository.owner.avatar_url}&size=40" alt>
                                    </div>
                                    <div class="card-title__link">
                                        <a href="${repository.html_url}" target="_blank">${repository.full_name}</a>
                                    </div>
                                </div>
                            </h3>
                            ${repository.description ? `<p class="card-text">${repository.description.replaceAll('</', '').replaceAll('<', '').replaceAll('>', '')}</p>` : ''}
                            ${repository.topics.length
                                ? `<div class="card-topics">${repository.topics.map((topic, index)  => toBadge(topic, index)).join('')}</div>`
                                : ''
                            }
                        <div class="card-info">
                            <div class="card-info__language">${repository.language ? repository.language : ''}</div>
                            ${repository.language ? `<span aria-hidden="true" class="card-info__circle">·</span>` : ''}
                            <a href="${repository.stargazers_url.replace('api.', '').replace('repos/', '')}" target="_blank" class="card-info__stars">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
                                    <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
                                </svg>
                                <span class="card-info__stars-number">${getStars(repository.stargazers_count)}</span>
                            </a>
                            <span aria-hidden="true" class="card-info__circle">·</span>
                            <div class="card-info__date">
                                Обновлено
                                <span class="card-info__date-date">
                                    ${getLastUpdate(repository.pushed_at, repository)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="card-buttons">
                        <button type="button" class="btn-close card-buttons__btn card-buttons__btn-remove" aria-label="Close"></button>
                    </div>
                </div>
            </div>
        </div>
    `
}