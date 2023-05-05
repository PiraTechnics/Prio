// Import our custom CSS
import './scss/styles.scss'
// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

import { Todo } from "./todoModel";
import { renderList } from "./listView";

// To-Do Item DOM manupulation to add entries onto our page
//hardcoded for now 
const container = document.querySelector('.container');

const item1 = new Todo('Clean Kitchen', 'something something', '7-4-2023', true);
const item2 = new Todo('Do Taxes');
const item3 = new Todo('Plot World Domination');

const myList = [];
myList.push(item1, item2, item3);

container.appendChild(renderList(myList));


//Testing Deletion

/* const deleteButton = document.createElement('button');
deleteButton.innerText = 'Delete EVERYTHING';
console.log(document.querySelector('tbody'));
deleteButton.addEventListener('click', () => {
  deleteTableRows(document.querySelector('tbody'))
});
container.appendChild(deleteButton); */