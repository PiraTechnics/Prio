// Import our custom CSS
import './scss/styles.scss'
// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

import { Todo } from "./todoModel";
import { renderList } from "./listView";
import * as storage from "./listController";

// To-Do Item DOM manupulation to add entries onto our page
//hardcoded for now 
const container = document.querySelector('.container');

const item1 = new Todo('Clean Kitchen', 'something something', '7-4-2023', true, false);
const item2 = new Todo('Do Taxes');
const item3 = new Todo('Plot World Domination');

localStorage.clear(); //reset each time (for now)

let myList = [];
storage.createNewTodo(item1);
storage.createNewTodo(item2);
storage.createNewTodo(item3);

//access each stored item and push to our list for rendering
for (let i = 0; i < localStorage.length; i++) {
  let storedEntry = Todo.fromJSON(storage.readTodo(i));
  myList.push(storedEntry)
}

container.appendChild(renderList(myList));



//Testing Deletion

/* const deleteButton = document.createElement('button');
deleteButton.innerText = 'Delete EVERYTHING';
console.log(document.querySelector('tbody'));
deleteButton.addEventListener('click', () => {
  deleteTableRows(document.querySelector('tbody'))
});
container.appendChild(deleteButton); */