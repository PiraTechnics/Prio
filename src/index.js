// Import our custom CSS
import './scss/styles.scss'
// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

import { renderList } from "./listView";
import * as storage from "./listController";

// To-Do Item DOM manupulation to add entries onto our page
//hardcoded for now 
const container = document.querySelector('.container');


let myList = [];

localStorage.clear(); //reset each time (for now)
storage.createTodo('Clean Kitchen', 'something something', '7-4-2023', true, true);
storage.createTodo('Do Taxes', 'left intentionally blank', '8-8-2022', false, true);
storage.createTodo('Plot World Domination', 'pretty self explanatory, tbh', '9/9/2024', true, false);

//access each stored item and push to our list for rendering
for (let i = 0; i < localStorage.length; i++) {
  let storedEntry = storage.readTodo(i);
  myList.push(storedEntry)
}

container.appendChild(renderList(myList));
//container.appendChild(renderList(storage.getAllEntries()));

//Testing Deletion

/* const deleteButton = document.createElement('button');
deleteButton.innerText = 'Delete EVERYTHING';
console.log(document.querySelector('tbody'));
deleteButton.addEventListener('click', () => {
  deleteTableRows(document.querySelector('tbody'))
});
container.appendChild(deleteButton); */