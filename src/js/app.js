import { Question } from './question';


const inputElement = document.getElementById('search-input');
const sendElement = document.getElementById('search-button');
const formElement = document.getElementById('form-search');

let responseResult = null;

formElement.addEventListener('submit', submitFormHandler);

function submitFormHandler(event) {
    event.preventDefault();
    sendElement.disabled = true;
    const sendUrl = `https://api.github.com/search/repositories?q=${inputElement.value.trim()}&sort=stars&order=desc`;
    Question.create(sendUrl)
        .then(response =>  Question.renderList(response.items))
        .then(response => sendElement.disabled = false)
        .catch(e => console.error(e));
}