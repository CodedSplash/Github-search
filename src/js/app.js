import { Question } from './question';
import {
    changeButtonSearch,
    createUrl,
    getTotalPages,
    getTotalQueryPages,
    isDisabledButton,
    isValidValue
} from "./utils";
import {Repository} from "./repository";


const inputElement = document.getElementById('search-input'),
    sendElement = document.getElementById('search-button'),
    formElement = document.getElementById('form-search'),
    outputError = document.querySelector('.search__error');

document.addEventListener('DOMContentLoaded', event =>
    Repository.renderList(JSON.parse(localStorage.getItem('repositories'))), { once: true });

formElement.addEventListener('submit', submitFormHandler);

let fullListRepositories = [],
    totalQueryPages = 1,
    totalPages = 1,
    currentPage = 1;


function submitFormHandler(event) {
    event.preventDefault();
    outputError.innerText = '';
    isDisabledButton(sendElement);
    changeButtonSearch(sendElement, 'loading');

    if (isValidValue(inputElement.value)) {
        Question.create(createUrl(inputElement.value))
            .then(response => {
                fullListRepositories = [];
                currentPage = 1;
                totalPages = getTotalPages(response.total_count);
                totalQueryPages = getTotalQueryPages(response.total_count);
                response.items.forEach(rep => fullListRepositories.push(rep));
            })
            .then(response => {
                let requestList = [];
                for (let i = 1; i < totalQueryPages; i++) {
                    if (i === totalQueryPages) break;
                    requestList.push(Question.create(createUrl(inputElement.value, i + 1)));
                }
                return requestList;
            })
            .then(response => Promise.all(response))
            .then(response => {
                response.forEach(item => item.items.forEach(rep => fullListRepositories.push(rep)));
            })
            .then(response => Question.renderList(fullListRepositories, currentPage))
            .then(response => Question.renderPagination(currentPage, totalPages, fullListRepositories))
            .then(response => Repository.renderList(JSON.parse(localStorage.getItem('repositories')), fullListRepositories))
            .then(response => {
                changeButtonSearch(sendElement, 'search');
                isDisabledButton(sendElement);
            })
            .catch(e => {
                outputError.innerText = e;
                changeButtonSearch(sendElement, 'search');
                isDisabledButton(sendElement);
            })
    } else {
        outputError.innerText = 'Введите запрос в поле поиска!';
        changeButtonSearch(sendElement, 'search');
        isDisabledButton(sendElement);
    }
}