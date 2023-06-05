import { Question } from './question';
import {createUrl, isDisabledButton, isValidValue} from "./utils";


const inputElement = document.getElementById('search-input');
const sendElement = document.getElementById('search-button');
const formElement = document.getElementById('form-search');

let responseResult = null;

formElement.addEventListener('submit', submitFormHandler);

function submitFormHandler(event) {
    event.preventDefault();
    isDisabledButton(sendElement);
    // const sendUrl = `https://api.github.com/search/repositories?q=${inputElement.value.trim()}&sort=stars&order=desc`;
    if (isValidValue(inputElement.value)) {
        Question.create(createUrl(inputElement.value))
            .then(response =>  Question.renderList(response.items))
            .then(response => isDisabledButton(sendElement))
            .catch(e => {
                console.error(e);
                isDisabledButton(sendElement);
            });
    } else {
        alert('Введите запрос в поле поиска!');
        isDisabledButton(sendElement);
    }
}